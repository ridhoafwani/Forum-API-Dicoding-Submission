const AddedReply = require('../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, comment, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const now = new Date();
    const createdAt = now.toISOString();
    const query = {
      text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, comment, owner, false, createdAt, createdAt],
    };

    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }
}

module.exports = ReplyRepositoryPostgres;
