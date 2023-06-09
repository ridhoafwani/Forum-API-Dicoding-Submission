const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123', username: 'ridho' });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  const fakeIdGenerator = () => '123';
  const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

  describe('addThread function', () => {
    it('should persist add thread correctly', async () => {
      const newThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      });

      await threadRepositoryPostgres.addThread(newThread);

      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      const newThread = new AddThread({
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      });

      const addedThread = await threadRepositoryPostgres.addThread(newThread);

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
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
        createdAt: '2023',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);

      const thread = await threadRepositoryPostgres.getThread(threadPayload.id);

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
      await expect(threadRepositoryPostgres.checkThread('thread-1')).rejects.toThrow(NotFoundError);
    });

    it('should resolve when thread found', async () => {
      const threadPayload = {
        id: 'thread-123',
        title: 'Thread Title',
        body: 'Thread body',
        owner: 'user-123',
      };
      await ThreadsTableTestHelper.addThread(threadPayload);

      await expect(threadRepositoryPostgres.checkThread(threadPayload.id))
        .resolves.not.toThrow(NotFoundError);
    });
  });
});
