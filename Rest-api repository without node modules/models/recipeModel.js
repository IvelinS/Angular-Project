const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }],
    imageUrl: String,
    creator: {
        type: ObjectId,
        ref: "User",
        required: true
    },
    likes: [{
        type: ObjectId,
        ref: "User"
    }],
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);