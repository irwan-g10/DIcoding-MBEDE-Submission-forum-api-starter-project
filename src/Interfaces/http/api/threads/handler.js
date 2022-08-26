const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");
const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;
    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id } = request.auth.credentials;
    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread(request.payload, id);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;

    const threadUseCase = this._container.getInstance(ThreadUseCase.name);
    // const commentsUseCase = this._container.getInstance(CommentUseCase.name);

    const thread = await threadUseCase.getThreadById(threadId);
    // const getComments = await commentsUseCase.getCommentsByThreadId(threadId);
    // const thread = { ...getThread, comments: getComments };

    const response = h.response({
      status: "success",
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
