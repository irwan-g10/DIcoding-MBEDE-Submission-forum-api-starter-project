const NewComment = require("../../Domains/comments/entities/NewComment");

class CommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async addComment(useCasePayload, thread, owner) {
    // console.log(thread);
    await this._threadRepository.verifyAvailableThread(thread);
    const newComment = new NewComment({ ...useCasePayload, thread, owner });

    return await this._commentRepository.addComment(newComment);
  }
  async getCommentsByThreadId(threadId) {
    return await this._commentRepository.getCommentsByThreadId(threadId);
  }
  async deleteComment(id, owner) {
    // console.log('a');
    await this._commentRepository.verifyAvailableComment(id);
    await this._commentRepository.verifyCommentOwner(id, owner);

    return await this._commentRepository.deleteComment(id);
  }
}
module.exports = CommentUseCase;
