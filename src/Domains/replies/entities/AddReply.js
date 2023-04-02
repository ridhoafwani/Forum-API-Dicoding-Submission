/* eslint-disable class-methods-use-this */
class AddReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const {
      content, comment, owner, thread,
    } = payload;
    this.content = content;
    this.comment = comment;
    this.thread = thread;
    this.owner = owner;
  }

  _verifyPayload({
    content, comment, thread, owner,
  }) {
    if (!content || !comment || !owner) {
      throw new Error('ADD_REPLY.DID_NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof comment !== 'string' || typeof owner !== 'string' || typeof thread !== 'string') {
      throw new Error('ADD_REPLY.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddReply;
