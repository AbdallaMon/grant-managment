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
    console.log(payments, "pa")
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