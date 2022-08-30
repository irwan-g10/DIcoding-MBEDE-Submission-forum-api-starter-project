const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadTableTestHelper = require("../../../../tests/ThreadTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedNewComment = require("../../../Domains/comments/entities/AddedNewComment");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
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
  describe('AddComment functions', () => {
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
      const addedComment = await commentRepositoryPostgres.addComment(newComment);
      // // Assert
      const comment = await CommentsTableTestHelper.findCommentById(
        "comment-123"
        );
        const newAddedComment = new AddedNewComment({...newComment, id : 'comment-123'})
        // console.log(addedCommen, newt);
      expect(comment).toHaveLength(1);
      expect(addedComment).toEqual(newAddedComment)
    });
  })

  describe('getCommentByThreadId', () => {
    it('should getCommentByThreadId correctly', async () => {
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
      await commentRepositoryPostgres.addComment(newComment);
      const getComment = await commentRepositoryPostgres.getCommentsByThreadId(newComment.thread);
      getComment[0].date = '10/12/2022'
      const expectedGetComment = [new DetailComment({id: 'comment-123',is_delete: false, username: newUser.username, content: newComment.content, date: '10/12/2022'})]
      const comment = await CommentsTableTestHelper.getCommentsByThreadId(
        newComment.thread
        );
        
        // console.log(getComment)
      expect(comment).toHaveLength(1);
      expect(getComment).toEqual(expectedGetComment)
    })
  })

  describe('verifyCommentOwner', () => {
    it('should verify throw an error', async () => {
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(commentRepositoryPostgres.verifyCommentOwner('xxx')).rejects.toThrowError(AuthorizationError);
    })

    it('verify should not throw an error', async () => {
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'irwan-123',
        password: 'secret',
        fullname: 'Irwan Gumilar'
      })

      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123"
      })

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        thread: "thread-123",
        content: "comment ini dibuat oleh irwan",
      });

      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123','user-123')).resolves.not.toThrowError(AuthorizationError);
    })
  })

  describe('verifyAvailableComment', () => {
    it('show verify throw an error', async () => {
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      await expect(commentRepositoryPostgres.verifyAvailableComment('xxx')).rejects.toThrowError(NotFoundError);
    })

    it('verify should not throw an error', async () => {

      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'irwan-123',
        password: 'secret',
        fullname: 'Irwan Gumilar'
      })

      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123"
      })

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        thread: "thread-123",
        content: "comment ini dibuat oleh irwan",
      });
      const fakeIdGenerator = () => "123"; //stub!

      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await expect(commentRepositoryPostgres.verifyAvailableComment('comment-123')).resolves.not.toThrowError(NotFoundError);
    })
  })

  describe('deleteComment', () => {
    it('delete comment correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'irwan-123',
        password: 'secret',
        fullname: 'Irwan Gumilar'
      })

      await ThreadTableTestHelper.addThread({
        id: "thread-123",
        title: "sebuah thread title dari irwan",
        body: "sebuah thread body dari irwan",
        owner: "user-123"
      })

      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        owner: "user-123",
        thread: "thread-123",
        content: "comment ini dibuat oleh irwan",
      });
      const fakeIdGenerator = () => "123"; //stub!
      
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await commentRepositoryPostgres.deleteComment('comment-123');

      const comment = await CommentsTableTestHelper.findCommentById('comment-123')

      // console.log(comment)
      expect(comment[0].is_delete).toEqual(true);

    })
  })
});
