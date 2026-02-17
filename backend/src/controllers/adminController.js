import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Token from '../models/Token.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get counts
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    
    const todayAppointments = await Appointment.countDocuments({
      date: { $gte: today, $lt: tomorrow }
    });
    
    const activeTokens = await Token.countDocuments({ 
      status: { $in: ['waiting', 'called', 'in-progress'] } 
    });
    
    const completedToday = await Token.countDocuments({
      status: 'completed',
      servedAt: { $gte: today, $lt: tomorrow }
    });

    // Average wait time today
    const todayTokens = await Token.find({
      createdAt: { $gte: today, $lt: tomorrow },
      status: 'completed'
    });
    
    const avgWaitTime = todayTokens.length > 0
      ? todayTokens.reduce((acc, token) => {
          const waitTime = (token.calledAt - token.arrivalTime) / (1000 * 60);
          return acc + waitTime;
        }, 0) / todayTokens.length
      : 0;

    res.json({
      success: true,
      stats: {
        totalPatients,
        totalStaff,
        totalDoctors,
        todayAppointments,
        activeTokens,
        completedToday,
        avgWaitTime: Math.round(avgWaitTime * 10) / 10
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role && role !== 'all') query.role = role;
    
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { fullName, email, role, phone, age, isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.age = age || user.age;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        age: user.age,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get system performance metrics
// @route   GET /api/admin/performance
// @access  Private/Admin
export const getPerformanceMetrics = async (req, res) => {
  try {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const appointments = await Appointment.countDocuments({
        date: { $gte: date, $lt: nextDate }
      });

      const completed = await Token.countDocuments({
        status: 'completed',
        servedAt: { $gte: date, $lt: nextDate }
      });

      last7Days.push({
        date: date.toISOString().split('T')[0],
        appointments,
        completed
      });
    }

    // Peak hours analysis
    const peakHours = await Token.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      metrics: {
        last7Days,
        peakHours: peakHours.map(p => ({ hour: p._id, count: p.count }))
      }
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};