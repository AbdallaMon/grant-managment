import {Router} from "express";
import {getPagination, verifyTokenAndHandleAuthorization} from "../services/utility.js";
import {getUser} from "../services/adminServices.js";
import {getPersonalInfo} from "../services/studentsServices.js";

const router = Router();

router.use((req, res, next) => {
    verifyTokenAndHandleAuthorization(req, res, next, "OTHER");
});


router.get('/students', async (req, res) => {
    const searchParams = req.query;
    const {limit, skip} = getPagination(req);

    try {
        const {users, total} = await getUser(searchParams, limit, skip);
        const totalPages = Math.ceil(total / limit);

        if (!users) {
            return res.status(404).json({message: 'لا يوجد طلاب'});
        }
        res.status(200).json({data: users, totalPages, total});
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطلاب'});
    }
});

router.get('/students/:studentId', async (req, res) => {
    const {studentId} = req.params
    try {
        if (!studentId) {
            return res.status(404).json({message: 'لا يوجد طالب بهذا المعرف'});
        }
        const studentPersonalInfo = await getPersonalInfo(studentId)
        res.status(200).json({data: studentPersonalInfo});
    } catch (error) {
        console.error('Error fetching personal info:', error);
        res.status(500).json({message: 'حدث خطأ أثناء جلب  الطالب'});
    }
})

// Backend Endpoint: /sponsor/dashboard/students
router.get('/dashboard/students', async (req, res) => {
    try {
        const sponsorId = req.user.id;

        // Fetch grants where the sponsor has view access
        const grants = await prisma.grant.findMany({
            where: {
                viewAccessUsers: {
                    some: {
                        id: sponsorId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        const grantIds = grants.map((grant) => grant.id);

        // Fetch students associated with these grants
        const students = await prisma.user.findMany({
            where: {
                role: 'STUDENT',
                userGrants: {
                    some: {
                        grantId: {
                            in: grantIds,
                        },
                    },
                },
            },
            select: {
                id: true,
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
            distinct: ['id'],
        });

        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /sponsor/dashboard/grants-stats
router.get('/dashboard/grants-stats', async (req, res) => {
    try {
        const sponsorId = req.user.id;

        // Fetch grants where the sponsor has view access
        const grants = await prisma.grant.findMany({
            where: {
                viewAccessUsers: {
                    some: {
                        id: sponsorId,
                    },
                },
            },
            select: {
                id: true,
                amount: true,
                amountLeft: true,
            },
        });

        // Accumulate total amount and amountLeft
        const totalGrantAmount = grants.reduce((sum, grant) => sum + grant.amount, 0);
        const totalAmountLeft = grants.reduce((sum, grant) => sum + grant.amountLeft, 0);

        res.json({totalGrantAmount, totalAmountLeft});
    } catch (error) {
        console.error('Error fetching grants stats:', error);
        res.status(500).json({error: error.message});
    }
});

// Backend Endpoint: /sponsor/dashboard/next-payments
router.get('/dashboard/next-payments', async (req, res) => {
    try {
        const sponsorId = req.user.id;

        // Fetch grants where the sponsor has view access
        const grants = await prisma.grant.findMany({
            where: {
                viewAccessUsers: {
                    some: {
                        id: sponsorId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        const grantIds = grants.map((grant) => grant.id);

        // Fetch payments for students related to these grants
        const payments = await prisma.payment.findMany({
            where: {
                userGrant: {
                    grantId: {
                        in: grantIds,
                    },
                },
                status: 'PENDING',
            },
            orderBy: {
                dueDate: 'asc',
            },
            take: 4,
            select: {
                id: true,
                amount: true,
                dueDate: true,
                userGrant: {
                    select: {
                        user: {
                            select: {
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
                },
            },
        });

        res.json(payments);
    } catch (error) {
        console.error('Error fetching next payments:', error);
        res.status(500).json({error: error.message});
    }
});
// Backend Endpoint: /sponsor/dashboard/recent-invoices
router.get('/dashboard/recent-invoices', async (req, res) => {
    try {
        const sponsorId = req.user.id;

        // Fetch grants where the sponsor has view access
        const grants = await prisma.grant.findMany({
            where: {
                viewAccessUsers: {
                    some: {
                        id: sponsorId,
                    },
                },
            },
            select: {
                id: true,
            },
        });

        const grantIds = grants.map((grant) => grant.id);

        // Fetch invoices related to payments of these grants
        const invoices = await prisma.invoice.findMany({
            where: {
                payment: {
                    userGrant: {
                        grantId: {
                            in: grantIds,
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
            select: {
                id: true,
                amount: true,
                createdAt: true,
                payment: {
                    select: {
                        userGrant: {
                            select: {
                                user: {
                                    select: {
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
                        },
                    },
                },
            },
        });

        res.json(invoices);
    } catch (error) {
        console.error('Error fetching recent invoices:', error);
        res.status(500).json({error: error.message});
    }
});

export default router;
