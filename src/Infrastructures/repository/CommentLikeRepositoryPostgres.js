const CommentLikeRepository = require('../../Domains/comment_likes/CommentLikeRepository');

class CommentLikeRepositoryPostgres extends CommentLikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async isCommentLiked(comment, user) {
    const query = {
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment, user],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async likeComment(comment, user) {
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comment_likes VALUES ($1, $2, $3)',
      values: [comment, user, createdAt],
    };

    await this._pool.query(query);
  }

  async dislikeComment(comment, user) {
    const query = {
      text: 'DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment, user],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentLikeRepositoryPostgres;
