class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { comment, thread, owner } = useCasePayload;
    await this._threadRepository.checkThread(thread);
    await this._commentRepository.checkComment(comment);
    await this._commentRepository.verifyCommentOwner(comment, owner);
    await this._commentRepository.deleteComment(comment);
  }
}

module.exports = DeleteCommentUseCase;
