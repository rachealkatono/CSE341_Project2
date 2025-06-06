const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation helper function for recipes
const validateRecipeData = (recipeData, isUpdate = false) => {
  const errors = [];

  // Required fields for creation
  const requiredFields = ['title', 'description', 'ingredients', 'steps', 'servings', 'prepTime', 'isHealthy'];

  for (const field of requiredFields) {
    if (!isUpdate && (recipeData[field] === undefined || recipeData[field] === null)) {
      errors.push(`${field} is required`);
    }
  }

  // Validate data types and formats
  if (recipeData.title && typeof recipeData.title !== 'string') {
    errors.push('Title must be a string');
  }

  if (recipeData.description && typeof recipeData.description !== 'string') {
    errors.push('Description must be a string');
  }

  if (recipeData.ingredients && !Array.isArray(recipeData.ingredients)) {
    errors.push('Ingredients must be an array');
  }

  if (recipeData.steps && !Array.isArray(recipeData.steps)) {
    errors.push('Steps must be an array');
  }

  if (recipeData.servings && (typeof recipeData.servings !== 'number' || recipeData.servings <= 0)) {
    errors.push('Servings must be a positive number');
  }

  if (recipeData.prepTime && typeof recipeData.prepTime !== 'string') {
    errors.push('PrepTime must be a string');
  }

  if (recipeData.isHealthy !== undefined && typeof recipeData.isHealthy !== 'boolean') {
    errors.push('isHealthy must be a boolean');
  }

  return errors;
};

// Validate ObjectId format
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
};

//#swagger.tags=['recipes']
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('recipes').find();
    const recipes = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes', details: err.message });
  }
};

// GET single recipe by ID
const getSingle = async (req, res) => {
  //#swagger.tags=['recipes']
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    const recipeId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('recipes').findOne({ _id: recipeId });

    if (!result) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ error: 'Failed to fetch the recipe', details: err.message });
  }
};

// POST: Create new recipe
const createRecipe = async (req, res) => {
  //#swagger.tags=['recipes']
  try {
    const validationErrors = validateRecipeData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const recipe = {
      title: req.body.title,
      description: req.body.description,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      servings: req.body.servings,
      prepTime: req.body.prepTime,
      isHealthy: req.body.isHealthy,
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase().db().collection('recipes').insertOne(recipe);

    if (response.acknowledged) {
      res.status(201).json({
        message: 'Recipe created successfully',
        recipeId: response.insertedId
      });
    } else {
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({ error: 'Failed to create recipe', details: err.message });
  }
};

// PUT: Update existing recipe
const updateRecipe = async (req, res) => {
  //#swagger.tags=['recipes']
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    const validationErrors = validateRecipeData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const recipeId = new ObjectId(req.params.id);

    const existingRecipe = await mongodb.getDatabase().db().collection('recipes').findOne({ _id: recipeId });
    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const updateData = {};
    const allowedFields = ['title', 'description', 'ingredients', 'steps', 'servings', 'prepTime', 'isHealthy'];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    updateData.updatedAt = new Date();

    const response = await mongodb.getDatabase().db().collection('recipes').updateOne(
      { _id: recipeId },
      { $set: updateData }
    );

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Recipe updated successfully' });
    } else {
      res.status(200).json({ message: 'No changes made to recipe' });
    }
  } catch (err) {
    console.error('Error updating recipe:', err);
    res.status(500).json({ error: 'Failed to update recipe', details: err.message });
  }
};

// DELETE: Remove a recipe
const deleteRecipe = async (req, res) => {
  //#swagger.tags=['recipes']
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    const recipeId = new ObjectId(req.params.id);

    const existingRecipe = await mongodb.getDatabase().db().collection('recipes').findOne({ _id: recipeId });
    if (!existingRecipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const response = await mongodb.getDatabase().db().collection('recipes').deleteOne({ _id: recipeId });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Recipe deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete recipe' });
    }
  } catch (err) {
    console.error('Error deleting recipe:', err);
    res.status(500).json({ error: 'Failed to delete recipe', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
