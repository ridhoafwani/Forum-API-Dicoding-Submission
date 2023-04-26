/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', content = 'Comment reply', comment = 'comment-123', owner = 'user-123',
  }) {
    const now = new Date();
    const createdAt = now.toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7)',
      values: [id, content, comment, owner, false, createdAt, createdAt],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);

    return result.rows;
  },

  async isReplyDeleted(id) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND is_deleted = $2',
      values: [id, true],
    };

    const result = await pool.query(query);
    if (!result.rowCount) {
      return false;
    }
    return true;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

module.exports = RepliesTableTestHelper;
