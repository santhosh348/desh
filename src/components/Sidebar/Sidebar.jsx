import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography,
  Box
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Sync as SyncIcon,
  FileDownload as ExportIcon,
  Info as DetailsIcon,
  BarChart as ReportIcon
} from '@mui/icons-material';

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#1a237e',
          color: 'white',
        },
      }}
    >
      <Box sx={{ padding: '16px 0' }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            pl: 3, 
            pt: 2, 
            pb: 1,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          Orders
        </Typography>
        <List>
          <ListItem button sx={{ py: '6px' }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <DashboardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItem>
          <ListItem button sx={{ py: '6px' }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <SyncIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Sync Orders" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItem>
          <ListItem button sx={{ py: '6px' }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <ExportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Export Orders" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItem>
          <ListItem button sx={{ py: '6px' }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <DetailsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Order Details" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItem>
        </List>
      </Box>

      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.12)' }} />

      <Box sx={{ padding: '16px 0' }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            pl: 3, 
            pt: 2, 
            pb: 1,
            color: 'rgba(255,255,255,0.7)',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px'
          }}
        >
          Analytics
        </Typography>
        <List>
          <ListItem button sx={{ py: '6px' }}>
            <ListItemIcon sx={{ color: 'white', minWidth: '40px' }}>
              <ReportIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText 
              primary="Reports" 
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;