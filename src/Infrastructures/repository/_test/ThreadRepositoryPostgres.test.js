const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
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
      const threads = await ThreadTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById functions', () => {
    it('should persist getThreadById correctly', async () => {
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

      // // Assert
      const threads = await ThreadTableTestHelper.findThreadById(thread.id);
      expect(threads).toHaveLength(1);
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
      // await threadRepositoryPostgres.verifyAvailableThread('xxx');

      // // Assert
      const threads = await ThreadTableTestHelper.findThreadById(thread.id);
      expect(threads).toHaveLength(1);
      // expect(correctVerify).toHaveLength(1);
      await expect(threadRepositoryPostgres.verifyAvailableThread(thread.id)).resolves.not.toThrowError(NotFoundError);
      await expect(threadRepositoryPostgres.verifyAvailableThread('xxx')).rejects.toThrowError(NotFoundError);
    })
  })
});
