import pg from 'pg';

const { Pool } = pg;

class DatabaseService {
  constructor() {
    this._pool = new Pool();
  }

  async addReportInformation(userInformation) {
    const { username } = userInformation;

    const query = {
      text: 'INSERT INTO laporan(kontak) values($1)',
      values: [username],
    };

    await this._pool.query(query);
  }

  async updateUserAge(userInformation) {
    const { username, age } = userInformation;

    const query = {
      text: 'UPDATE laporan SET usia = $2 WHERE kontak = $1',
      values: [username, age],
    };

    await this._pool.query(query);
  }

  async updateUserGender(userInformation) {
    const { username, gender } = userInformation;

    const query = {
      text: 'UPDATE laporan SET jenis_kelamin = $2 WHERE kontak = $1',
      values: [username, gender],
    };

    await this._pool.query(query);
  }

  async updateUserDescription(userInformation) {
    const { username, desc } = userInformation;

    const query = {
      text: 'UPDATE laporan SET deskripsi = $2 WHERE kontak = $1',
      values: [username, desc],
    };

    await this._pool.query(query);
  }

  async getUserReport(userInformation) {
    const { username } = userInformation;

    const query = {
      text: 'SELECT usia, jenis_kelamin, deskripsi FROM laporan where kontak = $1',
      values: [username],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async addCounselingInformation(userInformation) {
    const { userName, userNumber } = userInformation;

    const query = {
      text: 'INSERT INTO konseling(nama, kontak) VALUES($1, $2)',
      values: [userName, userNumber],
    };

    await this._pool.query(query);
  }

  async getAnswerById(id) {
    const query = {
      text: 'SELECT deskripsi FROM faq WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      return 'Maaf, pertanyaan belum tersedia.';
    }

    const answer = result.rows[0].description;
    return answer;
  }

  async ValidateReportTimeDiff(userNumber) {
    const query = {
      text: 'SELECT created_at FROM report WHERE contact = $1 ORDER BY created_at DESC',
      values: [userNumber],
    };
    const result = await this._pool.query(query);

    if (result.rowCount) {
      const currentTimeInMiliSeconds = new Date().getTime();
      const reportTimeInMiliSeconds = new Date(result.rows[0].created_at).getTime();

      const timeDiff = Number(currentTimeInMiliSeconds) - Number(reportTimeInMiliSeconds);
      if (timeDiff < 10000) {
        throw new Error('Mohon tunggu beberapa saat untuk mengirim laporan kembali.');
      }
    }
  }
}

export default DatabaseService;
