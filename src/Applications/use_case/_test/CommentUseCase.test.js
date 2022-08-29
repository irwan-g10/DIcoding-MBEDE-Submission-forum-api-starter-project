const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedNewComment = require("../../../Domains/comments/entities/AddedNewComment");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const AddedNewThread = require("../../../Domains/threads/entities/AddedNewThread");
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

    const expectedAddedComment = new AddedNewComment({
      id: "comment-123",
      content: useCasePayload.content,
      thread,
      owner,
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyAvailableThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new AddedNewComment({
        id: 'comment-123',
        content: useCasePayload.content,
        thread,
        owner
      })));


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
    // console.log(addedNewComment, '\n', expectedAddedComment);

    // Assert
    expect(addedNewComment).toStrictEqual(expectedAddedComment);
    expect(mockThreadRepository.verifyAvailableThread).toBeCalledWith(thread)
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

    const expectedAddedComment = [new DetailComment({
      id: "comment-123",
      content: 'content dari irwan',
      date: '10-12-2022',
      is_delete: true,
      username: 'user-123',
    })];

    const mockCommentRepository = new CommentRepository();
    // const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve(
        [new DetailComment({
          id: 'comment-123',
          content: 'content dari irwan',
          date: '10-12-2022',
          is_delete: true,
          username: 'user-123'
        })]
      ));

    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: {}
    });

    const getCommentsByThreadId = await getCommentUseCase.getCommentsByThreadId(thread)

    expect(getCommentsByThreadId).toEqual(expectedAddedComment);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      thread
    )
  })

  it('should delete comments action correctly', async () => {
    // const thread = "thread-123";
    const owner = 'user-123';
    const comment = 'comment-123';

    const mockCommentRepository = new CommentRepository();
    // const mockThreadRepository = new ThreadRepository();

    mockCommentRepository.verifyAvailableComment = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn().mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve());

    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: {}
    });

    await getCommentUseCase.deleteComment(comment, owner);

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      comment
    )
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      comment, owner
    )
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      comment
    )
  })
});
