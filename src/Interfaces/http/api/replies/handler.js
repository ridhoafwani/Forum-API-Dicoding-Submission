const AddReplyUseCase = require('../../../../Applications/use_case/AddReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
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
}
module.exports = RepliesHandler;
