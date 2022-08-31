const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedNewThread = require("../../../Domains/threads/entities/AddedNewThread");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should add thread correctly", async () => {
      const newUser = await new RegisterUser({
        username: "irwan_g10",
        password: "secret",
        fullname: "Irwan Gumilar",
      });

      const newThread = new NewThread({
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(newUser);
      await threadRepositoryPostgres.addThread(newThread);

      // // Assert
      const checkingThread = await ThreadTableTestHelper.findThreadById("thread-123");
      expect(checkingThread).toHaveLength(1);
      
    });
    it('should add thread correctly', async () => {
      const newUser = await new RegisterUser({
        username: "irwan_g10",
        password: "secret",
        fullname: "Irwan Gumilar",
      });

      const newThread = new NewThread({
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(newUser);

      const thread = await threadRepositoryPostgres.addThread(newThread);
      console.log(thread);

      const checkingThread = new AddedNewThread({ ...newThread, id: 'thread-123'})
      
      // const checkingThread = await ThreadTableTestHelper.findThreadById("thread-123");

      expect(thread).toStrictEqual(checkingThread)
    })
  });

  describe('getThreadById functions', () => {
    it('should persist getThreadById correctly', async () => {
      const newUser = await new RegisterUser({
        username: "irwan_g10",
        password: "secret",
        fullname: "Irwan Gumilar",
      });

      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(newUser);
      
      const thread = await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123",
        date: 'date'
      })
      

      // // Assert
      const threads = await ThreadTableTestHelper.findThreadById(thread[0].id);
      expect(threads).toHaveLength(1);
    })

    it('should expect getThread correctly', async () => {
      const newUser = await new RegisterUser({
        username: "irwan_g10",
        password: "secret",
        fullname: "Irwan Gumilar",
      });

      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(newUser);
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123",
        date: 'date'
      })
      const getThread = await threadRepositoryPostgres.getThreadById('thread-123');

      const expectedGetThread = new DetailThread({
        id: 'thread-123',
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        username: "irwan_g10",
        date: 'date'
      })
      expect(getThread).toEqual(expectedGetThread);
    })
  })

  describe('a verifyAvailableThread functions', () => {
    it('should percist verifyAvailable thread correctly', async () => {
      const newUser = await new RegisterUser({
        username: "irwan_g10",
        password: "secret",
        fullname: "Irwan Gumilar",
      });

      const newThread = new NewThread({
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123",
      });
      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const userRepositoryPostgres = new UserRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await userRepositoryPostgres.addUser(newUser);
      const thread = await threadRepositoryPostgres.addThread(newThread);
      await threadRepositoryPostgres.getThreadById(thread.id);
      await threadRepositoryPostgres.verifyAvailableThread(thread.id);

      // // Assert
      const threads = await ThreadTableTestHelper.findThreadById(thread.id);
      expect(threads).toHaveLength(1);
      await expect(threadRepositoryPostgres.verifyAvailableThread(thread.id)).resolves.not.toThrowError(NotFoundError);
      
    })
    it('should percist verifyAvailable not found thread correctly', async () => {
      const fakeIdGenerator = () => "123"; //stub!


      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(threadRepositoryPostgres.verifyAvailableThread('xxx')).rejects.toThrowError(NotFoundError);
    })
  })
});
