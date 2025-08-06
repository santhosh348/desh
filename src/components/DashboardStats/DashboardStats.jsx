import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  Equalizer as AvgOrderIcon,
  CalendarToday as CalendarIcon,
  BarChart as ChartIcon,
  TrendingUp,
  TrendingDown,
  Refresh,
  InfoOutlined,
  People as PeopleIcon,
  Store as StoreIcon,
  LocalShipping as ShippingIcon,
  Assessment as AssessmentIcon,
  AccountCircle,
  ShoppingBag,
  Payment,
  Inventory
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import axios from 'axios';
import { formatCurrency } from '../../utils/utils';

const buildApiUrl = (endpoint) => {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-backend-bmyp.onrender.com/api').replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  return `${baseUrl}/${normalizedEndpoint}`;
};

// Enhanced StatCard with glassmorphism and animations
const StatCard = ({ icon, title, value, loading, gradient, iconColor, trend, trendValue, subtitle }) => (
  <Card 
    sx={{
      background: `linear-gradient(135deg, ${gradient})`,
      borderRadius: 3,
      overflow: 'hidden',
      position: 'relative',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        transform: 'translateY(-8px) scale(1.02)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.07)',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${iconColor}, transparent)`,
      }
    }}
    elevation={0}
  >
    <CardContent sx={{ p: 3, position: 'relative' }}>
      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
        <Box 
          sx={{
            backgroundColor: iconColor,
            borderRadius: '16px',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 16px ${iconColor}40`,
            background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
          }}
        >
          {React.cloneElement(icon, { 
            fontSize: 'large', 
            sx: { color: 'white' } 
          })}
        </Box>
        {trend && (
          <Chip 
            icon={trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
            label={trendValue}
            size="small"
            sx={{
              backgroundColor: trend === 'up' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
              color: trend === 'up' ? '#4caf50' : '#f44336',
              fontWeight: 'bold',
              border: `1px solid ${trend === 'up' ? '#4caf50' : '#f44336'}20`,
              '& .MuiChip-icon': {
                color: trend === 'up' ? '#4caf50' : '#f44336',
              }
            }}
          />
        )}
      </Box>
      
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(255, 255, 255, 0.7)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 1.2,
          mb: 1
        }}
      >
        {title}
      </Typography>
      
      {loading ? (
        <Box display="flex" alignItems="center" mt={2}>
          <CircularProgress size={28} sx={{ color: 'white' }} />
        </Box>
      ) : (
        <>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              mb: 0.5
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                fontWeight: 400
              }}
            >
              {subtitle}
            </Typography>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

// Enhanced chart component
const SalesChart = ({ data, loading }) => {
  const [chartType, setChartType] = useState('area');

  const chartData = data?.monthlyTotals?.map(item => ({
    name: `${item.month.substring(0, 3)} ${item.year}`,
    revenue: item.total,
    orders: Math.floor(item.total / 150), // Mock orders data
  })) || [];

  const renderChart = () => {
    switch(chartType) {
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Bar dataKey="revenue" fill="#4fc3f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4fc3f7" 
              strokeWidth={3}
              dot={{ fill: '#4fc3f7', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );
      default:
        return (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4fc3f7" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4fc3f7" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
            <YAxis stroke="rgba(255,255,255,0.7)" />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#4fc3f7" 
              fillOpacity={1} 
              fill="url(#colorRevenue)" 
            />
          </AreaChart>
        );
    }
  };

  return (
    <Card 
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
      elevation={0}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <AssessmentIcon sx={{ color: 'white', mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Revenue Analytics
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              sx={{
                color: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value="area">Area</MenuItem>
              <MenuItem value="line">Line</MenuItem>
              <MenuItem value="bar">Bar</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        ) : (
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer>
              {renderChart()}
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced status distribution with pie chart
const StatusDistribution = ({ data, loading }) => {
  const statusColors = {
    'pending': '#ff9800',
    'processing': '#2196f3',
    'shipped': '#9c27b0',
    'delivered': '#4caf50',
    'cancelled': '#f44336',
    'completed': '#4caf50',
    'failed': '#f44336'
  };

  const chartData = data?.statusCounts?.map(status => ({
    name: status.id,
    value: status.count,
    color: statusColors[status.id.toLowerCase()] || '#757575'
  })) || [];

  const totalOrders = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card 
      sx={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
      elevation={0}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Box display="flex" alignItems="center">
            <ChartIcon sx={{ color: 'white', mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Order Status
            </Typography>
          </Box>
          <Chip 
            label={`${totalOrders} Total`}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={300}>
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mt: 2 }}>
                {chartData.map((status, index) => {
                  const percentage = totalOrders > 0 ? (status.value / totalOrders) * 100 : 0;
                  
                  return (
                    <Box key={index} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center">
                          <Box 
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: status.color,
                              mr: 1.5,
                              boxShadow: `0 0 8px ${status.color}80`
                            }}
                          />
                          <Typography sx={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, textTransform: 'capitalize' }}>
                            {status.name}
                          </Typography>
                        </Box>
                        <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                          {status.value}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={percentage} 
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.2)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: status.color,
                            borderRadius: 3,
                          }
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          float: 'right',
                          mt: 0.5
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};

// Recent activity component
const RecentActivity = ({ loading }) => {
  const activities = [
    { id: 1, type: 'order', message: 'New order #365432', time: '2 min ago', avatar: <ShoppingBag />, color: '#4caf50' },
    { id: 2, type: 'payment', message: 'Payment received $2,400', time: '5 min ago', avatar: <Payment />, color: '#2196f3' },
    { id: 3, type: 'inventory', message: 'Low stock alert - iPhone 14', time: '10 min ago', avatar: <Inventory />, color: '#ff9800' },
    { id: 4, type: 'customer', message: 'New customer registration', time: '15 min ago', avatar: <AccountCircle />, color: '#9c27b0' },
    { id: 5, type: 'shipping', message: 'Order #365431 shipped', time: '20 min ago', avatar: <ShippingIcon />, color: '#4fc3f7' },
  ];

  return (
    <Card 
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      }}
      elevation={0}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600, mb: 3 }}>
          Recent Activity
        </Typography>
        
        {loading ? (
          <Box display="flex" justifyContent="center">
            <CircularProgress size={32} sx={{ color: 'white' }} />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        backgroundColor: activity.color,
                        width: 40,
                        height: 40
                      }}
                    >
                      {activity.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: 'white', fontWeight: 500 }}>
                        {activity.message}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        {activity.time}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < activities.length - 1 && (
                  <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const response = await axios.get(buildApiUrl('orders/stats'));
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Enhanced Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                Dashboard Overview
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.8 }}>
                Real-time insights into your business performance
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.3)',
                    },
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                  }}
                >
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                  <MenuItem value="quarter">This Quarter</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                </Select>
              </FormControl>
              <Tooltip title="Refresh Data">
                <IconButton 
                  onClick={fetchStats}
                  disabled={statsLoading}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                  }}
                >
                  <Refresh sx={{ 
                    animation: statsLoading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Stats */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<OrdersIcon />}
            title="Total Orders"
            value={stats?.totalOrders?.toLocaleString() || 'N/A'}
            loading={statsLoading}
            gradient="rgba(33, 150, 243, 0.9) 0%, rgba(21, 101, 192, 0.9) 100%"
            iconColor="#1976d2"
            trend="up"
            trendValue="+12.5%"
            subtitle="vs last month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<RevenueIcon />}
            title="Total Revenue"
            value={stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : 'N/A'}
            loading={statsLoading}
            gradient="rgba(76, 175, 80, 0.9) 0%, rgba(56, 142, 60, 0.9) 100%"
            iconColor="#4caf50"
            trend="up"
            trendValue="+8.2%"
            subtitle="vs last month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<AvgOrderIcon />}
            title="Avg. Order Value"
            value={stats?.avgOrderValue ? formatCurrency(stats.avgOrderValue) : 'N/A'}
            loading={statsLoading}
            gradient="rgba(255, 152, 0, 0.9) 0%, rgba(245, 124, 0, 0.9) 100%"
            iconColor="#ff9800"
            trend="up"
            trendValue="+3.1%"
            subtitle="vs last month"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            icon={<PeopleIcon />}
            title="Active Users"
            value="3,264"
            loading={statsLoading}
            gradient="rgba(156, 39, 176, 0.9) 0%, rgba(123, 31, 162, 0.9) 100%"
            iconColor="#9c27b0"
            trend="up"
            trendValue="+15.3%"
            subtitle="this week"
          />
        </Grid>

        {/* Charts Row */}
        <Grid item xs={12} lg={8}>
          <SalesChart data={stats} loading={statsLoading} />
        </Grid>

        <Grid item xs={12} lg={4}>
          <StatusDistribution data={stats} loading={statsLoading} />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <RecentActivity loading={statsLoading} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;