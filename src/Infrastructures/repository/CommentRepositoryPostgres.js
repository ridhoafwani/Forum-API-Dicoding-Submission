const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');

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

    return new AddedComment(result.rows[0]);
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
      text: 'UPDATE comments SET is_deleted = $1 WHERE id = $2',
      values: [true, comment],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, users.username, comments.created_at, comments.content, comments.is_deleted, COUNT(comment_likes.comment_id) as likes
      FROM comments LEFT JOIN users ON users.id = comments.owner
      LEFT JOIN comment_likes ON comment_likes.comment_id = comments.id
      WHERE comments.thread = $1
      GROUP BY comments.id, users.username, comments.created_at, comments.content, comments.is_deleted
      ORDER BY comments.created_at ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows.map((comment) => new Comment(comment));
  }
}

module.exports = CommentRepositoryPostgres;
