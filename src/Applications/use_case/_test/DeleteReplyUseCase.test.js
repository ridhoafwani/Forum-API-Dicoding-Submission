const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply correctly', async () => {
    // Arrange
    const useCasePayload = {
      reply: 'reply-123',
      comment: 'comment-123',
      thread: 'thread-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());
    mockReplyRepository.checkReply = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action

    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.reply, useCasePayload.owner);
    expect(mockReplyRepository.checkReply)
      .toBeCalledWith(useCasePayload.reply, useCasePayload.comment, useCasePayload.thread);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(useCasePayload.reply);
  });
});
