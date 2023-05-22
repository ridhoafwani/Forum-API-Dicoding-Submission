const CommentLikeRepository = require('../../../Domains/comment_likes/CommentLikeRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeDislikeCommentUseCase = require('../LikeDislikeCommentUseCase');

describe('LikeDislikeCommentUseCase', () => {
  const useCasePayload = {
    comment: 'comment_123',
    user: 'user_123',
    thread: 'thread_123',
  };

  const mockCommentRepository = new CommentRepository();
  const mockCommentLikeRepository = new CommentLikeRepository();

  it('should orchestraing like comment correctly', async () => {
    // Arrange
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn(() => Promise.resolve(false));
    mockCommentLikeRepository.likeComment = jest.fn(() => Promise.resolve());
    const likeDislikeCommentUseCase = new LikeDislikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository, commentRepository: mockCommentRepository,
    });

    // Action
    await likeDislikeCommentUseCase.execute(useCasePayload);
    // Assert
    expect(mockCommentRepository.checkComment)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.thread);
    expect(mockCommentLikeRepository.isCommentLiked)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.user);
    expect(mockCommentLikeRepository.likeComment)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.user);
  });

  it('should orchestrating dislike comment correctly', async () => {
    // Arrange
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockCommentLikeRepository.isCommentLiked = jest.fn(() => Promise.resolve(true));
    mockCommentLikeRepository.dislikeComment = jest.fn(() => Promise.resolve());
    const likeDislikeCommentUseCase = new LikeDislikeCommentUseCase({
      commentLikeRepository: mockCommentLikeRepository, commentRepository: mockCommentRepository,
    });

    // Action
    await likeDislikeCommentUseCase.execute(useCasePayload);
    // Assert
    expect(mockCommentRepository.checkComment)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.thread);
    expect(mockCommentLikeRepository.isCommentLiked)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.user);
    expect(mockCommentLikeRepository.dislikeComment)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.user);
  });
});
