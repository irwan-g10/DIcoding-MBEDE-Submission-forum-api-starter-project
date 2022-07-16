const AddedNewComment = require("../AddedNewComment");

describe("a AddedNewThread entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "abc",
    };

    // Action & Assert
    expect(() => new AddedNewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "abc",
      thread: { text: "halo" },
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new AddedNewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it("should created addedNewComment correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "sebuah comment dari irwan",
      thread: "thread-123",
      owner: "user-123",
    };

    // Action
    const addedNewComment = new AddedNewComment(payload);

    // Assert
    expect(addedNewComment.id).toEqual(payload.id);
    expect(addedNewComment.content).toEqual(payload.content);
    expect(addedNewComment.thread).toEqual(payload.thread);
    expect(addedNewComment.owner).toEqual(payload.owner);
  });
});
