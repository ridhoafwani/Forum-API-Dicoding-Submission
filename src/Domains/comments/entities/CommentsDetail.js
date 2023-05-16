class CommentsDetail {
  constructor(detailComments, detailReplies) {
    if (!Array.isArray(detailComments) || !Array.isArray(detailReplies)) {
      throw new Error('COMMENTS_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.comments = detailComments.map((comment) => {
      const replies = detailReplies.filter((reply) => reply.commentId === comment.id);
      return comment.withReplies(replies);
    });
  }
}

module.exports = CommentsDetail;
