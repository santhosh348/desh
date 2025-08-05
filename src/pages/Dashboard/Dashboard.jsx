import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  TextField,
  IconButton,
  Tooltip,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Sync as SyncIcon,
  ExpandMore as ExpandMoreIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ShoppingBasket as ProductsIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { saveAs } from 'file-saver';

// Helper function to normalize URLs
const buildApiUrl = (endpoint) => {
  // Get base URL and remove any trailing slashes
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-backend-bmyp.onrender.com/api').replace(/\/+$/, '');
  // Remove leading and trailing slashes from endpoint
  const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
  // Combine with single slash
  return `${baseUrl}/${normalizedEndpoint}`;
};

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const rowsPerPage = 10;

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filtering when orders or search term changes
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredOrders(filtered);
    setPage(1);
  }, [orders, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(buildApiUrl('orders'));
      setOrders(response.data);
    } catch (error) {
      showError('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setDetailLoading(true);
    try {
      const response = await axios.get(buildApiUrl(`orders/${orderId}`));
      setOrderDetails(response.data);
    } catch (error) {
      showError('Failed to fetch order details', error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOrderClick = (orderId) => {
    setSelectedOrder(orderId);
    fetchOrderDetails(orderId);
  };

  const syncAmazonOrders = async () => {
    setSyncing(true);
    try {
      await axios.post(buildApiUrl('orders/sync'));
      showSuccess('✅ Orders fetched and saved from Amazon.');
      setTimeout(fetchOrders, 3000);
    } catch (error) {
      showError('Failed to sync Amazon orders', error);
    } finally {
      setSyncing(false);
    }
  };

  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const showError = (message, error) => {
    setSnackbar({
      open: true,
      message: error.response?.data?.message || message,
      severity: 'error'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setOrderDetails(null);
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'PPpp');
  };

  const calculateOrderTotal = (products) => {
    return products.reduce((total, product) => total + (product.price * product.quantity), 0);
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Date', 'Products', 'Quantity', 'Price', 'Total', 'Shipping Address', 'Payment Method'];
    const csvData = [
      headers.join(','),
      ...filteredOrders.map(order =>
        order.products.map(product => [
          order.order_id,
          formatDate(order.purchase_date),
          `"${product.title.replace(/"/g, '""')}"`,
          product.quantity,
          product.price.toFixed(2),
          calculateOrderTotal(order.products).toFixed(2),
          `"${Object.values(order.shipping_address).join(', ')}"`,
          order.paymentMethod
        ].join(','))
      ).flat()
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `amazon_orders_${new Date().toISOString().slice(0,10)}.csv`);
    showSuccess('Orders exported to CSV successfully!');
  };

  const currentOrders = filteredOrders.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header and Actions */}
      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Amazon Orders Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search orders..."
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 250 }}
          />
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Export to CSV">
              <IconButton onClick={exportToCSV} color="primary">
                <ExportIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              color="primary"
              startIcon={syncing ? <CircularProgress size={20} color="inherit" /> : <SyncIcon />}
              onClick={syncAmazonOrders}
              disabled={syncing}
              sx={{ textTransform: 'none' }}
            >
              {syncing ? 'Syncing...' : 'Sync Orders'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Orders Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, backgroundColor: 'white' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredOrders.length > 0 ? (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Products</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Shipping</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Payment</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }} align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentOrders.map((order) => (
                        <TableRow 
                          key={order.order_id}
                          hover
                          onClick={() => handleOrderClick(order.order_id)}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{order.order_id}</TableCell>
                          <TableCell>{formatDate(order.purchase_date)}</TableCell>
                          <TableCell>
                            <Accordion elevation={0}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ProductsIcon sx={{ mr: 1 }} />
                                  <Typography>{order.products.length} item(s)</Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                {order.products.map((product, index) => (
                                  <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">
                                      {product.brand && <strong>{product.brand}</strong>} {product.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', mt: 1 }}>
                                      <Chip 
                                        label={`ASIN: ${product.asin}`} 
                                        size="small" 
                                        sx={{ mr: 1 }}
                                      />
                                      <Chip 
                                        label={`Qty: ${product.quantity}`} 
                                        size="small" 
                                        sx={{ mr: 1 }}
                                      />
                                      <Chip 
                                        label={`$${product.price.toFixed(2)}`} 
                                        size="small" 
                                        color="primary"
                                      />
                                    </Box>
                                  </Box>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                          <TableCell>
                            <Accordion elevation={0}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <ShippingIcon sx={{ mr: 1 }} />
                                  <Typography>Shipping Info</Typography>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2">
                                  {order.shipping_address.City}, {order.shipping_address.StateOrRegion}
                                </Typography>
                                <Typography variant="body2">
                                  ZIP: {order.shipping_address.PostalCode}
                                </Typography>
                                <Typography variant="body2">
                                  Country: {order.shipping_address.CountryCode}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PaymentIcon sx={{ mr: 1 }} />
                              <Typography>{order.paymentMethod}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            ${calculateOrderTotal(order.products).toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={Math.ceil(filteredOrders.length / rowsPerPage)}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
                {searchTerm ? 'No orders match your search' : 'No orders found. Sync with Amazon to load orders.'}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Order Details Dialog */}
      <Dialog
        open={!!selectedOrder}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Order Details - {selectedOrder}</Typography>
            <IconButton onClick={handleCloseDetails}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {detailLoading ? (
            <Box display="flex" justifyContent="center" p={4}>
              <CircularProgress />
            </Box>
          ) : orderDetails ? (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Order Information
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText 
                        primary="Order ID" 
                        secondary={orderDetails.order_id} 
                      />
                    </ListItem>
                    <Divider />
                    <ListItem>
                      <ListItemText 
                        primary="Order Date" 
                        secondary={formatDate(orderDetails.order_date || orderDetails.purchase_date)} 
                      />
                    </ListItem>
                    <Divider />
                    {orderDetails.customer_name && (
                      <>
                        <ListItem>
                          <ListItemText 
                            primary="Customer" 
                            secondary={orderDetails.customer_name} 
                          />
                        </ListItem>
                        <Divider />
                      </>
                    )}
                    <ListItem>
                      <ListItemText 
                        primary="Payment Method" 
                        secondary={orderDetails.paymentMethod || 'N/A'} 
                      />
                    </ListItem>
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Shipping Information
                  </Typography>
                  {orderDetails.shipping_address ? (
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Address" 
                          secondary={`${orderDetails.shipping_address.City}, ${orderDetails.shipping_address.StateOrRegion}`} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="ZIP Code" 
                          secondary={orderDetails.shipping_address.PostalCode} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="Country" 
                          secondary={orderDetails.shipping_address.CountryCode} 
                        />
                      </ListItem>
                    </List>
                  ) : (
                    <Typography variant="body2">No shipping information available</Typography>
                  )}
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold' }}>
                Order Items
              </Typography>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(orderDetails.items || orderDetails.products || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {item.title || `Product ${item.product_id || item.asin}`}
                          </Typography>
                          {item.brand && <Typography variant="body2">Brand: {item.brand}</Typography>}
                          {item.asin && <Typography variant="body2">ASIN: {item.asin}</Typography>}
                        </TableCell>
                        <TableCell align="right">${item.price?.toFixed(2)}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Typography variant="h6">
                  Order Total: ${calculateOrderTotal(orderDetails.items || orderDetails.products || []).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1">No order details available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;