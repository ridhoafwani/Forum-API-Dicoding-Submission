const CommentsDetail = require('../../Domains/comments/entities/CommentsDetail');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

/* eslint-disable class-methods-use-this */
class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  _verifyThreadDetailPayload({ threadId }) {
    if (!threadId) throw new Error('GET_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');

    if (typeof threadId !== 'string') throw new Error('GET_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  }

  async execute(useCasePayload) {
    this._verifyThreadDetailPayload(useCasePayload);
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(threadId);

    const detailComments = new CommentsDetail(comments, replies);
    return new ThreadDetail(thread, detailComments.comments);
  }
}

module.exports = GetThreadUseCase;
