class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { comment, thread, owner } = useCasePayload;
    await this._commentRepository.checkComment(comment, thread);
    await this._commentRepository.verifyCommentOwner(comment, owner);
    await this._commentRepository.deleteComment(comment);
  }
}

module.exports = DeleteCommentUseCase;
