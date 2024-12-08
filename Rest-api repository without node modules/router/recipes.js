const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController } = require('../controllers');

// Public routes (no auth required)
router.get('/', recipeController.getRecipes);  // This should be public
router.get('/:recipeId', recipeController.getRecipe);

// Protected routes (auth required)
router.get('/user', auth(), recipeController.getUserRecipes);
router.get('/liked', auth(), recipeController.getLikedRecipes);
router.post('/', auth(), recipeController.createRecipe);
router.put('/:recipeId', auth(), recipeController.editRecipe);
router.delete('/:recipeId', auth(), recipeController.deleteRecipe);
router.post('/:recipeId/like', auth(), recipeController.likeRecipe);
router.post('/seed', recipeController.forceSeedRecipes);

module.exports = router;