class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      thread, comment, reply, owner,
    } = useCasePayload;
    await this._replyRepository.checkReply(reply, comment, thread);
    await this._replyRepository.verifyReplyOwner(reply, owner);
    await this._replyRepository.deleteReply(reply);
  }
}

module.exports = DeleteReplyUseCase;
