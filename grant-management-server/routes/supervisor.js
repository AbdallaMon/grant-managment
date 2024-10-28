import {Router} from "express";
import {verifyTokenAndHandleAuthorization} from "../services/utility.js";

const router = Router();
router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next, "SUPERVISOR");
});
// Backend Endpoint: /dashboard/supervisor/payments-overview
router.get('/dashboard/payments-overview', async (req, res) => {
    try {
        const supervisorId = req.user.id; // Get the supervisor's ID from the authenticated user

        // Get pending payments for the current month related to the supervisor
        const startOfMonth = new Date(new Date().setDate(1));
        const endOfMonth = new Date(
              new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
        );

        const paymentsOverview = await prisma.payment.findMany({
            where: {
                status: 'PENDING',
                dueDate: {
                    gte: startOfMonth,
                    lt: endOfMonth,
                },
                userGrant: {
                    supervisorId: supervisorId,
                },
            },
            orderBy: {
                dueDate: 'asc', // Sort by dueDate in ascending order (old to new)
            },
            select: {
                id: true,
                amount: true,
                dueDate: true,
            },
        });

        res.json(paymentsOverview);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /dashboard/supervisor/students
router.get('/dashboard/students', async (req, res) => {
    try {
        const supervisorId = req.user.id;
        // Count all students associated with the supervisor through user grants
        const totalStudents = await prisma.user.count({
            where: {
                role: "STUDENT",
                applications: {
                    some: {
                        supervisorId: supervisorId,
                        status: "APPROVED"
                    },
                },
            },
        });

        res.json({totalStudents});
    } catch (error) {
        console.log(error, "er");
        res.status(500).json({error: error.message});
    }
});

// Backend Endpoint: /dashboard/supervisor/applications-stats
router.get('/dashboard/applications-stats', async (req, res) => {
    try {
        const supervisorId = req.user.id;

        const totalApplications = await prisma.application.count({
            where: {
                status: {
                    not: 'DRAFT',
                },
                student: {
                    userGrants: {
                        some: {
                            supervisorId: supervisorId,
                        },
                    },
                },
            },
        });

        const applicationsByStatus = await prisma.application.groupBy({
            by: ['status'],
            where: {
                status: {
                    not: 'DRAFT',
                },
                student: {
                    userGrants: {
                        some: {
                            supervisorId: supervisorId,
                        },
                    },
                },
            },
            _count: true,
        });

        res.json({totalApplications, applicationsByStatus});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /dashboard/supervisor/payments-stats
router.get('/dashboard/payments-stats', async (req, res) => {
    try {
        const supervisorId = req.user.id;

        // Total amount due (all payments under supervisor)
        const totalAmountResult = await prisma.payment.aggregate({
            _sum: {amount: true},
            where: {
                userGrant: {
                    supervisorId: supervisorId,
                },
            },
        });

        const totalAmount = totalAmountResult._sum.amount || 0;

        const totalAmountPaidResult = await prisma.invoice.aggregate({
            _sum: {amount: true},
            where: {
                payment: {
                    userGrant: {
                        supervisorId: supervisorId,
                    }
                },
            },
        });

        const totalAmountPaid = totalAmountPaidResult._sum.amount || 0;
        res.json({totalAmount, totalAmountPaid});
    } catch (error) {
        console.log(error)
        res.status(500).json({error: error.message});
    }
});


export default router;
