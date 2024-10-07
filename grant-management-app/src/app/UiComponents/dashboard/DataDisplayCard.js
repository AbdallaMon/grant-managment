import React from 'react';
import {Card, CardContent, Typography, CircularProgress} from '@mui/material';

const DataDisplayCard = ({label, data, loading}) => {
    return (
          <Card
                sx={{
                    position: 'relative',
                    minHeight: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
          >
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
