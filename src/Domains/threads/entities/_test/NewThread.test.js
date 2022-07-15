const NewThread = require("../NewThread");

fdescribe("a NewThread entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      title: "abc",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "abc",
      body: { text: "halo" },
      owner: "irwan-123",
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
