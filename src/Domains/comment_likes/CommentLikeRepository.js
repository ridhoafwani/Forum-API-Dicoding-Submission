/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
class CommentLikeRepository {
  async isCommentLiked(comment, user) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async likeComment(comment, user) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async dislikeComment(comment, user) {
    throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentLikeRepository;
