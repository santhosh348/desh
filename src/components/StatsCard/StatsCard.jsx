import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import './StatsCard.css';

const StatsCard = ({ title, value, percentage, isIncrease }) => {
  return (
    <Card sx={{ minWidth: 200, borderRadius: 2, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="div">
            {value}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              ml: 1,
              color: isIncrease ? 'success.main' : 'error.main',
            }}
          >
            {isIncrease ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {percentage}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatsCard;