const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController, commentController } = require('../controllers');

// Protected routes (auth required)
router.get('/user', auth(), recipeController.getUserRecipes);
router.get('/liked', auth(), recipeController.getLikedRecipes);

// Public routes (no auth required)
router.get('/', recipeController.getRecipes);
router.get('/:recipeId', recipeController.getRecipe);

// Other protected routes
router.post('/', auth(), recipeController.createRecipe);
router.put('/:recipeId', auth(), recipeController.editRecipe);
router.delete('/:recipeId', auth(), recipeController.deleteRecipe);
router.post('/:recipeId/like', auth(), recipeController.likeRecipe);
router.post('/seed', recipeController.forceSeedRecipes);

// Comment routes
router.get('/:recipeId/comments', commentController.getComments);
router.post('/:recipeId/comments', auth(), commentController.createComment);
router.delete('/:recipeId/comments/:commentId', auth(), commentController.deleteComment);

module.exports = router;