const Recipe = require('../models/Recipe'); 

const recipeControllers = {
  // GET all recipes
  async getAllRecipes(req, res) {
    try {
      console.log('📖 Fetching all health recipes...');
      const recipes = await Recipe.findAll();

      if (!recipes || recipes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No recipes found'
        });
      }

      res.json({
        success: true,
        count: recipes.length,
        data: recipes
      });
    } catch (error) {
      console.error('❌ Error in getAllRecipes:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recipes',
        error: error.message
      });
    }
  },

  // GET a recipe by ID
  async getRecipeById(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Fetching recipe with ID:', id);

      const recipe = await Recipe.findById(id);

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
      console.error('❌ Error in getRecipeById:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recipe',
        error: error.message
      });
    }
  },

  // POST a new recipe
  async createRecipe(req, res) {
    try {
      const { title, description, ingredients, steps } = req.body;

      if (!title || typeof title !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Valid recipe title is required'
        });
      }

      const recipeData = {
        title,
        description,
        ingredients,
        steps,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await Recipe.create(recipeData);
      const newRecipe = await Recipe.findById(result.insertedId);

      res.status(201).json({
        success: true,
        data: newRecipe,
        message: 'Recipe added successfully'
      });
    } catch (error) {
      console.error('❌ Error in createRecipe:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create recipe',
        error: error.message
      });
    }
  },

  // PUT update recipe
  async updateRecipe(req, res) {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };

      const result = await Recipe.update(id, updateData);

      if (!result.matchedCount) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      const updatedRecipe = await Recipe.findById(id);
      res.json({
        success: true,
        data: updatedRecipe,
        message: 'Recipe updated successfully'
      });
    } catch (error) {
      console.error('❌ Error in updateRecipe:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update recipe',
        error: error.message
      });
    }
  },

  // DELETE recipe
  async deleteRecipe(req, res) {
    try {
      const { id } = req.params;

      const result = await Recipe.delete(id);

      if (!result.deletedCount) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      res.json({
        success: true,
        message: 'Recipe removed successfully'
      });
    } catch (error) {
      console.error('❌ Error in deleteRecipe:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete recipe',
        error: error.message
      });
    }
  }
};

module.exports = recipeControllers;
