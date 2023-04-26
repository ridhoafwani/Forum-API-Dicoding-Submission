const Comment = require('../../../comments/entities/Comment');
const CommentsDetail = require('../../../comments/entities/CommentsDetail');
const Thread = require('../Thread');
const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should throw error when did not meet data type specification', () => {
    expect(() => new ThreadDetail([], {})).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const threadPayload = {
      id: 'thread-123',
      title: 'Thread Title',
      body: 'Thread body',
      username: 'user-123',
      created_at: '2023',
    };

    const commentPayload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'comment_text',
      created_at: '2023',
      is_deleted: false,
    };

    const thread = new Thread(threadPayload);
    const { comments: commentsList } = new CommentsDetail([new Comment(commentPayload)], []);

    // Action
    const {
      id, title, body, date, username, comments,
    } = new ThreadDetail(thread, commentsList);

    // Assert

    expect(id).toEqual(threadPayload.id);
    expect(title).toEqual(threadPayload.title);
    expect(body).toEqual(threadPayload.body);
    expect(date).toEqual(threadPayload.created_at);
    expect(username).toEqual(threadPayload.username);
    expect(comments).toHaveLength(1);
    expect(comments).toStrictEqual([
      {
        id: commentPayload.id,
        username: commentPayload.username,
        date: commentPayload.created_at,
        content: commentPayload.content,
        replies: [],
      },
    ]);
  });
});
