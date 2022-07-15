const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");

describe("ThreadUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const id = "user-123";
    const useCasePayload = {
      title: "sebuah thread dari irwan",
      body: "sebuah body thread dari irwan",
    };

    const expectedUseCasePayLoad = {
      id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: useCasePayload.owner,
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedUseCasePayLoad));

    /** creating use case instance */
    const getThreadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedNewThread = await getThreadUseCase.addThread(useCasePayload, id);

    // Assert
    expect(addedNewThread).toStrictEqual(expectedUseCasePayLoad);
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread({
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: id,
      })
    );
  });
});
