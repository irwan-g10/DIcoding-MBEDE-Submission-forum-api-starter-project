const NewThread = require("../../Domains/threads/entities/NewThread");
class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async addThread(useCasePayload, id) {
    const newThread = new NewThread({ ...useCasePayload, owner: id });
    return this._threadRepository.addThread(newThread);
  }
}

module.exports = ThreadUseCase;
