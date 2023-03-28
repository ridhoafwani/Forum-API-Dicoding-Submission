/* eslint-disable class-methods-use-this */
class AddComment {
  constructor(payload) {
    this._verifPayload(payload);
    const { content, thread, owner } = payload;
    this.content = content;
    this.thread = thread;
    this.owner = owner;
  }

  _verifPayload({ content, thread, owner }) {
    if (!content || !thread || !owner) {
      throw new Error('ADD_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof thread !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_COMMENT.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}
module.exports = AddComment;
