const healthtips = require('../models/healthtips');

const healthtipsControllers = {
  async getAllhealthtips(req, res) {
    try {
      console.log('Fetching all health tips...');
      const healthtips = await healthtip.findAll();
      
      if (!healthtips) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch health tips' 
        });
      }
      
      return res.json({ 
        success: true, 
        count: healthtips.length,
        data: healthtips 
      });
    } catch (error) {
      console.error('Error in getAllhealthtips:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async gethealthtipById(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching health tip by ID:', id);
      
      const healthtips = await healthtip.findById(id);
      if (!healthtips) {
        return res.status(404).json({ 
          success: false, 
          message: 'Health tip not found' 
        });
      }
      
      return res.json({ 
        success: true, 
        data: healthtips
      });
    } catch (error) {
      console.error('Error in gethealthtipById:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async createhealthtip(req, res) {
    try {
      const { title, content, catergory } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and content are required' 
        });
      }

      const healthtipsData = {
        title,
        content,
        catergory,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await healthtip.create(healthtipsData);
      const newhealthtip = await healthtip.findById(result.insertedId);

      return res.status(201).json({ 
        success: true, 
        data: newhealthtip
      });
    } catch (error) {
      console.error('Error in createhealthtip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async updatehealthtip(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      
      const result = await healthtip.update(id, updateData);
      
      if (!result.matchedCount) {
        return res.status(404).json({ 
          success: false, 
          message: 'Health tip not found' 
        });
      }

      const updatedhealthtip = await healthtip.findById(id);
      return res.json({ 
        success: true, 
        data: updatedhealthtip 
      });
    } catch (error) {
      console.error('Error in updatedhealthtip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async deletehealthtip(req, res) {
    try {
      const { id } = req.params;
      const result = await healthtip.delete(id);
      
      if (!result.deletedCount) {
        return res.status(404).json({ 
          success: false, 
          message: 'Health tip not found' 
        });
      }

      return res.json({ 
        success: true, 
        message: 'Health tip deleted successfully' 
      });
    } catch (error) {
      console.error('Error in deletehealthtip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};

module.exports = healthtipsControllers;
