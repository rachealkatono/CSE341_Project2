const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation helper
const validateRecipeData = (recipeData, isUpdate = false) => {
  const errors = [];

  const requiredFields = [
    'title', 'healthTips', 'ingredients', 'steps',
    'calories', 'prepTime', 'cookTime', 'category', 'isVegan'
  ];

  for (const field of requiredFields) {
    if (!isUpdate && (recipeData[field] === undefined || recipeData[field] === null)) {
      errors.push(`${field} is required`);
    }
  }

  if (recipeData.title && typeof recipeData.title !== 'string') {
    errors.push('Title must be a string');
  }

  if (recipeData.healthTips && typeof recipeData.healthTips !== 'string') {
    errors.push('HealthTips must be a string');
  }

  if (recipeData.ingredients && !Array.isArray(recipeData.ingredients)) {
    errors.push('Ingredients must be an array');
  }

  if (recipeData.steps && !Array.isArray(recipeData.steps)) {
    errors.push('Steps must be an array');
  }

  if (recipeData.calories && (typeof recipeData.calories !== 'number' || recipeData.calories < 0)) {
    errors.push('Calories must be a positive number');
  }

  if (recipeData.prepTime && (typeof recipeData.prepTime !== 'number' || recipeData.prepTime < 0)) {
    errors.push('PrepTime must be a positive number');
  }

  if (recipeData.cookTime && (typeof recipeData.cookTime !== 'number' || recipeData.cookTime < 0)) {
    errors.push('CookTime must be a positive number');
  }

  if (recipeData.category && typeof recipeData.category !== 'string') {
    errors.push('Category must be a string');
  }

  if (recipeData.isVegan !== undefined && typeof recipeData.isVegan !== 'boolean') {
    errors.push('isVegan must be a boolean');
  }

  return errors;
};

const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
};

// GET all recipes
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('recipes').find();
    const recipes = await result.toArray();
    res.status(200).json(recipes);
  } catch (err) {
    console.error('Error fetching recipes:', err);
    res.status(500).json({ error: 'Failed to fetch recipes', details: err.message });
  }
};

// GET one recipe by ID
const getSingle = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid recipe ID format' });
    }

    const recipeId = new ObjectId(req.params.id);
    const recipe = await mongodb.getDatabase().db().collection('recipes').findOne({ _id: recipeId });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error('Error fetching recipe:', err);
    res.status(500).json({ error: 'Failed to fetch the recipe', details: err.message });
  }
};

// CREATE new recipe
const createRecipe = async (req, res) => {
  try {
    const validationErrors = validateRecipeData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }

    const recipe = {
      title: req.body.title,
      healthTips: req.body.healthTips,
      ingredients: req.body.ingredients,
      steps: req.body.steps,
      calories: req.body.calories,
      prepTime: req.body.prepTime,
      cookTime: req.body.cookTime,
      category: req.body.category,
      isVegan: req.body.isVegan,
      createdAt: new Date()
    };

    const response = await mongodb.getDatabase().db().collection('recipes').insertOne(recipe);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Recipe created successfully', recipeId: response.insertedId });
    } else {
      res.status(500).json({ error: 'Failed to create recipe' });
    }
  } catch (err) {
    console.error('Error creating recipe:', err);
    res.status(500).json({ error: 'Failed to create recipe', details: err.message });
  }
};

// UPDATE recipe
const updateRecipe = async (req, res) => {
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

    const allowedFields = [
      'title', 'healthTips', 'ingredients', 'steps',
      'calories', 'prepTime', 'cookTime', 'category', 'isVegan'
    ];

    const updateData = {};
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

// DELETE recipe
const deleteRecipe = async (req, res) => {
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
