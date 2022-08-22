const NewThread = require("../../../Domains/threads/entities/NewThread");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");

describe("ThreadUseCase", () => {
  it('should orchestrating the get thread action correctly', async () => {
    // arrange 
    const expectedUseCasePayload = {
      id: 'thread-123',
      title: 'thread irwan',
      body: 'thread body',
      date: '28/07/2022',
      username: 'irwan-g10'
    };

    
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(expectedUseCasePayload));
    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve(true));

    const getThreadUseCase = new ThreadUseCase({threadRepository: mockThreadRepository});

    const getThreadById = await getThreadUseCase.getThreadById(expectedUseCasePayload.id);

    // Assert
    expect(getThreadById).toStrictEqual(expectedUseCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      // new DetailThread({
      //   id: expectedUseCasePayload.id,
      //   title: expectedUseCasePayload.title,
      //   body: expectedUseCasePayload.body,
      //   date: expectedUseCasePayload.date,
      //   username: expectedUseCasePayload.username,
      // })
      expectedUseCasePayload.id
    );


  })
  it("should orchestrating the add thread action correctly", async () => {
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
      owner: id,
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
