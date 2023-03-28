const pool = require('../src/Infrastructures/database/postgres/pool');

/* istanbul ignore file */
const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123', content = 'Comment body', thread = 'thread-123', owner = 'user-123',
  }) {
    const now = new Date();
    const createdAt = now.toISOString();
    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, thread, owner, false, createdAt, createdAt],
    };

    await pool.query(query);
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;
