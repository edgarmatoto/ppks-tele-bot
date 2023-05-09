require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

bot.hears(['Hi', 'Hello', 'Halo'], (ctx) => ctx.reply(`Halo! Selamat datang di layanan Penanganan dan Pengaduan Pelecehan Seksual :).

Kami siap membantu Anda untuk menemukan informasi dan sumber daya yang Anda butuhkan untuk mengatasi situasi yang mungkin Anda alami. 

Silahkan ketik /layanan di kolom pesan untuk melihat daftar layanan.`));

bot.start((ctx) => ctx.reply(`Halo! Selamat datang di layanan Penanganan dan Pengaduan Pelecehan Seksual :).

Kami siap membantu Anda untuk menemukan informasi dan sumber daya yang Anda butuhkan untuk mengatasi situasi yang mungkin Anda alami. 

Silahkan ketik /layanan di kolom pesan untuk melihat daftar layanan.`
));

bot.command('layanan', (ctx) => {
  ctx.reply(
    `Silahkan pilih layanan yang anda butuhkan:

1. Pengaduan laporan kekerasan seksual.
2. Bimbingan konseling dengan satgas ppks.
3. Saran dan tips untuk menghindari kekerasan seksual.
4. Tanya jawab seputar kekerasan seksual.`,

    Markup.inlineKeyboard([
      Markup.button.callback("1", "1"),
      Markup.button.callback("2", "2"),
      Markup.button.callback("3", "3"),
      Markup.button.callback("4", "4"),
    ]),
    
  )}
);

bot.action("1", async (ctx) => {
	ctx.reply(`Untuk melakukan pelaporan, silakan ketik '/lapor' di kolom pesan dilanjutkan dengan deskripsi kejadian anda.

Contoh: /lapor Saya, (nama lengkap korban), melaporkan bahwa saya telah mengalami pelecehan seksual oleh seseorang yang saya kenal. Kejadian ini terjadi pada (tanggal dan waktu kejadian) di (lokasi kejadian). 
(Deskripsi kejadian)...
  
*#* Kami memastikan bahwa *semua informasi yang Anda berikan akan dijaga kerahasiaannya dan tidak akan dibagikan tanpa persetujuan Anda*. Kami berkomitmen untuk memberikan dukungan dan bimbingan dalam setiap tahap proses pengaduan dan akan memastikan bahwa Anda merasa aman dan terlindungi.`
  );
});

bot.action("2", async (ctx) => {
	ctx.reply(`Jika Anda membutuhkan bantuan
lebih lanjut dalam mencari pihak konseling, silakan hubungi *+628xxxxx* untuk mendapatkan bimbingan konseling dengan Satgas PPKS. Kami siap membantu Anda dalam memperoleh dukungan yang Anda butuhkan.`
  );
});

bot.action("3", async (ctx) => {
	ctx.reply(`Berikut adalah beberapa saran dan tips yang dapat membantu Anda menghindari kekerasan seksual:

1. *Waspadai lingkungan sekitar Anda.* Selalu perhatikan lingkungan Anda dan hindari tempat-tempat yang tidak aman ataterpencil, terutama pada malam hari.

2. *Kenali orang-orang di sekitar Anda.* Usahakan untuk mengenal orang-orang di sekitar Anda dengan baik, termasuteman-teman dan rekan kerja, sehingga Anda dapat lebih mudah mendeteksi perilaku yang mencurigakan.

3. *Pelajari tanda-tanda kekerasan seksual.* Ada beberapa tanda-tanda kekerasan seksual yang perlu Anda ketahui, sepertpergaulan yang terlalu intens, permintaan seksual yang tidak diinginkan, dan ancaman atau kekerasan.

4. *Percayalah pada insting Anda.* Jangan abaikan perasaan Anda jika Anda merasa tidak nyaman dengan situasi atau orantertentu. Percayalah pada insting Anda dan segera lakukan tindakan yang tepat untuk menjaga keselamatan Anda.

5. *Hindari minuman beralkohol yang berlebihan.* Minuman beralkohol dapat membuat Anda kehilangan kewaspadaan dan membuaAnda lebih rentan menjadi korban kekerasan seksual. Jangan minum terlalu banyak dan selalu waspadai minuman Anda.

6. *Miliki teman yang bisa dipercaya.* Selalu berpergian bersama teman atau kelompok yang bisa dipercaya dan yang dapamembantu Anda dalam situasi yang tidak aman.

7. *Laporkan kejadian kekerasan seksual.* Jangan ragu untuk melapor jika Anda menjadi korban kekerasan seksualBerbicaralah dengan seseorang yang bisa dipercaya, seperti keluarga atau teman, atau laporkan kejadian tersebut ke polisatau lembaga terkait`
  );
});

bot.action("4", async (ctx) => {
	ctx.reply(`Silahkan ketik '/tanya' di kolom pesan dilanjutkan dengan pertanyaan anda.

_Contoh: /tanya bagaimana cara menghindari pelecehan seksual?_`
  );
});

bot.on('message', async (ctx) => {
  const message = ctx.message.text;
  console.log('message :>> ', message);
  // Callback akan dieksekusi ketika pesan dimulai dengan "/tanya"
  if (message.startsWith('/lapor')) {
    const content = message.slice(7);

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.PPKS_EMAIL,
      subject: `${new Date().toISOString()} Laporan Pengaduan Pelecehan Seksual`,
      text: content
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        ctx.reply(`Terima kasih, laporan anda telah dikirim ke satgas PPKS. Jika Anda bersedia, *kami menyarankan Anda untuk melakukan konseling dengan Satgas PPKS* untuk mendapatkan dukungan dan bimbingan lebih lanjut.
    
* Kami ingin menekankan bahwa tidak ada alasan untuk merasa malu atau ragu untuk memberikan identitas saat membuat pengaduan terkait kekerasan seksual. Menyatakan identitas Anda dapat membantu mempercepat proses investigasi dan membantu pihak berwenang dalam menangani kasus Anda dengan lebih baik.
`);
        setTimeout(() => {
          ctx.reply(`Halo, apa kabar? Kami harap kamu baik-baik saja setelah kejadian beberapa waktu yang lalu. Kami ingin menanyakan bagaimana keadaanmu sekarang setelah melaporkan kasus pelecehan seksual yang kamu alami.

Saya tahu bahwa hal ini pasti tidak mudah bagi kamu, namun saya yakin bahwa kamu sudah mengambil langkah yang tepat dengan melapor ke pihak berwajib.
          
Jangan ragu untuk menghubungi satgas PPKS jika kamu membutuhkan teman untuk berbicara atau sekadar mencari dukungan. Kami selalu siap mendengarkan dan membantu kamu dalam menghadapi masalah ini.
          
Semoga kamu cepat pulih dan bisa kembali melakukan aktivitas sehari-hari dengan nyaman. Terima kasih. `);
        }, 10000);
      }
    });
  } else if (message.startsWith('/tanya')) {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "Berperanlah sebagai pemberi saran dan solusi dalam masalah penanganan pelecehan seksual."},
        {role: "user", content: message.slice(7)}
      ],
      temperature: 0,
    });
    ctx.reply(completion.data.choices[0].message.content);
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));