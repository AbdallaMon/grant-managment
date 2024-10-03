import express from 'express';
import {
    searchData,
    getNotifications,
    getPagination,
    handlePrismaError,
    markLatestNotificationsAsRead,
    markLatestNotificationsAsReadForAdmin,
    verifyTokenUsingReq,
} from '../services/utility.js';

import prisma from '../prisma/prisma.js';

const router = express.Router();

// Search Route
router.get('/search', verifyTokenUsingReq, async (req, res) => {
    const searchBody = req.query;
    try {
        const data = await searchData(searchBody);
        res.status(200).json({data});
    } catch (error) {
        console.error(`Error fetching data:`, error);
        res.status(500).json({message: `حدثت مشكلة اثناء جلب البيانات: ${error.message}`});
    }
});


// Notifications
router.get('/notification', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);
    try {
        const {notifications, total} = await getNotifications(searchParams, limit, skip, false);
        const totalPages = Math.ceil(total / limit);

        if (!notifications) {
            return res.status(404).json({message: 'لا يوجد اشعارات'});
        }
        res.status(200).json({data: notifications, totalPages, total});
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب الاشعارات'});
    }
});

router.get('/notification/unread', async (req, res) => {
    const searchParams = req.query;
    const {limit = 9, skip = 1} = getPagination(req);
    try {
        const {notifications, total} = await getNotifications(searchParams, limit, skip, true);
        const totalPages = Math.ceil(total / limit);

        if (!notifications) {
            return res.status(404).json({message: 'لا يوجد اشعارات'});
        }
        res.status(200).json({data: notifications, totalPages, total});
    } catch (error) {
        console.error('Error fetching unread notifications:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب الاشعارات'});
    }
});

router.post('/notification/users/:userId', async (req, res) => {
    const {userId} = req.params;
    try {
        await markLatestNotificationsAsRead(userId);
        res.status(200).json({message: 'تم تحديث حالة الاشعارات بنجاح'});
    } catch (error) {
        handlePrismaError(res, error);
    }
});

router.post('/notification/admins/:userId', async (req, res) => {
    const {userId} = req.params;
    try {
        await markLatestNotificationsAsReadForAdmin(userId);
        res.status(200).json({message: 'تم تحديث حالة الاشعارات بنجاح'});
    } catch (error) {
        handlePrismaError(res, error);
    }
});

// Messages
router.get('/messages/last-messages', verifyTokenUsingReq, async (req, res) => {
    const userId = req.user.id;

    try {
        const lastMessages = await prisma.directMessage.findMany({
            where: {
                receiverId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            distinct: ['senderId'],
            include: {
                sender: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                        personalInfo: {
                            select: {
                                basicInfo: {
                                    select: {
                                        name: true,
                                        fatherName: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        res.status(200).json({data: lastMessages});
    } catch (error) {
        console.error('Error fetching last messages:', error);
        res.status(500).json({message: 'Error fetching last messages'});
    }
});

router.get('/chat/allowed-users', verifyTokenUsingReq, async (req, res) => {
    const {id: userId, role} = req.user;
    try {
        if (role === 'STUDENT') {
            const supervisors = await prisma.user.findMany({
                where: {
                    role: 'SUPERVISOR',
                    superVisorGrants: {
                        some: {
                            userId: +userId,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true,
                                    fatherName: true,
                                },
                            },
                        },
                    },
                },
            });
            res.status(200).json({success: true, data: supervisors});
        } else if (role === 'SUPERVISOR') {
            const admins = await prisma.user.findMany({
                where: {role: 'ADMIN'},
                select: {
                    id: true,
                    email: true,
                    role: true,

                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true,
                                    fatherName: true,
                                },
                            },
                        },
                    },
                },
            });
            const students = await prisma.user.findMany({
                where: {
                    role: 'STUDENT',
                    userGrants: {
                        some: {
                            supervisorId: +userId,
                        },
                    },
                },
                select: {
                    id: true,
                    email: true,
                    role: true,

                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true,
                                    fatherName: true,
                                },
                            },
                        },
                    },
                },
            });

            res.status(200).json({success: true, data: [...admins, ...students]});
        } else if (role === 'ADMIN') {
            const supervisors = await prisma.user.findMany({
                where: {role: 'SUPERVISOR'},
                select: {
                    id: true,
                    email: true,
                    role: true,

                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true,
                                    fatherName: true,
                                },
                            },
                        },
                    },
                },
            });

            res.status(200).json({success: true, data: supervisors});
        } else {
            res.status(403).json({message: 'You do not have access to this resource.'});
        }
    } catch (error) {
        handlePrismaError(res, error);
    }
});

router.get('/messages/:userId', verifyTokenUsingReq, async (req, res) => {
    const {userId: otherUserId} = req.params;
    const userId = req.user.id;
    const {page = 1, limit = 50} = req.query;

    const skip = (page - 1) * limit;

    try {
        const messages = await prisma.directMessage.findMany({
            where: {
                OR: [
                    {senderId: +userId, receiverId: +otherUserId},
                    {senderId: +otherUserId, receiverId: +userId},
                ],
            },
            orderBy: {createdAt: 'desc'},
            skip: Number(skip),
            take: Number(limit),
        });

        res.status(200).json({success: true, data: messages});
    } catch (error) {
        handlePrismaError(res, error);
    }
});

router.post('/messages/mark-as-delivered', verifyTokenUsingReq, async (req, res) => {
    const userId = req.user.id;

    try {
        await prisma.directMessage.updateMany({
            where: {
                receiverId: userId,
                status: 'SENT',
            },
            data: {
                status: 'DELIVERED',
            },
        });

        res.status(200).json({message: 'Messages marked as delivered'});
    } catch (error) {
        console.error('Error marking messages as delivered:', error);
        res.status(500).json({message: 'Error marking messages as delivered'});
    }
});

export default router;
