/* eslint-disable class-methods-use-this */
class CommentLike {
  constructor(payload) {
    this._verifPayload(payload);
    const { comment, user, thread } = payload;
    this.comment = comment;
    this.user = user;
    this.thread = thread;
  }

  _verifPayload({ comment, user, thread }) {
    if (!comment || !user || !thread) {
      throw new Error('COMMENT_LIKE.DID_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof comment !== 'string' || typeof user !== 'string' || typeof thread !== 'string') {
      throw new Error('COMMENT_LIKE.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CommentLike;
