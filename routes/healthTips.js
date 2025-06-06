const express = require('express');
const router = express.Router();
const db = require('../data/database');
const HealthTip = require('../models/HealthTips'); // Fixed import path

// DB connection middleware
router.use(async (req, res, next) => {
  try {
    // Check if database connection exists
    if (!db.getDb) {
      throw new Error('Database connection not available');
    }
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

// GET all health tips
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all health tips...');
    const tips = await HealthTip.findAll();

    console.log(`Found ${tips.length} health tips`);

    res.json({
      success: true,
      count: tips.length,
      data: tips
    });
  } catch (error) {
    console.error('Error fetching health tips:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: 'Failed to fetch health tips'
    });
  }
});

// GET a single health tip by ID
router.get('/:id', async (req, res) => {
  try {
    const tip = await HealthTip.findById(req.params.id);

    if (!tip) {
      return res.status(404).json({
        success: false,
        message: 'Health tip not found'
      });
    }

    res.json({
      success: true,
      data: tip
    });
  } catch (error) {
    console.error('Error fetching health tip:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// POST create a new health tip
router.post('/', async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const tipData = {
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await HealthTip.create(tipData);
    const newTip = await HealthTip.findById(result.insertedId);

    res.status(201).json({
      success: true,
      data: newTip,
      message: 'Health tip created successfully'
    });
  } catch (error) {
    console.error('Error creating health tip:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// PUT update a health tip
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date() };

    const result = await HealthTip.update(req.params.id, updateData);

    if (!result.matchedCount) {
      return res.status(404).json({
        success: false,
        message: 'Health tip not found'
      });
    }

    const updatedTip = await HealthTip.findById(req.params.id);

    res.json({
      success: true,
      data: updatedTip,
      message: 'Health tip updated successfully'
    });
  } catch (error) {
    console.error('Error updating health tip:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// DELETE a health tip
router.delete('/:id', async (req, res) => {
  try {
    const result = await HealthTip.delete(req.params.id);

    if (!result.deletedCount) {
      return res.status(404).json({
        success: false,
        message: 'Health tip not found'
      });
    }

    res.json({
      success: true,
      message: 'Health tip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting health tip:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;