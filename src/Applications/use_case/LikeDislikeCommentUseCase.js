const CommentLike = require('../../Domains/comment_likes/entities/CommentLike');

class LikeDislikeCommentUseCase {
  constructor({ commentLikeRepository, commentRepository }) {
    this._commentLikeRepository = commentLikeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const commentLike = new CommentLike(useCasePayload);
    await this._commentRepository.checkComment(commentLike.comment, commentLike.thread);
    const isLiked = await this._commentLikeRepository
      .isCommentLiked(commentLike.comment, commentLike.user);
    if (isLiked) {
      return this._commentLikeRepository.dislikeComment(commentLike.comment, commentLike.user);
    }

    return this._commentLikeRepository.likeComment(commentLike.comment, commentLike.user);
  }
}

module.exports = LikeDislikeCommentUseCase;
