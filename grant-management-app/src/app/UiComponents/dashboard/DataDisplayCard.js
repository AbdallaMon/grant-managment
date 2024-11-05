import React from 'react';
import {Card, CardContent, Typography, CircularProgress, useTheme} from '@mui/material';

const DataDisplayCard = ({label, data, loading}) => {
    const theme = useTheme()
    return (
          <Card sx={{
              position: 'relative',
              minHeight: '300px',
              backgroundColor: theme.palette.background.default,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: {xs: 2, md: 4}, width: "100%"
          }}>
              <CardContent sx={{textAlign: 'center'}}>
                  <Typography variant="h6" gutterBottom>
                      {label}
                  </Typography>
                  {loading ? (
                        <CircularProgress/>
                  ) : (
                        <Typography variant="h4" component="div">
                            {data !== null && data !== undefined ? data : 'لا توجد بيانات'}
                        </Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default DataDisplayCard;
