const NewComment = require("../../Domains/comments/entities/NewComment");

class CommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async addComment(useCasePayload, thread, owner) {
    const newComment = new NewComment({ ...useCasePayload, thread, owner });

    return await this._commentRepository.addComment(newComment);
  }
}
module.exports = CommentUseCase;
