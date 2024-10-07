// components/SponsorStudentsList.js
import React, {useEffect, useState} from 'react';
import {Card, CardContent, Typography, List, ListItem, ListItemText, Divider} from '@mui/material';
import LoadingOverlay from '@/app/UiComponents/feedback/loaders/LoadingOverlay';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';

const SponsorStudentsList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth();

    const fetchStudents = async () => {
        const res = await getData({
            url: `sponsor/dashboard/students`,
            setLoading,
        });

        if (res) {
            setStudents(res);
        }
    };

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user]);

    return (
          <Card sx={{position: 'relative', minHeight: '300px'}}>
              <CardContent>
                  <Typography variant="h6" gutterBottom>
                      {'الطلاب المستفيدون من منحك'}
                  </Typography>
                  {loading ? (
                        <LoadingOverlay/>
                  ) : students.length > 0 ? (
                        <List>
                            {students.map((student) => (
                                  <div key={student.id}>
                                      <ListItem>
                                          <ListItemText
                                                primary={`${student.personalInfo?.basicInfo?.name || 'غير متوفر'} ${
                                                      student.personalInfo?.basicInfo?.fatherName || ''
                                                }`}
                                          />
                                      </ListItem>
                                      <Divider/>
                                  </div>
                            ))}
                        </List>
                  ) : (
                        <Typography>{'لا يوجد طلاب مستفيدون'}</Typography>
                  )}
              </CardContent>
          </Card>
    );
};

export default SponsorStudentsList;
