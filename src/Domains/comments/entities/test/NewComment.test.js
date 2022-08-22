const NewComment = require("../NewComment");

describe("a NewThread entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      content: "abc",
      thread: "thread-123",
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      content: ["abc"],
      thread: { text: "halo" },
      owner: true,
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError(
      "NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should created addedNewComment correctly", () => {
    // Arrange
    const payload = {
      content: "sebuah comment dari irwan",
      thread: "thread-123",
      owner: "user-123",
    };

    // Action
    const newComment = new NewComment(payload);

    // Assert
    expect(newComment.id).toEqual(payload.id);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.thread).toEqual(payload.thread);
    expect(newComment.owner).toEqual(payload.owner);
  });
});
