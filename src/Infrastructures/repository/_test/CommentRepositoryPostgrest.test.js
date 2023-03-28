const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(
    async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
    },
  );

  afterAll(
    async () => {
      await pool.end();
    },
  );

  describe('addComment function', () => {
    it('should persist add comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        content: 'Comment text',
        thread: 'thread-123',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      await commentRepositoryPostgres.addComment(commentPayload);

      //   Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        content: 'Comment text',
        thread: 'thread-123',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      const fakeIdGenerator = () => '123';

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      const addedComment = await commentRepositoryPostgres.addComment(commentPayload);

      //   Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: commentPayload.content,
        owner: commentPayload.owner,
      }));
    });
  });
});
