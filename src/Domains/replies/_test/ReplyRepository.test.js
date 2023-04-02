const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository Interface', () => {
  it('should throw error when invoke abstract behavior', () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.checkReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(replyRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
