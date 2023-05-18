const CommentLike = require('../CommentLike');

describe('CommentLike entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      user: 'user_123',
      thread: 'thread_123',
    };

    // Action & Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      user: 'user_123',
      thread: 'thread_123',
      comment: true,
    };

    // Action & Assert
    expect(() => new CommentLike(payload)).toThrowError('COMMENT_LIKE.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentLike objecty correctly', () => {
    // Arrange
    const payload = {
      user: 'user_123',
      thread: 'thread_123',
      comment: 'comment_123',
    };

    // Action
    const commentLike = new CommentLike(payload);

    // Assert
    expect(commentLike.user).toEqual(payload.user);
    expect(commentLike.comment).toEqual(payload.comment);
  });
});
