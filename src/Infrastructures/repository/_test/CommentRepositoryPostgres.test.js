const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const RegisterUser = require("../../../Domains/users/entities/RegisterUser");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgre");

const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UserRepositoryPostgres = require("../UserRepositoryPostgres");
describe("CommentRepositoryPostgres", () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });
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

    const newComment = new NewComment({
      content: "sebuah comment",
      thread: "thread-123",
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
    const commentRepositoryPostgres = new CommentRepositoryPostgres(
      pool,
      fakeIdGenerator
    );

    // Action
    await userRepositoryPostgres.addUser(newUser);
    await threadRepositoryPostgres.addThread(newThread);
    // console.log(a, b);
    await commentRepositoryPostgres.addComment(newComment);
    // // Assert
    const comment = await CommentsTableTestHelper.findCommentById(
      "comment-123"
    );
    expect(comment).toHaveLength(1);
  });
});
