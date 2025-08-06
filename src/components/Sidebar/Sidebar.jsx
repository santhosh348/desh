import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Typography,
  Box,
  IconButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Sync as SyncIcon,
  FileDownload as ExportIcon,
  Info as DetailsIcon,
  BarChart as ReportIcon,
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const Sidebar = () => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === 'light' ? {
        primary: { main: '#1976d2' },
        background: {
          default: '#ffffff',
          paper: '#f5f5f5',
        },
        text: {
          primary: '#000000',
          secondary: 'rgba(0,0,0,0.7)',
        },
      } : {
        primary: { main: '#90caf9' },
        background: {
          default: '#1a237e',
          paper: '#1a237e',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255,255,255,0.7)',
        },
      }),
    },
  });

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          },
        }}
      >
        <Box sx={{ padding: '16px' }}>
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            style={{ 
              width: '100px',
              height: 'auto',
              display: 'block',
              marginBottom: '16px'
            }} 
            onError={(e) => console.error('Logo failed to load:', e.target.src)}
          />
        </Box>
        
        <Box sx={{ padding: '16px 0' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              pl: 3, 
              pt: 2, 
              pb: 1,
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            Orders
          </Typography>
          <List>
            <ListItem button sx={{ py: '6px' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: '40px' }}>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Dashboard" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItem>
            <ListItem button sx={{ py: '6px' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: '40px' }}>
                <SyncIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Sync Orders" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItem>
            <ListItem button sx={{ py: '6px' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: '40px' }}>
                <ExportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Export Orders" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItem>
            <ListItem button sx={{ py: '6px' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: '40px' }}>
                <DetailsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Order Details" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ backgroundColor: theme.palette.divider }} />

        <Box sx={{ padding: '16px 0' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              pl: 3, 
              pt: 2, 
              pb: 1,
              color: theme.palette.text.secondary,
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.5px'
            }}
          >
            Analytics
          </Typography>
          <List>
            <ListItem button sx={{ py: '6px' }}>
              <ListItemIcon sx={{ color: theme.palette.text.primary, minWidth: '40px' }}>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText 
                primary="Reports" 
                primaryTypographyProps={{ fontSize: '0.875rem' }}
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ padding: '16px' }}>
          <IconButton
            onClick={toggleTheme}
            sx={{ color: theme.palette.text.primary }}
            aria-label="Toggle theme"
          >
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Sidebar;
