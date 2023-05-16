const Reply = require('../../../replies/entities/Reply');
const Comment = require('../Comment');
const CommentsDetail = require('../CommentsDetail');

describe('CommentsDetail Entities', () => {
  it('should throw error when not meet data type specification', () => {
    expect(() => new CommentsDetail({}, [])).toThrowError('COMMENTS_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new CommentsDetail([], {})).toThrowError('COMMENTS_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create commentsDetail object correctly', () => {
    const commentsPayload = [
      {
        id: 'comment-123',
        username: 'dicoding',
        content: 'comment_text',
        created_at: '2023',
        is_deleted: false,
      },
      {
        id: 'comment-234',
        username: 'dicoding',
        content: 'another comment text',
        created_at: '2023',
        is_deleted: false,
      },

    ];

    const commentsArray = [
      new Comment(commentsPayload[0]),
      new Comment(commentsPayload[1]),
    ];

    const repliesPayload = [
      {
        id: 'reply-123',
        comment: 'comment-123',
        username: 'dicoding',
        created_at: '2023',
        content: 'deleted comment',
        is_deleted: true,
      },
      {
        id: 'reply-456',
        comment: 'comment-123',
        username: 'dicoding',
        created_at: '2023',
        content: 'reply-text',
        is_deleted: false,
      },
      {
        id: 'reply-789',
        comment: 'comment-234',
        username: 'dicoding',
        created_at: '2023',
        content: 'another reply-text',
        is_deleted: false,
      },
    ];

    const repliesArray = [
      new Reply(repliesPayload[0]),
      new Reply(repliesPayload[1]),
      new Reply(repliesPayload[2]),
    ];

    const {
      comments,
    } = new CommentsDetail(commentsArray, repliesArray);

    expect(comments).toHaveLength(2);
    expect(comments).toStrictEqual([
      {
        id: commentsPayload[0].id,
        username: commentsPayload[0].username,
        date: commentsPayload[0].created_at,
        content: commentsPayload[0].content,
        replies: [
          new Reply(repliesPayload[0]),
          new Reply(repliesPayload[1]),
        ],
      },
      {
        id: commentsPayload[1].id,
        username: commentsPayload[1].username,
        date: commentsPayload[1].created_at,
        content: commentsPayload[1].content,
        replies: [
          new Reply(repliesPayload[2]),
        ],
      },
    ]);
  });
});
