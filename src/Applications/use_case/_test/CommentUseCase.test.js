const CommentRepository = require("../../../Domains/comments/CommentRepository");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
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

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new CommentUseCase({
      commentRepository: mockCommentRepository,
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
});
