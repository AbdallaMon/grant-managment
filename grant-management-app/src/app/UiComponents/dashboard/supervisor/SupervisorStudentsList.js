import React, {useEffect, useState} from 'react';
import {useAuth} from '@/app/providers/AuthProvider';
import {getData} from '@/app/helpers/functions/getData';
import DataDisplayCard from "@/app/UiComponents/dashboard/DataDisplayCard";

const SupervisorStudentsList = () => {
    const [totalStudents, setTotalStudents] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user} = useAuth();

    const fetchStudents = async () => {
        try {
            const res = await getData({
                url: `supervisor/dashboard/students`,
                setLoading,
            });

            if (res) {
                setTotalStudents(res.totalStudents);
            } else {
                setTotalStudents(0);
            }
        } catch (err) {
            setError('حدث خطأ أثناء تحميل البيانات');
        }
    };

    useEffect(() => {
        if (user) {
            fetchStudents();
        }
    }, [user]);

    return (
          <DataDisplayCard
                label="إجمالي الطلاب"
                data={error ? error : totalStudents}
                loading={loading}
          />
    );
};

export default SupervisorStudentsList;
