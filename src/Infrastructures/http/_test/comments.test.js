const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });
  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 401 when request did not have access token', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/threadid/comments',
        payload: {},
      });
        // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when payload did not contain needed property', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };
      const threadPyaload = {
        title: 'Thread title',
        body: 'Thread body',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: registerUserPayload.username,
          password: registerUserPayload.password,
        },
      });

      const responseAuth = JSON.parse(authentication.payload);
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: {
          xxx: 'aaa',
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat menambahkan commentar karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when payload did not meet data type specification', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };
      const threadPyaload = {
        title: 'Thread title',
        body: 'Thread body',
      };

      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: registerUserPayload.username,
          password: registerUserPayload.password,
        },
      });

      const responseAuth = JSON.parse(authentication.payload);
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: {
          content: 5000,
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat mmenambahkan commentar karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };

      const commentPayload = {
        content: 'Comment text',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: registerUserPayload.username,
          password: registerUserPayload.password,
        },
      });

      const responseAuth = JSON.parse(authentication.payload);

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/notfoundthread/comments',
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };
      const threadPyaload = {
        title: 'Thread title',
        body: 'Thread body',
      };
      const commentPayload = {
        content: 'Comment text',
      };
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerUserPayload,
      });

      const authentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: registerUserPayload.username,
          password: registerUserPayload.password,
        },
      });

      const responseAuth = JSON.parse(authentication.payload);
      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.content).toEqual(commentPayload.content);
    });
  });
});
