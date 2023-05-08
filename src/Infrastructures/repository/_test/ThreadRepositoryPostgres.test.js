const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const newThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      await threadRepositoryPostgres.addThread(newThread);

      //   Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const newThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      //   Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      //   Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'Thread Title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThread function', () => {
    it('should throw error when thread not found ', async () => {
      const threadRepository = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepository.getThread('notfoundthread'))
        .rejects.toThrow(NotFoundError);
    });

    it('should get thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
        createdAt: '2023',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.getThread(threadPayload.id);

      // Assert
      expect(thread).toStrictEqual(new Thread({
        id: threadPayload.id,
        title: threadPayload.title,
        body: threadPayload.body,
        username: 'ridho',
        created_at: threadPayload.createdAt,
      }));
    });
  });

  describe('checkThread function', () => {
    it('should throw error when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Arrange
      await expect(threadRepositoryPostgres.checkThread('thread-1')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when thread found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.checkThread(threadPayload.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
