const NewThread = require("../../../Domains/threads/entities/NewThread");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadUseCase = require("../ThreadUseCase");
const AddedNewThread = require("../../../Domains/threads/entities/AddedNewThread");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");

describe("ThreadUseCase", () => {
  it('should orchestrating the get thread action correctly', async () => {
    // arrange 
    const expectedUseCasePayload = new DetailThread({
      id: 'thread-123',
      title: 'thread irwan',
      body: 'thread body',
      date: '28/07/2022',
      username: 'irwan-g10'
    });
    expectedUseCasePayload.comments = new DetailComment({
      id: 'comment-123',
      content: 'content 123',
      date: '28/07/2022',
      is_delete: false,
      username: 'irwan-g10'
    })
    // console.log(expectedUseCasePayload);

    
    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() => Promise.resolve(new DetailThread({
      id: 'thread-123',
      title: 'thread irwan',
      body: 'thread body',
      date: '28/07/2022',
      username: 'irwan-g10'
    })));
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockImplementation(() => Promise.resolve(new DetailComment({
      id: 'comment-123',
      content: 'content 123',
      date: '28/07/2022',
      is_delete: false,
      username: 'irwan-g10'
    })))

    mockThreadRepository.verifyAvailableThread = jest.fn().mockImplementation(() => Promise.resolve());

    const getThreadUseCase = new ThreadUseCase({threadRepository: mockThreadRepository, commentRepository: mockCommentRepository});

    const getThreadById = await getThreadUseCase.getThreadById(expectedUseCasePayload.id);
    // console.log(getThreadById, expectedUseCasePayload)

    // Assert
    expect(getThreadById).toStrictEqual(expectedUseCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      expectedUseCasePayload.id
    );
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
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

    const expectedUseCasePayLoad = new AddedNewThread({
      id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
      date: '10/12/2022'
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(new AddedNewThread({
        id: "thread-123",
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: id,
      date: '10/12/2022'
      })));

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
