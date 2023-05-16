const Reply = require('../Reply');

describe('Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply text',
      comment: 'comment-123',
      username: 'user-123',
      is_deleted: false,
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply text',
      comment: 'comment-123',
      created_at: '2023',
      username: 'user-123',
      is_deleted: 'false',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly when is_deleted = false', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply text',
      comment: 'comment-123',
      created_at: '2023',
      username: 'user-123',
      is_deleted: false,
    };

    // Action

    const {
      id, content, date, username,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
  });

  it('should create reply object correctly when is_deleted = true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'reply text',
      comment: 'comment-123',
      created_at: '2023',
      username: 'user-123',
      is_deleted: true,
    };

    // Action

    const {
      id, content, date, username,
    } = new Reply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
  });
});
