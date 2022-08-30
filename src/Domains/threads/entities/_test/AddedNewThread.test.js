const AddedNewThread = require("../AddedNewThread");

describe("a AddedNewThread entities", () => {
  it("should throw error when payload not contain needed property", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "abc",
    };

    // Action & Assert
    expect(() => new AddedNewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "abc",
      body: { text: "halo" },
      owner: "user-123",
      date: '10-12-2000'
    };

    // Action & Assert
    expect(() => new AddedNewThread(payload)).toThrowError(
      "NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
  it("should created addedNewUser correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "sebuah thread title dari irwan",
      body: "sebuah thread body dari irwan",
      owner: "user-123",
      date: '10-12-2000'
    };

    // Action
    const addedNewThread = new AddedNewThread(payload);

    // Assert
    expect(addedNewThread.id).toEqual(payload.id);
    expect(addedNewThread.title).toEqual(payload.title);
    expect(addedNewThread.body).toEqual(payload.body);
    expect(addedNewThread.owner).toEqual(payload.owner);
    expect(addedNewThread.date).toEqual(payload.date);
  });
});
