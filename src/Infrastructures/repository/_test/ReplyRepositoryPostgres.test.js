const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(
    async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    },
  );

  afterAll(
    async () => {
      await pool.end();
    },
  );

  describe('addReply function', () => {
    it('should persist add reply correctly', async () => {
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
        content: 'Comment text',
        thread: 'thread-123',
        owner: 'user-123',
      };
      const replyPayload = {
        content: 'Comment text',
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);

      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      await replyRepositoryPostgres.addReply(replyPayload);

      //   Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
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
        comment: 'comment-123',
        content: 'Comment text',
        thread: 'thread-123',
        owner: 'user-123',
      };
      const replyPayload = {
        content: 'Comment text',
        comment: 'comment-123',
        thread: 'thread-123',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      await CommentsTableTestHelper.addComment(commentPayload);
      const fakeIdGenerator = () => '123';

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      const addedReply = await replyRepositoryPostgres.addReply(replyPayload);

      //   Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: replyPayload.content,
        owner: replyPayload.owner,
      }));
    });
  });

  describe('checkReply function', () => {
    it('should throw notfound error when thread or comment or reply not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepository.checkReply('reply-123', 'comment-123', 'notfoundthread')).rejects.toThrow(NotFoundError);
      await expect(replyRepository.checkReply('reply-123', 'notfoundcomment', 'thread-123')).rejects.toThrow(NotFoundError);
      await expect(replyRepository.checkReply('notfoundreply', 'comment-123', 'thread-123')).rejects.toThrow(NotFoundError);
    });

    it('should throw notfound error when thread, comment, and reply did not have relation', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepository.checkReply('reply-123', 'comment-123', 'thread-456')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when reply found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepository.checkReply('reply-123', 'comment-123', 'thread-123')).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('veriyReplyOwner function', () => {
    it('should throw authorization error when reply does not belong to the user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'otheruser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepository.verifyReplyOwner('reply-123', 'user-456')).rejects.toThrow(AuthorizationError);
    });

    it('should resolve when reply belong to the user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'otheruser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(replyRepository.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteReply function', () => {
    it('should delete reply correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', owner: 'user-123' });
      const replyRepository = new ReplyRepositoryPostgres(pool, {});
      // Action
      await replyRepository.deleteReply('reply-123');

      // Assert

      expect(RepliesTableTestHelper.isReplyDeleted('reply-123')).toBeTruthy();
    });
  });
});
