const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(AddReplyUseCase.name);
    const { content } = request.payload;
    const { threadId: thread, commentId: comment } = request.params;
    const { id: owner } = request.auth.credentials;
    const addedReply = await addReplyUseCase.execute({
      content, thread, comment, owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });

    response.code(201);

    return response;
  }

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    const { threadId: thread, commentId: comment, replyId: reply } = request.params;
    const { id: owner } = request.auth.credentials;
    await deleteReplyUseCase.execute({
      reply, comment, thread, owner,
    });

    const response = h.response({
      status: 'success',
    });

    response.code(200);
    return response;
  }
}
module.exports = RepliesHandler;
