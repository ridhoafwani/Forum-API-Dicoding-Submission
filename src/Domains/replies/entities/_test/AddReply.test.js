const AddReply = require('../AddReply');

describe('AddReply Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
      owner: 'user-123',
      thread: 'thread-123',
    };
    // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('shouls throw eerror when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123456,
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };
      // Action & Assert
    expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addreply object correctly', () => {
    // Arrange
    const payload = {
      content: 'reply text',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };
    // Action
    const {
      content, comment, thread, owner,
    } = new AddReply(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(comment).toEqual(payload.comment);
    expect(thread).toEqual(payload.thread);
    expect(owner).toEqual(payload.owner);
  });
});
