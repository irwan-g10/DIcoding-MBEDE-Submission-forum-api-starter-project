const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
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
    it("should persist register user and return registered user correctly", async () => {
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
});
