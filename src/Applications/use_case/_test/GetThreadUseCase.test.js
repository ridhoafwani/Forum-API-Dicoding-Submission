const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentsDetail = require('../../../Domains/comments/entities/CommentsDetail');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should throw error when payload did not contain needed property', async () => {
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    await expect(getThreadUseCase.execute({})).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', async () => {
    const useCasePayload = {
      threadId: true,
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    await expect(getThreadUseCase.execute(useCasePayload)).rejects.toThrowError('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating get thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: useCasePayload.threadId,
      title: 'Thread Title',
      body: 'Thread text',
      date: '2023',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2023',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-456',
        username: 'dicoding',
        date: '2023',
        content: 'Comment text',
      },
    ];

    const expectedReplies = [
      {
        id: 'reply-123',
        commentId: 'comment-123',
        username: 'dicoding',
        date: '2023',
        content: 'Reply text',
      },
      {
        id: 'reply-456',
        commentId: 'comment-123',
        username: 'dicoding',
        date: '2023',
        content: '**balasan telah dihapus**',
      },
    ];

    const commentsDetail = new CommentsDetail(
      expectedComments,
      expectedReplies,
    );

    const expectedThreadDetail = new ThreadDetail(
      expectedThread,
      commentsDetail.comments,
    );

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThread = jest.fn(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest
      .fn(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = jest
      .fn(() => Promise.resolve(expectedReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadDetail = await getThreadUseCase.execute(useCasePayload);

    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId)
      .toBeCalledWith(useCasePayload.threadId);
  });
});
