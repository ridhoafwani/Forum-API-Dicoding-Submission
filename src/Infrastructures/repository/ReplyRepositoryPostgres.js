const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');
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
      text: 'UPDATE replies SET is_deleted = $1 WHERE id = $2',
      values: [true, reply],
    };

    await this._pool.query(query);
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, users.username, replies.created_at, replies.content, replies.is_deleted,
      replies.comment
      FROM replies LEFT JOIN comments ON comments.id = replies.comment
      LEFT JOIN users ON users.id = replies.owner
      WHERE comments.thread = $1
      ORDER BY replies.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((reply) => new Reply(reply));
  }
}

module.exports = ReplyRepositoryPostgres;
