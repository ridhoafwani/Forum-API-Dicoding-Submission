const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      owner: 'user-123',
    };
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.checkComment)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.thread);
    expect(mockCommentRepository.verifyCommentOwner)
      .toBeCalledWith(useCasePayload.comment, useCasePayload.owner);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.comment);
  });
});
