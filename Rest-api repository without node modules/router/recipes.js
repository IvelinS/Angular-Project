const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { recipeController } = require('../controllers');

router.get('/user', auth(), recipeController.getUserRecipes);
router.get('/liked', auth(), recipeController.getLikedRecipes);
router.get('/', recipeController.getRecipes);
router.post('/', auth(), recipeController.createRecipe);
router.get('/:recipeId', recipeController.getRecipe);
router.put('/:recipeId', auth(), recipeController.editRecipe);
router.delete('/:recipeId', auth(), recipeController.deleteRecipe);
router.post('/:recipeId/like', auth(), recipeController.likeRecipe);

module.exports = router;