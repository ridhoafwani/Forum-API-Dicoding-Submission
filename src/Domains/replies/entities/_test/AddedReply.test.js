const AddedReply = require('../AddedReply');

describe('AddReply Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'comment reply',
      owner: 'user-123',
    };
      // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('shouls throw eerror when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123456,
      content: 'comment reply',
      owner: 'user-123',
    };
    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
