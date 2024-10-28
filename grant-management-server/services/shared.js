// payments
import prisma from '../prisma/prisma.js';

export async function getPendingPaymentsByMonth(startOfMonth, endOfMonth, status, userId) {
    const where = {
        dueDate: {
            gte: new Date(startOfMonth),
            lte: new Date(endOfMonth)
        }
    }
    if (userId) {
        where.userGrant = {
            supervisorId: Number(userId)
        }
    }
    if (status) {
        where.status = status
    } else {
        where.status = "PENDING"
    }
    const payments = await prisma.payment.findMany({
        where,
        include: {
            userGrant: {
                select: {
                    id: true,
                    applicationId: true,
                    endDate: true,
                    userId: true,
                    grant: {
                        select: {name: true}
                    },
                    user: {
                        select: {
                            personalInfo: {
                                select: {
                                    basicInfo: {
                                        select: {name: true}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        orderBy: {
            dueDate: 'asc'
        }
    });
    return payments;
}

export async function processPayment(paymentId, amount, paidAt) {
    const payment = await prisma.payment.findUnique({
        where: {id: paymentId},
    });

    if (!payment) {
        throw new Error('Payment not found');
    }

    const pendingAmount = payment.amount - (payment.amountPaid || 0);

    if (amount > pendingAmount) {
        throw new Error(`المبلغ الوارد يتجاوز المبلغ المتبقي. المبلغ المتبقي للدفع هو ${pendingAmount}.`);
    }

    const newAmountPaid = (payment.amountPaid || 0) + amount;
    const isFullyPaid = newAmountPaid >= payment.amount;

    await prisma.payment.update({
        where: {id: payment.id},
        data: {
            amountPaid: newAmountPaid,
            status: isFullyPaid ? 'PAID' : 'PENDING',
            paidAt: isFullyPaid ? paidAt : null,
        },
    });

    const invoice = await prisma.invoice.create({
        data: {
            invoiceNumber: generateInvoiceNumber(),
            paymentId: payment.id,
            dueDate: payment.dueDate,
            amount: amount,
            paidAt: paidAt,
        },
    });
    return {
        ...payment,
        amountPaid: newAmountPaid,
        status: isFullyPaid ? 'PAID' : 'PENDING',
        invoiceNumber: invoice.invoiceNumber,
        invoiceId: invoice.id
    }
}

// Helper function to generate a unique invoice number
function generateInvoiceNumber() {
    return 'INV-' + Date.now(); // Example invoice number generation logic
}

const PayEveryType = {
    1: "ONE_MONTHS",
    2: "TWO_MONTHS",
    3: "THREE_MONTHS",
    4: "FOUR_MONTHS",
    6: "SIX_MONTHS",
    12: "ONE_YEAR",
};

export async function getUserGrants(appId) {
    const grants = await prisma.userGrant.findMany({
        where: {applicationId: Number(appId)},
        include: {
            grant: {
                select: {
                    id: true, name: true
                }
            },
            payments: true,
            user: {
                select: {
                    id: true,
                    email: true,
                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            },
        }
    });
    const application = await prisma.application.findUnique({
        where: {
            id: Number(appId)
        }, select: {
            status: true
        }
    })
    return {application, grants}
}

export async function createUserGrant(body, appId) {
    const {userId, payments, grantId, startDate, endDate, payEvery, totalAmounts, totalAmountLeft} = body
    const application = await prisma.application.findUnique({
        where: {
            id: Number(appId)
        }, select: {
            supervisorId: true
        }
    })
    if (!application.supervisorId) {
        throw new Error("هذة المنحة غير مرتبطه بمشرف يجب تعين مشرف اولا قبل اتخاذ اي اجراء")
    }
    const userGrant = await prisma.userGrant.create({
        data: {
            userId: Number(userId),
            grantId: Number(grantId),
            applicationId: Number(appId),
            supervisorId: application.supervisorId,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalAmounts,
            payEvery: PayEveryType[payEvery],
            payments: {
                create: payments.map(payment => ({
                    dueDate: new Date(payment.dueDate),
                    amount: Number(payment.amount)
                }))
            }
        },
    });
    if (userGrant) {
        await prisma.grant.update({
            where: {id: Number(grantId)}
            , data: {
                amountLeft: +totalAmountLeft - +totalAmounts
            }
        })
    }
    return userGrant
}

