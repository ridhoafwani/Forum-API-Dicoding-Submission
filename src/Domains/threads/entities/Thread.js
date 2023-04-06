/* eslint-disable class-methods-use-this */
class Thread {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, title, body, created_at: date, username,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({
    id, title, body, created_at: date, username,
  }) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if ([typeof id, typeof title, typeof body, typeof date, typeof username]
      .some((type) => type !== 'string')) {
      throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Thread;
