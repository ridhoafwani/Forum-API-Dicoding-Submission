const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterEach(
    async () => {
      await UsersTableTestHelper.cleanTable();
      await ThreadsTableTestHelper.cleanTable();
      await CommentsTableTestHelper.cleanTable();
      await RepliesTableTestHelper.cleanTable();
    },
  );

  afterAll(
    async () => {
      await pool.end();
    },
  );
  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 401 when request did not have access token', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/threadid/comments/commentid/replies',
        payload: {},
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request  did not contain needed property', async () => {
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
        message: 'Reply text',
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

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentResponseJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan aksi karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request  did not meet data type specification', async () => {
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
        content: 123456,
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

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentResponseJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan aksi karena tipe data yang dibutuhkan tidak sesuai');
    });

    it('should response 201 and persisted reply', async () => {
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

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentResponseJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply.content).toEqual(replyPayload.content);
    });

    it('should response 404 when thread not found', async () => {
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

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/notfoundthread/comments/${commentResponseJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resources tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
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

      //   Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/notfoundcomment/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      //   Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resources tidak ditemukan');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 401 when request did not contain access token', async () => {
      // Arrange
      const server = await createServer(container);
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threadid/comments/commentid/replies/replyid',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 404 when thread not found', async () => {
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

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(responseAddComment.payload);

      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const replyJson = JSON.parse(responseAddReply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/notfoundthread/comments/${commentJson.data.addedComment.id}/replies/${replyJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resources tidak ditemukan');
    });

    it('should response 404 when comment not found', async () => {
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

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(responseAddComment.payload);

      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const replyJson = JSON.parse(responseAddReply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/notfoundcomment/replies/${replyJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resources tidak ditemukan');
    });

    it('should response 404 when reply not found', async () => {
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

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(responseAddComment.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies/notfoundreply`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('resources tidak ditemukan');
    });

    it('should response 403 when the users does not belong to the reply', async () => {
      // Arrange
      const registerUserPayload = {
        username: 'myusername',
        password: 'mypassword',
        fullname: 'Mr Fullname',
      };
      const otherUserPayload = {
        username: 'otherusername',
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

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: otherUserPayload,
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

      const otherAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: otherUserPayload.username,
          password: otherUserPayload.password,
        },
      });

      const responseOtherAuth = JSON.parse(otherAuthentication.payload);

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadPyaload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const threadJson = JSON.parse(thread.payload);

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(responseAddComment.payload);

      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const replyJson = JSON.parse(responseAddReply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies/${replyJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseOtherAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Anda tidak berhak mengakses resources ini');
    });

    it('should response 200 and delete reply from database', async () => {
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

      const responseAddComment = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments`,
        payload: commentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });
      const commentJson = JSON.parse(responseAddComment.payload);

      const responseAddReply = await server.inject({
        method: 'POST',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies`,
        payload: replyPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      const replyJson = JSON.parse(responseAddReply.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadJson.data.addedThread.id}/comments/${commentJson.data.addedComment.id}/replies/${replyJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
