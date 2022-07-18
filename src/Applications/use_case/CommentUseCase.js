const NewComment = require("../../Domains/comments/entities/NewComment");

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async addComment(useCasePayload, thread, owner) {
    const newComment = new NewComment({ ...useCasePayload, thread, owner });

    return await this._commentRepository.addComment(newComment);
  }
  async getCommentsByThreadId(threadId) {
    return await this._commentRepository.getCommentsByThreadId(threadId);
  }
  async deleteComment(id) {
    return await this._commentRepository.deleteComment(id);
  }
}
module.exports = CommentUseCase;
