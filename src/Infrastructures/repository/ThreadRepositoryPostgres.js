const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AddedNewThread = require("../../Domains/threads/entities/AddedNewThread");
const DetailThread = require("../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO threads VALUES($1,$2,$3, $4) RETURNING id, title, body, owner, date",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedNewThread({ ...result.rows[0] });
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.id, threads.title, threads.body, threads.date, users.username 
      FROM threads 
      INNER JOIN users ON users.id = threads.owner
      WHERE threads.id = $1 `,
      values: [id],
    };

    const result = await this._pool.query(query);

    return new DetailThread({ ...result.rows[0] });
  }

  async verifyAvailableThread(id) {
    const query = {
      text: `SELECT * 
      FROM threads 
      WHERE id = $1 `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0]) {
      throw new NotFoundError("Thread tidak ada");
    }
  }
}

module.exports = ThreadRepositoryPostgres;
