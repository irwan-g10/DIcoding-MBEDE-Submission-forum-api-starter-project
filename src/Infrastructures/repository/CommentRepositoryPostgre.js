const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedNewComment = require("../../Domains/comments/entities/AddedNewComment");
const DetailComment = require("../../Domains/comments/entities/DetailComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: "INSERT INTO comments VALUES($1, $2,$3, $4) RETURNING id, content, owner, thread",
      values: [id, owner, thread, content],
    };

    const result = await this._pool.query(query);
    return new AddedNewComment(result.rows[0]);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.content, comments.date, comments.is_delete, users.username
      FROM comments
      INNER JOIN users ON users.id = comments.owner
      WHERE comments.thread = $1 
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const detail = result.rows.map((comment) => new DetailComment(comment));

    return detail;
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1 AND owner = $2',
      values: [id, owner]
    }
    
    const result  = await this._pool.query(query);
    
    if(result.rows.length === 0) {
      throw new AuthorizationError('anda tidak berhak menghapus comment');
    }
  }

  async verifyAvailableComment(id) {
      const query = {
        text: `SELECT * 
        FROM comments 
        WHERE id = $1 `,
        values: [id],
      };
      
      const result = await this._pool.query(query);
      
      if (result.rows.length === 0) {
        // console.log(result.rows[0]);
        throw new NotFoundError("Comment tidak ada");
      }
      
    
  }

  async deleteComment(id) {
    const query = {
      text: "UPDATE comments SET is_delete = true WHERE comments.id = $1",
      values: [id],
    };

    await this._pool.query(query);

  }
}

module.exports = CommentRepositoryPostgres;
