const express = require('express');
const router = express.Router();
const db = require('../data/database');
const Recipe = require('../models/Recipes');
const { ObjectId } = require('mongodb');

// Check DB connection middleware
router.use(async (req, res, next) => {
  try {
    await db.checkConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json({
      success: true,
      count: recipes.length,
      data: recipes
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// GET a single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(new ObjectId(req.params.id));
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    res.json({
      success: true,
      data: recipe
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST create a new recipe
router.post('/', async (req, res) => {
  try {
    const { title, ingredients, steps, calories, prepTime, cookTime, category, isVegan } = req.body;

    // Basic validation
    if (!title || !ingredients || !steps) {
      return res.status(400).json({
        success: false,
        message: 'Title, ingredients, and steps are required'
      });
    }

    const recipeData = {
      title,
      ingredients,
      steps,
      calories: Number(calories) || 0,
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      category: category || 'Uncategorized',
      isVegan: Boolean(isVegan),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Recipe.create(recipeData);
    const newRecipe = await Recipe.findById(result.insertedId);

    res.status(201).json({
      success: true,
      data: newRecipe
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT update recipe
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    const result = await Recipe.update(new ObjectId(id), updateData);
    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const updatedRecipe = await Recipe.findById(new ObjectId(id));
    res.json({
      success: true,
      data: updatedRecipe
    });
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE recipe
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Recipe.delete(new ObjectId(id));

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
