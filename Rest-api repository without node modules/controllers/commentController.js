const { commentModel } = require('../models');

function getComments(req, res, next) {
    const { recipeId } = req.params;

    commentModel.find({ recipe: recipeId })
        .populate('creator', 'username')
        .sort({ createdAt: -1 })
        .then(comments => res.json(comments))
        .catch(next);
}

function createComment(req, res, next) {
    const { recipeId } = req.params;
    const { content } = req.body;
    const { _id: userId } = req.user;

    commentModel.create({ content, creator: userId, recipe: recipeId })
        .then(comment => comment.populate('creator', 'username'))
        .then(populatedComment => res.json(populatedComment))
        .catch(next);
}

function deleteComment(req, res, next) {
    const { commentId } = req.params;
    const { _id: userId } = req.user;

    commentModel.findOneAndDelete({ _id: commentId, creator: userId })
        .then(deletedComment => {
            if (deletedComment) {
                res.json({ message: 'Comment deleted successfully' });
            } else {
                res.status(401).json({ message: 'Not authorized to delete this comment' });
            }
        })
        .catch(next);
}

module.exports = {
    getComments,
    createComment,
    deleteComment
};
