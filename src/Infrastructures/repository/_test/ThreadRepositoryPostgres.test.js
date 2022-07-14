const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    it("should persist register user and return registered user correctly", async () => {
      const newThread = new NewThread({
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
      });
      const fakeIdGenerator = () => "123"; //stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // // Assert
      const threads = await ThreadTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });
});
