const { recipeModel, userModel } = require('../models');

const seedRecipes = [
    {
        title: "Classic Spaghetti Carbonara",
        description: "Traditional Italian pasta dish with eggs, cheese, pancetta and black pepper",
        imageUrl: "https://images.services.kitchenstories.io/z_bWPIhhM6qs38B0E46CRaYs81Q=/3840x0/filters:quality(85)/images.kitchenstories.io/wagtailOriginalImages/R2568-photo-final-_0.jpg",
        ingredients: [
            "400g spaghetti",
            "200g pancetta",
            "4 large eggs",
            "100g Pecorino Romano cheese"
        ],
        instructions: [
            "Cook pasta in salted water",
            "Fry pancetta until crispy",
            "Mix eggs and cheese"
        ]
    },
    {
        title: "Homemade Margherita Pizza",
        description: "Classic Neapolitan pizza with fresh basil, mozzarella, and tomatoes",
        imageUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=1474&auto=format&fit=crop",
        ingredients: [
            "Pizza dough",
            "San Marzano tomatoes",
            "Fresh mozzarella",
            "Fresh basil"
        ],
        instructions: [
            "Preheat oven to 500°F",
            "Roll out dough",
            "Add toppings",
            "Bake until crispy"
        ]
    },
    {
        title: "Fresh Greek Salad",
        description: "Traditional Greek salad with fresh vegetables and feta cheese",
        imageUrl: "https://hips.hearstapps.com/hmg-prod/images/greek-salad-index-642f292397bbf.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*",
        ingredients: [
            "Cucumber",
            "Tomatoes",
            "Red onion",
            "Feta cheese"
        ],
        instructions: [
            "Chop vegetables",
            "Combine in bowl",
            "Add feta and olives",
            "Dress with olive oil"
        ]
    }
];

function getRecipes(req, res, next) {
    // First, get all existing recipes
    recipeModel.find()
        .populate('creator', '-password')
        .then(async (recipes) => {
            try {
                // If no recipes exist at all, add the seed recipes
                if (recipes.length === 0) {
                    console.log('No recipes found, adding seeds...');
                    
                    // Create seed recipes without a creator
                    const seedsToCreate = seedRecipes.map(recipe => ({
                        ...recipe,
                        likes: []
                    }));

                    const seededRecipes = await recipeModel.insertMany(seedsToCreate);
                    console.log('Seeds added successfully');
                    
                    // Return all recipes including the newly seeded ones
                    return recipeModel.find().populate('creator', '-password');
                }
                
                return recipes;
            } catch (error) {
                console.error('Error in recipe seeding:', error);
                throw error;
            }
        })
        .then(allRecipes => {
            res.json(allRecipes);
        })
        .catch(error => {
            console.error('Error in getRecipes:', error);
            next(error);
        });
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

    // First check if the user has already liked the recipe
    recipeModel.findById(recipeId)
        .then(recipe => {
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }

            const isLiked = recipe.likes.includes(userId);
            const operation = isLiked 
                ? { $pull: { likes: userId } }    // Remove like
                : { $addToSet: { likes: userId } }; // Add like

            return recipeModel.findByIdAndUpdate(
                recipeId,
                operation,
                { new: true }
            ).populate('creator', '-password');
        })
        .then(updatedRecipe => {
            if (updatedRecipe) {
                res.json(updatedRecipe);
            } else {
                res.status(404).json({ message: 'Recipe not found' });
            }
        })
        .catch(next);
}

function getUserRecipes(req, res, next) {
    const { _id: userId } = req.user;
    console.log('Fetching recipes for user:', userId);

    recipeModel.find({ creator: userId })
        .populate('creator', '-password')
        .then(recipes => {
            console.log('Found recipes:', recipes.length);
            res.json(recipes);
        })
        .catch(err => {
            console.error('Error fetching user recipes:', err);
            next(err);
        });
}

function getLikedRecipes(req, res, next) {
    const { _id: userId } = req.user;
    console.log('Fetching liked recipes for user:', userId);

    recipeModel.find({ likes: userId })
        .populate('creator', '-password')
        .then(recipes => {
            console.log('Found liked recipes:', recipes.length);
            res.json(recipes);
        })
        .catch(err => {
            console.error('Error fetching liked recipes:', err);
            next(err);
        });
}

function forceSeedRecipes(req, res, next) {
    // First check if recipes already exist
    recipeModel.countDocuments()
        .then(count => {
            if (count > 0) {
                // If recipes exist, just return the existing recipes
                return recipeModel.find().populate('creator', '-password');
            }

            // If no recipes exist, proceed with seeding
            return userModel.findOne()
                .then(user => {
                    if (!user) {
                        throw new Error('No users found to assign as creator');
                    }
                    
                    return Promise.all(seedRecipes.map(recipe => {
                        const newRecipe = {
                            ...recipe,
                            likes: [],
                            creator: user._id
                        };
                        return recipeModel.create(newRecipe);
                    }));
                });
        })
        .then(recipes => {
            console.log('Recipes returned:', recipes);
            res.json(recipes);
        })
        .catch(err => {
            console.error('Seeding error:', err);
            next(err);
        });
}

module.exports = {
    getRecipes,
    getRecipe,
    createRecipe,
    editRecipe,
    deleteRecipe,
    likeRecipe,
    getUserRecipes,
    getLikedRecipes,
    forceSeedRecipes
}