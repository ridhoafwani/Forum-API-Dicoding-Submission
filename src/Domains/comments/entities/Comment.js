/* eslint-disable class-methods-use-this */
class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, username, created_at: date, content, is_deleted: isDeleted,
    } = payload;
    this.id = id;
    this.username = username;
    this.date = date;
    this.content = isDeleted ? '**komentar telah dihapus**' : content;
  }

  _verifyPayload({
    id, username, created_at: date, content, is_deleted: isDeleted,
  }) {
    if (!id || !username || !content || !date || isDeleted === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if ([typeof id, typeof username, typeof content, typeof date]
      .some((type) => type !== 'string') || typeof isDeleted !== 'boolean') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
