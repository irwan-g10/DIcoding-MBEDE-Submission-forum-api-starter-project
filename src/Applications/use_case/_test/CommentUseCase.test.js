const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    //Arrange

    const thread = "thread-123";
    const owner = "user-123";

    const useCasePayload = {
      content: "content dari irwan",
    };

    const expectedAddedComment = {
      id: "user-123",
      content: useCasePayload.content,
      thread: thread,
      owner: owner,
    };

    const threadUseCasePayload = {
      title: "sebuah thread dari irwan",
      body: "sebuah body thread dari irwan",
    };

    const expectedThreadUseCasePayLoad = {
      id: "thread-123",
      title: threadUseCasePayload.title,
      body: threadUseCasePayload.body,
      owner: "user-123",
    };

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedThreadUseCasePayLoad));
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(true));

    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    //   Action
    
    const addedNewComment = await getCommentUseCase.addComment(
      useCasePayload,
      thread,
      owner
    );

    // Assert
    expect(addedNewComment).toStrictEqual(expectedAddedComment);
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment({
        content: useCasePayload.content,
        thread,
        owner,
      })
    );
  });

  it('should orchestrating the get comment action correctly', async () => {
      // arrange

      const thread = "thread-123";

    const expectedAddedComment = [{
      id: "user-123",
      content: 'content dari irwan',
      date: '10-12-2022',
      is_delete: true,
      username: 'user-123',
    }];

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment));

    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    const getCommentsByThreadId = await getCommentUseCase.getCommentsByThreadId(thread)

    expect(getCommentsByThreadId).toEqual(expectedAddedComment);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      thread
    )
  })

  it('should delete comments action correctly', async () => {
    const thread = "thread-123";

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve(true));
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve(true));

    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository
    });

    await getCommentUseCase.deleteComment(thread);
  })
});
