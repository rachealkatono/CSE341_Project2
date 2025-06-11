const express = require('express');
const router = express.Router();
const db = require('../data/database');
const Author = require('../models/healthtips');

// Connection check middleware
router.use(async (req, res, next) => {
  try {
    await db.checkConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed❌',
      error: error.message
    });
  }
});

// GET all healthtips
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all healthtips...');
    const healthtips = await healthtipr.findAll();
    
    console.log(`Found ${healthtips.length} healthtips`);
    
    res.json({ 
      success: true, 
      count: healthtips.length,
      data: healthtips 
    });
  } catch (error) {
    console.error('Error in getAllhealthtip:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET single healthtip by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching healthtip by ID:', id);
    
    const healthtip = await healthtip.findById(id);
    if (!healthtip) {
      return res.status(404).json({ 
        success: false, 
        message: 'healthtip not found' 
      });
    }
    
    res.json({ 
      success: true, 
      data: healthtip 
    });
  } catch (error) {
    console.error('Error in gethealthtipById:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// POST create new healthtip
router.post('/', async (req, res) => {
  try {
    const { name, email, bio } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required' 
      });
    }

    const healthtipData = {
      name,
      email,
      bio,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await healthtip.create(authorData);
    const newhealthtip = await healthtip.findById(result.insertedId);

    res.status(201).json({ 
      success: true, 
      data: newhealthtip 
    });
  } catch (error) {
    console.error('Error in createhealthtip:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// PUT update healthtip
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const result = await healthtip.update(id, updateData);
    
    if (!result.matchedCount) {
      return res.status(404).json({ 
        success: false, 
        message: 'healthtip not found' 
      });
    }

    const updatedhealthtip = await healthtip.findById(id);
    res.json({ 
      success: true, 
      data: updatedhealthtip  
    });
  } catch (error) {
    console.error('Error in updatehealthtip:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE healthtip
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await healthtip.delete(id);
    
    if (!result.deletedCount) {
      return res.status(404).json({ 
        success: false, 
        message: 'healthtip not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'healthtip deleted successfully' 
    });
  } catch (error) {
    console.error('Error in deletehealthtip:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
