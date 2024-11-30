const { recipeModel, userModel } = require('../models');

function getRecipes(req, res, next) {
    recipeModel.find()
        .populate('creator', '-password')
        .then(recipes => res.json(recipes))
        .catch(next);
}

function getRecipe(req, res, next) {
    const { recipeId } = req.params;

    recipeModel.findById(recipeId)
        .populate('creator', '-password')
        .then(recipe => res.json(recipe))
        .catch(next);
}

function createRecipe(req, res, next) {
    const { title, description, ingredients, instructions, imageUrl } = req.body;
    const { _id: creator } = req.user;

    recipeModel.create({ title, description, ingredients, instructions, imageUrl, creator })
        .then(recipe => {
            return userModel.updateOne({ _id: creator }, { $push: { recipes: recipe._id } })
                .then(() => recipe.populate('creator', '-password'))
                .then(populatedRecipe => res.json(populatedRecipe));
        })
        .catch(next);
}

function editRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { title, description, ingredients, instructions, imageUrl } = req.body;
    const { _id: userId } = req.user;

    recipeModel.findOneAndUpdate(
        { _id: recipeId, creator: userId },
        { title, description, ingredients, instructions, imageUrl },
        { new: true }
    )
    .populate('creator', '-password')
    .then(updatedRecipe => {
        if (updatedRecipe) {
            res.json(updatedRecipe);
        } else {
            res.status(401).json({ message: 'Not authorized to edit this recipe' });
        }
    })
    .catch(next);
}

function deleteRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;

    Promise.all([
        recipeModel.findOneAndDelete({ _id: recipeId, creator: userId }),
        userModel.updateOne({ _id: userId }, { $pull: { recipes: recipeId } })
    ])
    .then(([deletedRecipe]) => {
        if (deletedRecipe) {
            res.json(deletedRecipe);
        } else {
            res.status(401).json({ message: 'Not authorized to delete this recipe' });
        }
    })
    .catch(next);
}

function likeRecipe(req, res, next) {
    const { recipeId } = req.params;
    const { _id: userId } = req.user;

    recipeModel.findByIdAndUpdate(
        recipeId, 
        { $addToSet: { likes: userId } }, 
        { new: true }
    )
    .populate('creator', '-password')
    .then(recipe => {
        if (recipe) {
            res.json(recipe);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    })
    .catch(next);
}

function getUserRecipes(req, res, next) {
    const { _id: userId } = req.user;

    recipeModel.find({ creator: userId })
        .populate('creator', '-password')
        .then(recipes => res.json(recipes))
        .catch(next);
}

function getLikedRecipes(req, res, next) {
    const { _id: userId } = req.user;

    recipeModel.find({ likes: userId })
        .populate('creator', '-password')
        .then(recipes => res.json(recipes))
        .catch(next);
}

module.exports = {
    getRecipes,
    getRecipe,
    createRecipe,
    editRecipe,
    deleteRecipe,
    likeRecipe,
    getUserRecipes,
    getLikedRecipes
}