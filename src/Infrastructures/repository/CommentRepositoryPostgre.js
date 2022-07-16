const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedNewComment = require("../../Domains/comments/entities/AddedNewComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    // console.log({ ...newComment, id });

    const query = {
      text: "INSERT INTO comments VALUES($1, $2,$3, $4) RETURNING id, content, owner, thread",
      values: [id, owner, thread, content],
    };

    const result = await this._pool.query(query);
    return new AddedNewComment({ ...result.rows[0] });
  }
}

module.exports = CommentRepositoryPostgres;
