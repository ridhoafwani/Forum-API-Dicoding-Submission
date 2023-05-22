const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');

describe('CommentLikeRepositoryPostgres', () => {
  beforeEach(
    async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});
    },
  );
  afterEach(
    async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await CommentLikesTableTestHelper.cleanTable();
    },
  );

  afterAll(
    async () => {
      await pool.end();
    },
  );

  const commentLikeRepositoryPostgres = new CommentLikeRepositoryPostgres(pool);
  const likePayload = {
    comment: 'comment-123',
    user: 'user-123',
  };

  describe('isCommentLiked function', () => {
    it('should return true when the comment has been liked', async () => {
      // Arrange
      await CommentLikesTableTestHelper.likeComment(likePayload);

      //   Action
      const isCommentLiked = await commentLikeRepositoryPostgres
        .isCommentLiked(likePayload.comment, likePayload.user);

      //   Assert
      expect(isCommentLiked).toEqual(true);
    });

    it('should return false when the comment is not liked', async () => {
      //   Action
      const isCommentLiked = await commentLikeRepositoryPostgres
        .isCommentLiked(likePayload.comment, likePayload.user);

      //   Assert
      expect(isCommentLiked).toBeFalsy();
    });
  });

  describe('likeComment function', () => {
    it('should like comment correctly', async () => {
      // Action
      await commentLikeRepositoryPostgres.likeComment(likePayload.comment, likePayload.user);

      //   Assert
      const like = await CommentLikesTableTestHelper
        .findLike(likePayload.comment, likePayload.user);
      expect(like).toHaveLength(1);
    });
  });

  describe('dislikeComment function', () => {
    it('should dislike comment correctly', async () => {
      // Assert
      await CommentLikesTableTestHelper.likeComment(likePayload);

      //   Action
      await commentLikeRepositoryPostgres.dislikeComment(likePayload.comment, likePayload.user);

      //   Assert
      const like = await CommentLikesTableTestHelper
        .findLike(likePayload.comment, likePayload.user);
      expect(like).toHaveLength(0);
    });
  });
});
