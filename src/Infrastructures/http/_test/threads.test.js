const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(
    async () => {
      await pool.end();
    },
  );

  afterEach(
    async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
    },
  );

  describe('when POST /threads', () => {
    it('should response 400 when payload not contain needed property', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };
      const threadPyaload = {
        title: 'Thread title',
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
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
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
        body: true,
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
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat memebuat thread baru karena tipe data tidak sesuai');
    });

    it('should reresponse 201 and persisted thread', async () => {
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
      //   Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread.title).toEqual(threadPyaload.title);
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and persisted thread correctly', async () => {
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
      const replyPayload = {
        content: 'Reply text',
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

      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);

      await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentResponseJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadJson.data.addedThread.id}`,
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/xxx',
      });

      const responseJson = JSON.parse(response.payload);

      // Assert
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });
});
