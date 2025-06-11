const { ObjectId } = require('mongodb');
const db = require('../data/database');

class healthtip {
  static async findAll() {
    const database = db.getDatabase();
    return await database.collection('healthtips').find({}).toArray();
  }

  static async findById(id) {
    const database = db.getDatabase();
    return await database.collection('healthtips').findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    const database = db.getDatabase();
    return await database.collection('healthtips').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static async update(id, updateData) {
    const database = db.getDatabase();
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
    const database = db.getDatabase();
    return await database.collection('healthtips').deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = healthtip;
