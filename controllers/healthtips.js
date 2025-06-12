const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation helper function for healthtips
const validateHealthtipData = (healthtipData, isUpdate = false) => {
  const errors = [];
  
  // Required fields for creation (7+ fields as required)
  const requiredFields = ['name', 'birthDate', 'nationality', 'biography', 'genre', 'totalRecipes', 'isActive'];
  
  for (const field of requiredFields) {
    if (!isUpdate && (!healthtipData[field] && healthtipData[field] !== 0 && healthtipData[field] !== false)) {
      errors.push(`${field} is required`);
    }
  }
  
  // Validate data types and formats
  if (healthtipData.name && typeof healthtipData.name !== 'string') {
    errors.push('Name must be a string');
  }
  
  if (healthtipData.nationality && typeof healthtipData.nationality !== 'string') {
    errors.push('Nationality must be a string');
  }
  
  if (healthtipData.biography && typeof healthtipData.biography !== 'string') {
    errors.push('Biography must be a string');
  }
  
  if (healthtipData.genre && typeof healthtipData.genre !== 'string') {
    errors.push('Genre must be a string');
  }
  
  if (healthtipData.totalRecipes && (typeof healthtipData.totalRecipes !== 'number' || healthtipData.totalRecipes < 0)) {
    errors.push('Total recipes must be a positive number');
  }
  
  if (healthtipData.isActive !== undefined && typeof healthtipData.isActive !== 'boolean') {
    errors.push('isActive must be a boolean');
  }
  
  // Validate date format
  if (healthtipData.birthDate && isNaN(Date.parse(healthtipData.birthDate))) {
    errors.push('birthDate must be a valid date');
  }
  
  return errors;
};

// Validate ObjectId format
const isValidObjectId = (id) => {
  return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
};

//#swagger.tags=['healthtips']
const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('healthtips').find();
    const healthtips = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(healthtips);
  } catch (err) {
    console.error('Error fetching healthtips:', err);
    res.status(500).json({ error: 'Failed to fetch healthtips', details: err.message });
  }
};

// GET single healthtip by ID
const getSingle = async (req, res) => {
  //#swagger.tags=['healthtips']
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid healthtip ID format' });
    }
    
    const healthtipId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection('healthtips').findOne({ _id: healthtipId });
    
    if (!result) {
      return res.status(404).json({ error: 'Healthtip not found' });
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    console.error('Error fetching healthtip:', err);
    res.status(500).json({ error: 'Failed to fetch the healthtip', details: err.message });
  }
};

const createHealthtip = async (req, res) => {
  //#swagger.tags=['healthtips']
  try {
    // Validate input data
    const validationErrors = validateHealthtipData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }
    
    const healthtip = {
      name: req.body.name,
      birthDate: new Date(req.body.birthDate),
      nationality: req.body.nationality,
      biography: req.body.biography,
      genre: req.body.genre,
      totalRecipes: req.body.totalRecipes,
      isActive: req.body.isActive,
      createdAt: new Date()
    };
    
    const response = await mongodb.getDatabase().db().collection('healthtips').insertOne(healthtip);
    
    if (response.acknowledged) {
      res.status(201).json({ 
        message: 'Healthtip created successfully', 
        healthtipId: response.insertedId 
      });
    } else {
      res.status(500).json({ error: 'Failed to create healthtip' });
    }
  } catch (err) {
    console.error('Error creating healthtip:', err);
    res.status(500).json({ error: 'Failed to create healthtip', details: err.message });
  }
};

const updateHealthtip = async (req, res) => {
  //#swagger.tags=['healthtips']
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid healthtip ID format' });
    }
    
    // Validate input data (for updates, fields are optional)
    const validationErrors = validateHealthtipData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: validationErrors });
    }
    
    const healthtipId = new ObjectId(req.params.id);
    
    // Check if healthtip exists
    const existingHealthtip = await mongodb.getDatabase().db().collection('healthtips').findOne({ _id: healthtipId });
    if (!existingHealthtip) {
      return res.status(404).json({ error: 'Healthtip not found' });
    }
    
    // Prepare update data (only include provided fields)
    const updateData = {};
    const allowedFields = ['name', 'birthDate', 'nationality', 'biography', 'genre', 'totalRecipes', 'isActive'];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'birthDate' ? new Date(req.body[field]) : req.body[field];
      }
    }
    
    updateData.updatedAt = new Date();
    
    const response = await mongodb.getDatabase().db().collection('healthtips').updateOne(
      { _id: healthtipId }, 
      { $set: updateData }
    );
    
    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Healthtip updated successfully' });
    } else {
      res.status(200).json({ message: 'No changes made to healthtip' });
    }
  } catch (err) {
    console.error('Error updating healthtip:', err);
    res.status(500).json({ error: 'Failed to update healthtip', details: err.message });
  }
};

const deleteHealthtip = async (req, res) => {
  //#swagger.tags=['healthtips']
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid healthtip ID format' });
    }
    
    const healthtipId = new ObjectId(req.params.id);
    
    // Check if healthtip exists
    const existingHealthtip = await mongodb.getDatabase().db().collection('healthtips').findOne({ _id: healthtipId });
    if (!existingHealthtip) {
      return res.status(404).json({ error: 'Healthtip not found' });
    }
    
    const response = await mongodb.getDatabase().db().collection('healthtips').deleteOne({ _id: healthtipId });
    
    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Healthtip deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete healthtip' });
    }
  } catch (err) {
    console.error('Error deleting healthtip:', err);
    res.status(500).json({ error: 'Failed to delete healthtip', details: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createHealthtip,
  updateHealthtip,
  deleteHealthtip
};



