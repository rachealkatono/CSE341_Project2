const { ObjectId } = require('mongodb');
const db = require('../data/database');

class recipe {
  static getDatabase() {
    // Get the database instance instead of checking connection
    return db.getDatabase();
  }

  static async findAll() {
    const database = this.getDatabase();
    return await database.collection('recipes').find({}).toArray();
  }

  static async findById(id) {
    const database = this.getDatabase();
    return await database.collection('recipes').findOne({ _id: new ObjectId(id) });
  }

  static async create(recipeData) {
    const database = this.getDatabase();
    const result = await database.collection('recipes').insertOne({
      ...recipeData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Return the inserted document with its ID
    return { ...recipeData, _id: result.insertedId };
  }

  static async update(id, updateData) {
    const database = this.getDatabase();
    const result = await database.collection('recipes').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      }
    );
    return result;
  }

  static async delete(id) {
    const database = this.getDatabase();
    return await database.collection('recipes').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = recipe;
