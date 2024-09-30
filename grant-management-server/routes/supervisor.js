import prisma from '../prisma/prisma.js';

const PayEveryType = {
    1: "ONE_MONTHS",
    2: "TWO_MONTHS",
    3: "THREE_MONTHS",
    4: "FOUR_MONTHS",
    6: "SIX_MONTHS",
    12: "ONE_YEAR",
};

export async function getUserGrants(appId) {
    return await prisma.userGrant.findMany({
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
}

export async function createUserGrant(body, appId) {
    const {userId, payments, grantId, startDate, endDate, payEvery, totalAmounts, totalAmountLeft} = body
    const userGrant = await prisma.userGrant.create({
        data: {
            userId: Number(userId),
            grantId: Number(grantId),
            applicationId: Number(appId),
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