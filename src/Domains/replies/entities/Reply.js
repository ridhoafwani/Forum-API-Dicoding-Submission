/* eslint-disable class-methods-use-this */
class Reply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      id, content, username, comment, created_at: date, is_deleted: isDeleted,
    } = payload;
    this.id = id;
    this.username = username;
    this.comment = comment;
    this.date = date;
    this.content = isDeleted ? '**balasan telah dihapus**' : content;
  }

  _verifyPayload({
    id, content, username, comment, created_at: date, is_deleted: isDeleted,
  }) {
    if (!id || !content || !username || !comment || !date || isDeleted === undefined) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if ([id, content, username, comment, date].some((stringPayload) => typeof stringPayload !== 'string') || typeof isDeleted !== 'boolean') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
