/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentLikesTableTestHelper = {
  async likeComment({
    comment = 'comment-123',
    user = 'user-123',
    createdAt = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comment_likes VALUES ($1, $2, $3)',
      values: [comment, user, createdAt],
    };

    await pool.query(query);
  },

  async findLike(comment, user) {
    const result = await pool.query({
      text: 'SELECT * FROM comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [comment, user],
    });

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_likes WHERE 1=1');
  },
};

module.exports = CommentLikesTableTestHelper;
