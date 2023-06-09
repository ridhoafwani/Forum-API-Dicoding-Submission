const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const LikeDislikeCommentUseCase = require('../../../../Applications/use_case/LikeDislikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putLikeDislikeCommentHandler = this.putLikeDislikeCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const { threadId: thread } = request.params;
    const { content } = request.payload;
    const { id: owner } = request.auth.credentials;

    const addedComment = await addCommentUseCase.execute({ content, thread, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    const { threadId: thread, commentId: comment } = request.params;
    const { id: owner } = request.auth.credentials;

    await deleteCommentUseCase.execute({ thread, comment, owner });

    const response = h.response({
      status: 'success',
    });

    response.code(200);

    return response;
  }

  async putLikeDislikeCommentHandler(request, h) {
    const likeDislikeCommentUseCase = this._container.getInstance(LikeDislikeCommentUseCase.name);
    const { threadId: thread, commentId: comment } = request.params;
    const { id: user } = request.auth.credentials;

    await likeDislikeCommentUseCase.execute({ comment, user, thread });

    const response = h.response({
      status: 'success',
    });

    response.code(200);

    return response;
  }
}

module.exports = CommentsHandler;
