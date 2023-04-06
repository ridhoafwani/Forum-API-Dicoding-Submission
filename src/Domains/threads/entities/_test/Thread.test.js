const Thread = require('../Thread');

describe('Thread entitied', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      username: 'user-123',
      created_at: 2023,
    };

    // Action & Assert
    expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create thread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      username: 'user-123',
      created_at: '2023',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new Thread(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.created_at);
    expect(username).toEqual(payload.username);
  });
});
