/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    owner = "irwan_g10",
    thread = "thread-123",
    content = "comment ini dibuat oleh irwan",
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1,$2,$3,$4)",
      values: [id, owner, thread, content],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_delete, users.username
      FROM comments
      INNER JOIN users ON users.id = comments.owner
      WHERE comments.thread = $1`,
      values: [threadId],
    };

    const result = await pool.query(query);
    return result.rows
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },
};

module.exports = CommentsTableTestHelper;
