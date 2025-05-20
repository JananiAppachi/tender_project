import express from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.js';
import TenderRequest from '../models/TenderRequest.js';
import User from '../models/User.js';
import { broadcastToChannel } from '../index.js';

const router = express.Router();

// Helper function to get monthly request counts
const getMonthlyRequestCounts = async () => {
  const months = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const targetMonth = today.getMonth() - i;
    const year = today.getFullYear() + Math.floor(targetMonth / 12);
    const month = (targetMonth % 12 + 12) % 12;
    
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    
    const count = await TenderRequest.countDocuments({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    months.push({
      month: monthNames[month],
      count
    });
  }
  
  return months;
};

// Helper function to get project type distribution
const getProjectTypeDistribution = async () => {
  const projectTypes = await TenderRequest.aggregate([
    {
      $group: {
        _id: '$projectType',
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        name: '$_id',
        value: '$count'
      }
    }
  ]);
  
  return projectTypes;
};

// Get dashboard statistics
router.get('/dashboard/stats', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    // Get total requests and today's new requests
    const totalRequests = await TenderRequest.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const newRequestsToday = await TenderRequest.countDocuments({
      createdAt: { $gte: today }
    });
    
    // Get total and active users
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    
    // Get monthly request counts for the last 12 months
    const requestsData = await getMonthlyRequestCounts();
    
    // Get project type distribution
    const projectTypesData = await getProjectTypeDistribution();

    // Get recent activity
    const recentActivity = await TenderRequest.find()
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean()
      .then(requests => requests.map(request => ({
        type: request.status === 'new' ? 'new_request' : 'status_update',
        message: request.status === 'new'
          ? `New tender request from ${request.companyName}`
          : `Tender request from ${request.companyName} marked as ${request.status}`,
        timestamp: request.updatedAt
      })));

    // Get performance metrics
    const performanceMetrics = [
      {
        name: 'Response Rate',
        value: Math.round((await TenderRequest.countDocuments({ status: { $ne: 'new' } }) / totalRequests) * 100)
      },
      {
        name: 'Completion Rate',
        value: Math.round((await TenderRequest.countDocuments({ status: 'completed' }) / totalRequests) * 100)
      },
      {
        name: 'User Engagement',
        value: Math.round((activeUsers / totalUsers) * 100)
      }
    ];
    
    const stats = {
      totalRequests,
      newRequestsToday,
      totalUsers,
      activeUsers,
      requestsData,
      projectTypesData,
      recentActivity,
      performanceMetrics
    };

    res.status(200).json(stats);

    // Broadcast stats update to all connected clients
    broadcastToChannel('DASHBOARD_STATS', {
      type: 'STATS_UPDATE',
      stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to retrieve dashboard statistics' });
  }
});

// Get tender requests with pagination and filters
router.get('/tender-requests', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { 
      status,
      projectType,
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = -1 
    } = req.query;
    
    const query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (projectType && projectType !== 'all') {
      query.projectType = projectType;
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

// Update tender request status
router.patch('/tender-requests/:id/status', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const request = await TenderRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!request) {
      return res.status(404).json({ message: 'Tender request not found' });
    }

    res.status(200).json(request);

    // Broadcast update to all connected clients
    broadcastToChannel('TENDER_REQUESTS', {
      type: 'UPDATE_REQUEST',
      request
    });
  } catch (error) {
    console.error('Update tender request status error:', error);
    res.status(500).json({ message: 'Failed to update tender request status' });
  }
});

// Get analytics data
router.get('/analytics', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const timeRange = req.query.timeRange || '7days';
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      default: // 7days
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Generate sample analytics data (replace with real analytics in production)
    const analyticsData = {
      visitors: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(now.setDate(now.getDate() - i)).toISOString().split('T')[0],
        unique: Math.floor(Math.random() * 1000) + 500,
        pageViews: Math.floor(Math.random() * 2000) + 1000
      })).reverse(),
      
      pageViews: [
        { page: '/home', views: 1250 },
        { page: '/projects', views: 850 },
        { page: '/about', views: 650 },
        { page: '/contact', views: 450 },
        { page: '/tenders', views: 950 }
      ],
      
      sources: [
        { name: 'Direct', value: 35 },
        { name: 'Organic Search', value: 25 },
        { name: 'Referral', value: 20 },
        { name: 'Social Media', value: 15 },
        { name: 'Email', value: 5 }
      ],
      
      devices: [
        { name: 'Desktop', value: 65 },
        { name: 'Mobile', value: 30 },
        { name: 'Tablet', value: 5 }
      ],
      
      engagementMetrics: {
        avgSessionDuration: '3:45',
        bounceRate: '35%',
        pagesPerSession: 4.2,
        activeUsers: Math.floor(Math.random() * 100) + 50
      }
    };

    res.status(200).json(analyticsData);

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to retrieve analytics data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;