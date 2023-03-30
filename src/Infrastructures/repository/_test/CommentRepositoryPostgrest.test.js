const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
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

  describe('checkComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepository.checkComment('notfoundcomment')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when comment found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        thread: threadPayload.id,
        content: 'comment text',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepository.checkComment(commentPayload.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw authorization error when the comment does not belong to the user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'otheruser' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        thread: threadPayload.id,
        content: 'comment text',
        owner: 'user-456',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(commentPayload.id, threadPayload.owner))
        .rejects.toThrow(AuthorizationError);
    });

    it('should resolve when the comment belong to the user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        thread: threadPayload.id,
        content: 'comment text',
        owner: threadPayload.owner,
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepository.verifyCommentOwner(commentPayload.id, threadPayload.owner))
        .resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      const commentPayload = {
        id: 'comment-123',
        thread: threadPayload.id,
        content: 'comment text',
        owner: threadPayload.owner,
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepository.deleteComment(commentPayload.id);

      // Assert
      await expect(CommentsTableTestHelper.isCommentDeleted(commentPayload.id)).toBeTruthy();
    });
  });
});
