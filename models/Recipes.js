const { ObjectId } = require('mongodb');
const db = require('../data/database');

class Recipe {
  static async findAll() {
    const database = db.getDatabase();
    return await database.collection('recipes').find({}).toArray();
  }

  static async findById(id) {
    const database = db.getDatabase();
    return await database.collection('recipes').findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    const database = db.getDatabase();
    return await database.collection('recipes').insertOne({
      title: data.title,                // String: Recipe name
      ingredients: data.ingredients,    // Array of strings: list of ingredients
      instructions: data.instructions,  // String: step-by-step instructions
      cookingTime: data.cookingTime,    // Number (minutes)
      difficulty: data.difficulty,      // String (e.g., Easy, Medium, Hard)
      author: data.author,              // String: who created or contributed the recipe
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  static async update(id, updateData) {
    const database = db.getDatabase();
    const result = await database.collection('recipes').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    return result;
  }

  static async delete(id) {
    const database = db.getDatabase();
    return await database.collection('recipes').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = Recipe;
