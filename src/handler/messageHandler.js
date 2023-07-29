import DatabaseService from '../service/DatabaseService.js';
import EmailService from '../service/EmailService.js';
import PromptService from '../service/PromptService.js';

async function handleMessage(ctx) {
  const messageBody = ctx.message.text.toLowerCase();

  const greetingKeywords = ['hi', 'hello', 'halo', 'hai', 'helo', 'p', 'menu', '/menu', 'layanan'];
  const serviceOptions = [
    'Pengaduan laporan kekerasan seksual.',
    'Bimbingan konseling dengan satgas ppks.',
    'Saran dan tips untuk menghindari kekerasan seksual.',
    'FAQ seputar kekerasan seksual.',
    'Pertanyaan lain seputar kekerasan seksual',
  ];

  //  handle message
  if (greetingKeywords.includes(messageBody)) {
    const userContact = await ctx.getChat();
    const name = userContact.first_name;
    ctx.reply(`Halo ${name}! Selamat datang di layanan Penanganan dan Pengaduan Pelecehan Seksual :).\n\nKami siap membantu Anda untuk menemukan informasi dan sumber daya yang Anda butuhkan untuk mengatasi situasi yang mungkin Anda alami. Silahkan ketik atau klik /layanan untuk melihat daftar layanan.\n\nDapatkan informasi mengenai PPKS melalui website kami: https://ppks-web.vercel.app/`);

  } else if (messageBody.startsWith('/contoh')) {
    const userContact = await ctx.getChat();
    const name = userContact.first_name;

    ctx.reply(`_Contoh:_ !lapor Nama saya ${name}, melaporkan bahwa saya telah mengalami pelecehan seksual oleh seseorang pria yang saya tidak kenal. Kejadian ini terjadi pada hari senin tanggal 12 Mei 2023 di lingkungan kampus XYZ.\n(Deskripsi kejadian)...`);
  } else if (messageBody.startsWith('!lapor')) {
    const databaseService = new DatabaseService();
    const emailService = new EmailService();

    const userContact = await ctx.getChat();
    const name = userContact.first_name;
    const username = `@${userContact.username}`;
    const reportDescription = messageBody.slice(7);

    try {
      await databaseService.ValidateReportTimeDiff(username);

      await databaseService.addReport({ name, username, reportDescription });
      await emailService.sendEmail({ name, username, reportDescription });

      ctx.reply(`Terima kasih ${name}, laporan anda telah dimasukkan ke dalam data satgas PPKS.\n\nJika Anda bersedia, *kami sangat-sangat menyarankan Anda untuk melakukan konseling dengan Satgas PPKS* untuk mendapatkan dukungan dan bimbingan lebih lanjut\n\nKami memastikan bahwa *semua informasi yang Anda berikan akan dijaga kerahasiaannya*. Kami berkomitmen untuk memberikan dukungan dan bimbingan dalam setiap tahap proses pengaduan dan akan memastikan bahwa Anda merasa aman dan terlindungi.`);
    } catch (error) {
      ctx.reply(error.message);
    }
  } else if (messageBody.match(/^\/faq\d+$/)) {
    const databaseService = new DatabaseService();

    const id = messageBody[4];
    const answer = await databaseService.getAnswerById(id);

    ctx.reply(answer);
  } else if (messageBody.startsWith('!tanya')) {
    ctx.reply('Tunggu sebentar..');

    const promptService = new PromptService();
    // const currentTimeMs = new Date().getTime();
    const userContact = await ctx.getChat();
    const name = userContact.first_name;
    const prompt = messageBody.slice(7);

    try {
      // await promptService.validatePromptTimeDiff(currentTimeMs);

      const response = await promptService.generatePrompt(name, prompt);
      ctx.reply(response);
    } catch (error) {
      ctx.reply(error.message);
    }
  }
}

export default handleMessage;