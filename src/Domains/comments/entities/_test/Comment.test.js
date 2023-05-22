const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      created_at: 2021,
      username: 'user-123',
      content: 'comment text',
      is_deleted: true,
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly when is_deleted = false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      created_at: '2023',
      username: 'user-123',
      content: 'comment text',
      is_deleted: false,
      likes: 1,
    };

    // Action
    const {
      id, date, username, content, likeCount,
    } = new Comment(payload);

    //   Assert
    expect(id).toEqual(payload.id);
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
    expect(content).toEqual(payload.content);
    expect(likeCount).toEqual(1);
  });

  it('should create comment object correctly when is_deleted = true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      created_at: '2023',
      username: 'user-123',
      content: 'comment text',
      is_deleted: true,
      likes: 1,
    };

    // Action
    const {
      id, date, username, content, likeCount,
    } = new Comment(payload);

    //   Assert
    expect(id).toEqual(payload.id);
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(likeCount).toEqual(1);
  });
});
