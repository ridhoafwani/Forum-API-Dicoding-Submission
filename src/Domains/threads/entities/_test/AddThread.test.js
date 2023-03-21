const AddThread = require('../AddThread');

describe('a AddThread Entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const threadPayload = {
      title: 'Judul Thread',
      body: 'Isi thread',
    };

    // Action & Assert
    expect(() => new AddThread(threadPayload)).toThrowError('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet the data type specification', () => {
    // Arrange
    const threadPayload = {
      title: 'Judul Thread',
      body: 'Isi thread',
      owner: true,
    };

    // Action & Assert
    expect(() => new AddThread(threadPayload)).toThrowError('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThread object correcly', () => {
    // Arrange
    const threadPayload = {
      title: 'Judul Thread',
      body: 'Isi thread',
      owner: 'user-123',
    };

    // Action
    const { title, body, owner } = new AddThread(threadPayload);

    // Assert
    expect(title).toEqual(threadPayload.title);
    expect(body).toEqual(threadPayload.body);
    expect(owner).toEqual(threadPayload.owner);
  });
});
