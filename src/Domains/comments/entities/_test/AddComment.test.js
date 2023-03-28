const AddComment = require('../AddComment');

describe('addComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const commentPayload = {
      content: 'Comment text',
      thread: 'thread-123',
    };

    // Action & Assert
    expect(() => new AddComment(commentPayload)).toThrowError('ADD_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const commentPayload = {
      content: 'Comment text',
      thread: true,
      owner: ['orkestra'],
    };

    // Action & Assert
    expect(() => new AddComment(commentPayload)).toThrowError('ADD_COMMENT.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addComment object correctly', () => {
    // Arrange
    const commentPayload = {
      content: 'Comment text',
      thread: 'thread-123',
      owner: 'user-123',
    };

    //   Action
    const { content, thread, owner } = new AddComment(commentPayload);

    // Assert
    expect(content).toEqual(commentPayload.content);
    expect(thread).toEqual(commentPayload.thread);
    expect(owner).toEqual(commentPayload.owner);
  });
});
