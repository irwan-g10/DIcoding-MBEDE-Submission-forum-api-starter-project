/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadTableTestHelper = {
  async addThread({
    id = "thread-123",
    title = "sebuah thread title dari irwan",
    body = "sebuah thread body dari irwan",
    owner = "irwan-123",
    date = 'date'
  }) {
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, body, owner, date",
      values: [id, title, body, owner, date],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async findThreadById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadTableTestHelper;
