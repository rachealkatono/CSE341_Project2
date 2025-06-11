const express = require('express');
const router = express.Router();
const db = require('../data/database');
const Book = require('../models/recipe');

// Simplified middleware
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
    console.log('Fetching all recipes...');
    const recipes = await recipe.findAll();
    
    console.log(`Found ${recipes.length} recipes`);
    
    res.json({ 
      success: true, 
      count: recipes.length,
      data: recipes 
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: 'Failed to fetch recipes'
    });
  }
});

// GET single recipe
router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching recipe with ID:', req.params.id);
    const recipe = await recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ 
        success: false, 
        message: 'recipe not found' 
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

// POST create recipe
router.post('/', async (req, res) => {
  try {
    console.log('Creating recipe with data:', req.body);
    
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'recipe title is required'
      });
    }
    
    const result = await recipe.create(req.body);
    const newrecipe = await recipe.findById(result.insertedId);
    
    res.status(201).json({ 
      success: true, 
      data: newrecipe,
      message: 'recipe created successfully'
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
    const result = await recipe.update(req.params.id, req.body);
    
    if (!result.matchedCount) {
      return res.status(404).json({ 
        success: false, 
        message: 'recipe not found' 
      });
    }
    
    const updatedrecipe = await recipe.findById(req.params.id);
    res.json({ 
      success: true, 
      data: updatedrecipe,
      message: 'recipe updated successfully' 
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
    const result = await recipe.delete(req.params.id);
    
    if (!result.deletedCount) {
      return res.status(404).json({ 
        success: false, 
        message: 'recipe not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'recipe deleted successfully' 
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