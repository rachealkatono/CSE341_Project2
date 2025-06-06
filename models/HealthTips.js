const { ObjectId } = require('mongodb');
const db = require('../data/database');

class HealthTip {
  static getDatabase() {
    return db.getDatabase();
  }

  static async findAll() {
    const database = this.getDatabase();
    return await database.collection('healthtips').find({}).toArray();
  }

  static async findById(id) {
    const database = this.getDatabase();
    return await database.collection('healthtips').findOne({ _id: new ObjectId(id) });
  }

  static async create(healthTipData) {
    const database = this.getDatabase();
    const result = await database.collection('healthtips').insertOne({
      ...healthTipData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { ...healthTipData, _id: result.insertedId };
  }

  static async update(id, updateData) {
    const database = this.getDatabase();
    const result = await database.collection('healthtips').updateOne(
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
    return await database.collection('healthtips').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = HealthTip;
