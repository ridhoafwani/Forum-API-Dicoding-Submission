const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
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

  async checkReply(reply, comment, thread) {
    const query = {
      text: `SELECT replies.id FROM replies 
      LEFT JOIN comments ON comments.id = replies.comment 
      WHERE replies.id = $1 AND replies.comment = $2 AND comments.thread = $3`,
      values: [reply, comment, thread],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('resources tidak ditemukan');
    }
  }

  async verifyReplyOwner(reply, owner) {
    const query = {
      text: 'SELECT id FROM replies WHERE id = $1 AND owner = $2',
      values: [reply, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resources ini');
    }
  }

  async deleteReply(reply) {
    const query = {
      text: 'DELETE FROM replies WHERE id = $1',
      values: [reply],
    };

    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
