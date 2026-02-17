import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'

const AppointmentsChart = ({ data, type = 'line' }) => {
  const [chartData, setChartData] = useState([])
  const [chartType, setChartType] = useState('line')
  const [timeRange, setTimeRange] = useState('week') // 'day', 'week', 'month'
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('peak') // 'peak' or 'system'

  // Generate data based on time range
  useEffect(() => {
    if (timeRange === 'day') {
      // Hourly data for today
      setChartData([
        { name: '8 AM', appointments: 12, completed: 10, canceled: 2 },
        { name: '9 AM', appointments: 18, completed: 16, canceled: 2 },
        { name: '10 AM', appointments: 24, completed: 20, canceled: 4 },
        { name: '11 AM', appointments: 22, completed: 19, canceled: 3 },
        { name: '12 PM', appointments: 15, completed: 14, canceled: 1 },
        { name: '1 PM', appointments: 8, completed: 8, canceled: 0 },
        { name: '2 PM', appointments: 20, completed: 18, canceled: 2 },
        { name: '3 PM', appointments: 25, completed: 22, canceled: 3 },
        { name: '4 PM', appointments: 19, completed: 17, canceled: 2 },
        { name: '5 PM', appointments: 14, completed: 13, canceled: 1 }
      ])
    } else if (timeRange === 'week') {
      // Daily data for this week
      setChartData([
        { name: 'Mon', appointments: 45, completed: 40, canceled: 5 },
        { name: 'Tue', appointments: 52, completed: 48, canceled: 4 },
        { name: 'Wed', appointments: 48, completed: 45, canceled: 3 },
        { name: 'Thu', appointments: 61, completed: 55, canceled: 6 },
        { name: 'Fri', appointments: 55, completed: 50, canceled: 5 },
        { name: 'Sat', appointments: 40, completed: 38, canceled: 2 },
        { name: 'Sun', appointments: 30, completed: 28, canceled: 2 }
      ])
    } else {
      // Monthly data
      setChartData([
        { name: 'Week 1', appointments: 245, completed: 220, canceled: 25 },
        { name: 'Week 2', appointments: 280, completed: 260, canceled: 20 },
        { name: 'Week 3', appointments: 310, completed: 290, canceled: 20 },
        { name: 'Week 4', appointments: 290, completed: 270, canceled: 20 }
      ])
    }
  }, [timeRange])

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            color: '#F9FAFB',
            border: 'none',
            borderRadius: '8px',
            padding: '8px'
          }} 
        />
        <Legend />
        <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Appointments" />
        <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
        <Line type="monotone" dataKey="canceled" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} name="Canceled" />
      </LineChart>
    </ResponsiveContainer>
  )

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            color: '#F9FAFB',
            border: 'none',
            borderRadius: '8px',
            padding: '8px'
          }} 
        />
        <Legend />
        <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Appointments" />
        <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" />
        <Bar dataKey="canceled" fill="#EF4444" radius={[4, 4, 0, 0]} name="Canceled" />
      </BarChart>
    </ResponsiveContainer>
  )

  const renderAreaChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis dataKey="name" stroke="#6B7280" />
        <YAxis stroke="#6B7280" />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            color: '#F9FAFB',
            border: 'none',
            borderRadius: '8px',
            padding: '8px'
          }} 
        />
        <Legend />
        <Area type="monotone" dataKey="appointments" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} name="Appointments" />
        <Area type="monotone" dataKey="completed" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Completed" />
        <Area type="monotone" dataKey="canceled" stackId="3" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="Canceled" />
      </AreaChart>
    </ResponsiveContainer>
  )

  const renderPieChart = () => {
    // Calculate totals for pie chart based on time range
    let pieData = []
    
    if (timeRange === 'day') {
      pieData = [
        { name: 'Completed', value: 157, color: '#10B981' },
        { name: 'In Progress', value: 28, color: '#3B82F6' },
        { name: 'Waiting', value: 35, color: '#F59E0B' },
        { name: 'Cancelled', value: 20, color: '#EF4444' }
      ]
    } else if (timeRange === 'week') {
      pieData = [
        { name: 'Completed', value: 331, color: '#10B981' },
        { name: 'In Progress', value: 85, color: '#3B82F6' },
        { name: 'Waiting', value: 92, color: '#F59E0B' },
        { name: 'Cancelled', value: 27, color: '#EF4444' }
      ]
    } else {
      pieData = [
        { name: 'Completed', value: 1040, color: '#10B981' },
        { name: 'In Progress', value: 210, color: '#3B82F6' },
        { name: 'Waiting', value: 245, color: '#F59E0B' },
        { name: 'Cancelled', value: 85, color: '#EF4444' }
      ]
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`${value} patients`, 'Count']}
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              color: '#F9FAFB',
              border: 'none',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  // System Health Component
  const renderSystemHealth = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Server Status</span>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Healthy</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">All systems operational</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Database Load</span>
            <span className="text-xs font-medium text-blue-600">23%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">512MB / 2.2GB used</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">API Response</span>
            <span className="text-xs font-medium text-purple-600">124ms</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full" style={{ width: '12%' }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">Average response time</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h5 className="text-sm font-medium text-gray-700 mb-3">System Metrics</h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500">Uptime</p>
            <p className="text-lg font-semibold text-gray-900">99.9%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Memory</p>
            <p className="text-lg font-semibold text-gray-900">512 MB</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Requests</p>
            <p className="text-lg font-semibold text-gray-900">1.2k/day</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Errors</p>
            <p className="text-lg font-semibold text-gray-900">0.1%</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow p-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Appointment Analytics</h3>
        
        <div className="flex flex-wrap gap-2">
          {/* Time Range Selector */}
          <div className="flex mr-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setTimeRange('day')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                timeRange === 'day' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                timeRange === 'week' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                timeRange === 'month' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              This Month
            </button>
          </div>

          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                chartType === 'line' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                chartType === 'bar' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Bar
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                chartType === 'area' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                chartType === 'pie' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pie
            </button>
          </div>

          {/* Peak Hours / System Health Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('peak')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                activeTab === 'peak' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Peak Hours
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`px-3 py-1 text-sm rounded-lg transition ${
                activeTab === 'system' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              System Health
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Total Appointments</p>
          <p className="text-xl font-bold text-blue-600">
            {timeRange === 'day' ? '157' : timeRange === 'week' ? '535' : '1580'}
          </p>
          <p className="text-xs text-green-600">↑ 12% vs last {timeRange}</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Completed</p>
          <p className="text-xl font-bold text-green-600">
            {timeRange === 'day' ? '128' : timeRange === 'week' ? '451' : '1310'}
          </p>
          <p className="text-xs text-green-600">↑ 8% vs last {timeRange}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">In Progress</p>
          <p className="text-xl font-bold text-yellow-600">
            {timeRange === 'day' ? '18' : timeRange === 'week' ? '52' : '165'}
          </p>
          <p className="text-xs text-gray-600">Active now</p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-xs text-gray-600">Canceled</p>
          <p className="text-xl font-bold text-red-600">
            {timeRange === 'day' ? '11' : timeRange === 'week' ? '32' : '105'}
          </p>
          <p className="text-xs text-red-600">↓ 5% vs last {timeRange}</p>
        </div>
      </div>

      {/* Main Chart */}
      {chartType === 'line' && renderLineChart()}
      {chartType === 'bar' && renderBarChart()}
      {chartType === 'area' && renderAreaChart()}
      {chartType === 'pie' && renderPieChart()}

      {/* Dynamic Section - Either Peak Hours OR System Health */}
      <div className="mt-8">
        {activeTab === 'peak' ? (
          /* PEAK HOURS CARD - SINGLE CLEAN VERSION */
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Peak Hours Analysis
              </h4>
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                {timeRange === 'day' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Peak Hour</p>
                <p className="text-xl font-bold text-purple-600">
                  {timeRange === 'day' ? '3:00 PM' : timeRange === 'week' ? '3-4 PM' : '10-11 AM'}
                </p>
                <p className="text-sm text-gray-600">
                  {timeRange === 'day' ? '25 patients' : timeRange === 'week' ? '55 patients' : '210 patients'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Busiest Day</p>
                <p className="text-xl font-bold text-blue-600">
                  {timeRange === 'day' ? 'Friday' : timeRange === 'week' ? 'Thursday' : 'Week 3'}
                </p>
                <p className="text-sm text-gray-600">
                  {timeRange === 'day' ? '145 patients' : timeRange === 'week' ? '61 patients' : '310 patients'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Slowest Hour</p>
                <p className="text-xl font-bold text-green-600">
                  {timeRange === 'day' ? '1:00 PM' : timeRange === 'week' ? '1-2 PM' : '12-2 PM'}
                </p>
                <p className="text-sm text-gray-600">
                  {timeRange === 'day' ? '8 patients' : timeRange === 'week' ? '22 patients' : '85 patients'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Recommendation</p>
                <p className="text-base font-bold text-yellow-600">Add Staff 3-4 PM</p>
                <p className="text-xs text-gray-600">Peak hours need +2 staff</p>
              </div>
            </div>

            {/* Mini Peak Hours Bar Chart */}
            <div className="mt-4 pt-4 border-t border-purple-100">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>8 AM</span>
                <span>10 AM</span>
                <span>12 PM</span>
                <span>2 PM</span>
                <span>4 PM</span>
                <span>6 PM</span>
              </div>
              <div className="flex gap-1 h-16 items-end">
                <div className="flex-1 bg-purple-200 rounded-t-md" style={{ height: '40%' }}></div>
                <div className="flex-1 bg-purple-300 rounded-t-md" style={{ height: '60%' }}></div>
                <div className="flex-1 bg-purple-400 rounded-t-md" style={{ height: '80%' }}></div>
                <div className="flex-1 bg-purple-500 rounded-t-md" style={{ height: '100%' }}></div>
                <div className="flex-1 bg-purple-400 rounded-t-md" style={{ height: '75%' }}></div>
                <div className="flex-1 bg-purple-300 rounded-t-md" style={{ height: '45%' }}></div>
                <div className="flex-1 bg-purple-200 rounded-t-md" style={{ height: '30%' }}></div>
                <div className="flex-1 bg-purple-100 rounded-t-md" style={{ height: '20%' }}></div>
              </div>
            </div>
          </div>
        ) : (
          /* SYSTEM HEALTH CARD */
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
            <h4 className="text-md font-semibold text-gray-800 flex items-center mb-4">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              System Health
            </h4>
            {renderSystemHealth()}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AppointmentsChart