import express from 'express';
import TenderRequest from '../models/TenderRequest.js';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import { sendTenderRequestEmailToAdmin } from '../utils/emailService.js';
import { broadcastToChannel } from '../index.js';

const tenderRoutes = express.Router();

// Get tender requests with pagination and filters
tenderRoutes.get('/', async (req, res) => {
  try {
    const { 
      status,
      projectType,
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = -1,
      search = ''
    } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (projectType && projectType !== 'all') {
      query.projectType = projectType;
    }

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { projectLocation: { $regex: search, $options: 'i' } }
      ];
    }
    
    const requests = await TenderRequest.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();
    
    const total = await TenderRequest.countDocuments(query);
    
    res.status(200).json({
      requests,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Get tender requests error:', error);
    res.status(500).json({ message: 'Failed to retrieve tender requests' });
  }
});

// Create new tender request
tenderRoutes.post('/', async (req, res) => {
  console.log('POST /api/tender-requests hit');  // ✅ Step 1: Confirm the route is triggered
  console.log('Request Body:', req.body)
  try {
    const {
      companyName,
      contactPerson,
      email,
      phone,
      projectType,
      projectLocation,
      estimatedBudget,
      preferredTimeline,
      projectDescription
    } = req.body;
    
    const newTenderRequest = new TenderRequest({
      companyName,
      contactPerson,
      email,
      phone,
      projectType,
      projectLocation,
      estimatedBudget,
      preferredTimeline,
      projectDescription
    });
    
    const savedRequest = await newTenderRequest.save();
    // ✅ Add this block after saving to DB
    try {
      await sendTenderRequestEmailToAdmin(savedRequest);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Continue even if email fails
    }

    // Broadcast new request to admin dashboard
    broadcastToChannel('tender-requests', {
      type: 'NEW_REQUEST',
      request: savedRequest
    });

    // Update dashboard stats
    const totalRequests = await TenderRequest.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newRequestsToday = await TenderRequest.countDocuments({
      createdAt: { $gte: today }
    });

    broadcastToChannel('dashboard-stats', {
      type: 'STATS_UPDATE',
      stats: {
        totalRequests,
        newRequestsToday
      }
    });

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Create tender request error:', error);
    res.status(500).json({ 
      error: 'Something went wrong',
      message: error.message
    });
  }
});

// Get tender request by ID (admin only)
tenderRoutes.get('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const request = await TenderRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Tender request not found' });
    }
    
    res.status(200).json(request);
  } catch (error) {
    console.error('Get tender request error:', error);
    res.status(500).json({ message: 'Failed to retrieve tender request' });
  }
});

// Update tender request status (admin only)
tenderRoutes.patch('/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['new', 'reviewed', 'contacted', 'completed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const request = await TenderRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Tender request not found' });
    }
    
    // Broadcast update to admin dashboard
    broadcastToChannel('tender-requests', {
      type: 'UPDATE_REQUEST',
      request
    });

    res.status(200).json(request);
  } catch (error) {
    console.error('Update tender request status error:', error);
    res.status(500).json({ message: 'Failed to update tender request status' });
  }
});

// Add note to tender request (admin only)
tenderRoutes.post('/:id/notes', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }
    
    const request = await TenderRequest.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            content,
            createdBy: req.user.id,
            createdAt: new Date()
          }
        }
      },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Tender request not found' });
    }
    
    // Broadcast update to admin dashboard
    broadcastToChannel('tender-requests', {
      type: 'UPDATE_REQUEST',
      request
    });

    res.status(200).json(request);
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({ message: 'Failed to add note' });
  }
});

// Delete tender request
tenderRoutes.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const request = await TenderRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Tender request not found' });
    }

    // Broadcast deletion to admin dashboard
    broadcastToChannel('tender-requests', {
      type: 'DELETE_REQUEST',
      requestId: req.params.id
    });

    // Update dashboard stats
    const totalRequests = await TenderRequest.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newRequestsToday = await TenderRequest.countDocuments({
      createdAt: { $gte: today }
    });

    broadcastToChannel('dashboard-stats', {
      type: 'STATS_UPDATE',
      stats: {
        totalRequests,
        newRequestsToday
      }
    });

    res.status(200).json({ message: 'Tender request deleted successfully' });
  } catch (error) {
    console.error('Delete tender request error:', error);
    res.status(500).json({ message: 'Failed to delete tender request' });
  }
});

export default tenderRoutes;
