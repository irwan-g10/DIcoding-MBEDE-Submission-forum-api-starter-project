const AddedNewThread = require("../../Domains/threads/entities/AddedNewThread");
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
      text: "INSERT INTO threads VALUES($1,$2,$3, $4) RETURNING id, title, body, owner",
      values: [id, title, body, owner],
    };

    const result = await this._pool.query(query);

    return new AddedNewThread({ ...result.rows[0] });
  }
}

module.exports = ThreadRepositoryPostgres;
