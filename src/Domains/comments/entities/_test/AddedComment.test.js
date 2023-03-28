const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const commentPayload = {
      id: 'comment-123',
      content: 'Comment text',
    };

    // Action & Assert
    expect(() => new AddedComment(commentPayload)).toThrowError('ADDED_COMMENT.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type spesification', () => {
    // Arrange
    const commentPayload = {
      id: 'comment-123',
      content: true,
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddedComment(commentPayload)).toThrowError('ADDED_COMMENT.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedComment object correctly', () => {
    // Arrange
    const commentPayload = {
      id: 'comment-123',
      content: 'Comment text',
      owner: 'user-123',
    };

    //   Action
    const { id, content, owner } = new AddedComment(commentPayload);

    // Assert
    expect(id).toEqual(commentPayload.id);
    expect(content).toEqual(commentPayload.content);
    expect(owner).toEqual(commentPayload.owner);
  });
});
