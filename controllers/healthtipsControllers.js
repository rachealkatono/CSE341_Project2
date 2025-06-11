const HealthTips = require('../models/healthtips');

const healthTipsControllers = {
  async getAllHealthTips(req, res) {
    try {
      console.log('Fetching all health tips...');
      const tips = await HealthTips.findAll();
      
      if (!tips) {
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to fetch health tips' 
        });
      }
      
      return res.json({ 
        success: true, 
        count: tips.length,
        data: tips 
      });
    } catch (error) {
      console.error('Error in getAllHealthTips:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async getHealthTipById(req, res) {
    try {
      const { id } = req.params;
      console.log('Fetching health tip by ID:', id);
      
      const tip = await HealthTips.findById(id);
      if (!tip) {
        return res.status(404).json({ 
          success: false, 
          message: 'Health tip not found' 
        });
      }
      
      return res.json({ 
        success: true, 
        data: tip 
      });
    } catch (error) {
      console.error('Error in getHealthTipById:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async createHealthTip(req, res) {
    try {
      const { title, content, source } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title and content are required' 
        });
      }

      const tipData = {
        title,
        content,
        source,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await HealthTips.create(tipData);
      const newTip = await HealthTips.findById(result.insertedId);

      return res.status(201).json({ 
        success: true, 
        data: newTip 
      });
    } catch (error) {
      console.error('Error in createHealthTip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async updateHealthTip(req, res) {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      
      const result = await HealthTips.update(id, updateData);
      
      if (!result.matchedCount) {
        return res.status(404).json({ 
          success: false, 
          message: 'Health tip not found' 
        });
      }

      const updatedTip = await HealthTips.findById(id);
      return res.json({ 
        success: true, 
        data: updatedTip 
      });
    } catch (error) {
      console.error('Error in updateHealthTip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  async deleteHealthTip(req, res) {
    try {
      const { id } = req.params;
      const result = await HealthTips.delete(id);
      
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
      console.error('Error in deleteHealthTip:', error);
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};

module.exports = healthTipsControllers;
