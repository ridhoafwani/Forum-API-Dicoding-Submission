const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, thread, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const now = new Date();
    const createdAt = now.toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner',
      values: [id, content, thread, owner, false, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkComment(comment, thread) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND thread = $2',
      values: [comment, thread],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('resources tidak ditemukan');
    }
  }

  async verifyCommentOwner(comment, owner) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1 AND owner = $2',
      values: [comment, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Anda tidak berhak mengakses resources ini');
    }
  }

  async deleteComment(comment) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: [true, comment],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
