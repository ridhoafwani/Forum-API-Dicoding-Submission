const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
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
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepository.checkComment('notfoundcomment', 'thread-123')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123' });
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepository.checkComment('comment-123', 'notfoundthread')).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError when comment and thread did not have relations', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-456' });
      const commentRepository = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(commentRepository.checkComment('comment-123', 'thread-456')).rejects.toThrow(NotFoundError);
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
      await expect(commentRepository.checkComment(commentPayload.id, commentPayload.thread))
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

  describe('getCommentsByThreadId function', () => {
    it('should get comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadsPayload = [
        {
          id: 'thread-123',
          title: 'Thread Title',
          body: 'Thread body',
          owner: 'user-123',
        },
        {
          id: 'thread-234',
          title: 'Thread Title',
          body: 'Thread body',
          owner: 'user-123',
        },
      ];
      await ThreadsTableTestHelper.addThread(threadsPayload[0]);
      await ThreadsTableTestHelper.addThread(threadsPayload[1]);
      const commentsPayload = [
        {
          id: 'comment-123',
          content: 'First comment text',
          thread: 'thread-123',
          owner: 'user-123',
          createdAt: '2021',
        },
        {
          id: 'comment-234',
          content: 'Comment text',
          thread: 'thread-234',
          owner: 'user-123',
          createdAt: '2022',
        },
        {
          id: 'comment-456',
          content: 'Second Comment text',
          thread: 'thread-123',
          owner: 'user-123',
          createdAt: '2023',
        },
      ];

      await CommentsTableTestHelper.addComment(commentsPayload[0]);
      await CommentsTableTestHelper.addComment(commentsPayload[1]);
      await CommentsTableTestHelper.addComment(commentsPayload[2]);

      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepository.getCommentsByThreadId(threadsPayload[0].id);

      // Assert
      expect(comments).toStrictEqual([
        new Comment({
          id: commentsPayload[0].id,
          username: 'ridho',
          content: commentsPayload[0].content,
          is_deleted: false,
          created_at: commentsPayload[0].createdAt,
        }),
        new Comment({
          id: commentsPayload[2].id,
          username: 'ridho',
          content: commentsPayload[2].content,
          is_deleted: false,
          created_at: commentsPayload[2].createdAt,
        }),
      ]);
    });
  });
});
