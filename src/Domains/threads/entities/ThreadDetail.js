class ThreadDetail {
  constructor(thread, comments) {
    const {
      id, title, body, date, username,
    } = thread;

    if (!Array.isArray(comments)) throw new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments;
  }
}

module.exports = ThreadDetail;
