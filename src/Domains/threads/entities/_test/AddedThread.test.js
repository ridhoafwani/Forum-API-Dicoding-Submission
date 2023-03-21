const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should throw error when did not contain needed property', () => {
    // Arrange
    const threadPayload = {
      id: 'thread-123',
      title: 'Thread Title',
    };

    // Action & Assert
    expect(() => new AddedThread(threadPayload)).toThrowError('ADDED_THREAD.DID_NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when did not meet data type specifications', () => {
    // Arrange
    const threadPayload = {
      id: 'thread-123',
      title: 'Thread Title',
      owner: true,
    };

    // Action & Assert
    expect(() => new AddedThread(threadPayload)).toThrowError('ADDED_THREAD.DID_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addedThread object correctly', () => {
    // Arrange
    const threadPayload = {
      id: 'thread-123',
      title: 'Thread Title',
      owner: 'user-123',
    };

    // Action
    const { id, title, owner } = new AddedThread(threadPayload);

    // Assert
    expect(id).toEqual(threadPayload.id);
    expect(title).toEqual(threadPayload.title);
    expect(owner).toEqual(threadPayload.owner);
  });
});
