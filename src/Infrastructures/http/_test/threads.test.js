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
});
