const NewThread = require("../../Domains/threads/entities/NewThread");
class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;    
  }

  async addThread(useCasePayload, id) {
    const newThread = new NewThread({ ...useCasePayload, owner: id });
    return this._threadRepository.addThread(newThread);
  }

  async getThreadById(id) {
    await this._threadRepository.verifyAvailableThread(id);
    
    const thread = await this._threadRepository.getThreadById(id);
    const comment = await this._commentRepository.getCommentsByThreadId(id);
    thread.comments = comment

    // console.log(thread)

    return  thread
  }
}

module.exports = ThreadUseCase;
