const { ObjectId } = require('mongodb');
const { getDb } = require('../data/database');

const collection = 'healthTips';

const getAllTips = async (req, res) => {
  try {
    const db = getDb();
    const tips = await db.collection(collection).find().toArray();
    res.status(200).json(tips);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch health tips' });
  }
};

const getTipById = async (req, res) => {
  try {
    const db = getDb();
    const tip = await db.collection(collection).findOne({ _id: new ObjectId(req.params.id) });

    if (!tip) return res.status(404).json({ error: 'Tip not found' });
    res.status(200).json(tip);
  } catch {
    res.status(500).json({ error: 'Invalid tip ID' });
  }
};

const createTip = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = getDb();
    const result = await db.collection(collection).insertOne({ title, content, category });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to create tip' });
  }
};

const updateTip = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection(collection).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Tip not found' });
    res.status(200).json({ message: 'Tip updated' });
  } catch {
    res.status(500).json({ error: 'Failed to update tip' });
  }
};

const deleteTip = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection(collection).deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: 'Tip not found' });
    res.status(200).json({ message: 'Tip deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete tip' });
  }
};

module.exports = {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip
};
