import prisma from '../prisma/prisma.js';
import bcrypt from "bcrypt";

// accounts
export async function getUser(searchParams, limit, skip, role = "STUDENT") {
    const filters = JSON.parse(searchParams.filters);
    let where = {role};
    if (searchParams.supervisorId) {
        where.userGrants = {
            some: {
                supervisorId: Number(searchParams.supervisorId)
            }
        }
    }
    if (searchParams.sponsorId) {
        where.userGrants = {
            some: {
                grant: {
                    viewAccessUsers: {
                        some: {
                            id: Number(searchParams.sponsorId),
                        },
                    },
                },
            },
        };
    }
    if (filters.query) {
        where.id = Number(filters.query.id)
    }
    if (role === "OTHER") {
        delete where.role;
        where.OR = [
            {role: "SPONSOR"},
            {role: "INDIVIDUAL"}
        ];
    }
    if (filters.role !== undefined && filters.role !== "all") {
        delete where.OR;
        where.role = filters.role
    }
    if (filters.status !== undefined) {
        if (filters.status === "active") {
            where.isActive = true;
        } else if (filters.status === "banned") {
            where.isActive = false
        }
    }

    if (filters.hasGrant === "withGrant") {
        where.userGrants = {
            some: {},
        };
    } else if (filters.hasGrant === "none") {
        where.userGrants = {
            none: {},
        };
    }

    const users = await prisma.user.findMany({
        where: where,
        skip,
        take: limit,
        select: {
            id: true,
            email: true,
            isActive: true,
            role: true,
            personalInfo: {
                select: {
                    basicInfo: {
                        select: {
                            name: true,
                        },
                    },
                    contactInfo: {
                        select: {
                            phone: true,
                            whatsapp: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    reviewedApps: true,
                    superVisorGrants: true,
                    viewGrants: true,
                },
            },
        },
    });
    const total = await prisma.user.count({where: where});

    return {users, total};
}

export async function createNonStudentUser(user, role) {
    const hashedPassword = bcrypt.hashSync(user.password, 8);

    const newUser = await prisma.user.create({
        data: {
            email: user.email,
            password: hashedPassword,
            role,
            emailConfirmed: true,
            personalInfo: {
                create: {
                    basicInfo: {
                        create: {
                            name: user.name,
                        },
                    },
                    contactInfo: {
                        create: {
                            phone: user.phone,
                            whatsapp: user.whatsapp,
                        },
                    },
                },
            },
        },
        select: {
            personalInfo: {
                select: {
                    basicInfo: {
                        select: {
                            name: true,
                        },
                    },
                    contactInfo: {
                        select: {
                            phone: true,
                            whatsapp: true,
                        },
                    },
                },
            },
            email: true,
            isActive: true,
            role: true,
        },
    });

    return newUser;
}

export async function editNonStudentUser(user, userId) {
    let hashedPassword = undefined
    if (user.password) {
        hashedPassword = bcrypt.hashSync(user.password, 8);
    }
    const newUser = await prisma.user.update({
        where: {id: Number(userId)},
        data: {
            email: user.email && user.email,
            password: hashedPassword && hashedPassword,
            role: user.role && user.role,
            personalInfo: {
                update: {
                    basicInfo: {
                        create: {
                            name: user.name && user.name,
                        },
                    },
                    contactInfo: {
                        update: {
                            phone: user.phone && user.phone,
                            whatsapp: user.whatsapp && user.whatsapp,
                        },
                    },
                },
            },
        },
        select: {
            personalInfo: {
                select: {
                    basicInfo: {
                        select: {
                            name: true,
                        },
                    },
                    contactInfo: {
                        select: {
                            phone: true,
                            whatsapp: true,
                        },
                    },
                },
            },
            id: true,
            email: true,
            isActive: true,
            role: true,

        },
    });
    return newUser;
}

export async function changeUserStatus(user, studentId) {
    return prisma.user.update({
        where: {
            id: Number(studentId)
        },
        data: {
            isActive: !user.isActive
        }
        , select: {
            id: true
        }
    })
}

// grant

export async function getGrantsProjects(searchParams, limit, skip) {
    const filters = JSON.parse(searchParams.filters);
    const where = {}
    if (filters !== "undefined" && filters.type !== "all") {
        where.type = filters.type
    }
    const grants = await prisma.grant.findMany({
        where: where,
        skip,
        take: limit,
        select: {
            id: true,
            name: true,
            type: true,
            amount: true,
            amountLeft: true,
            _count: {
                select: {
                    userGrants: true,
                },
            },
        },
    });
    const total = await prisma.grant.count({where: where});
    return {grants, total};
}

export async function createNewGrantProject(grant) {
    return await prisma.grant.create({
        data: {
            name: grant.name,
            type: grant.type,
            amount: +grant.amount,
            amountLeft: +grant.amount,
        },
        select: {
            id: true,
            name: true,
            type: true,
            amount: true,
            amountLeft: true,
            _count: {
                select: {
                    userGrants: true,
                },
            },
        },
    });
}

export async function editAGrant(grant, grantId) {
    // Fetch the current grant details from the database
    const existingGrant = await prisma.grant.findUnique({
        where: {id: Number(grantId)},
        select: {
            amount: true,
            amountLeft: true,
        },
    });

    if (!existingGrant) {
        throw new Error('المنحة غير موجودة.');
    }
    const {amount: currentAmount, amountLeft: currentAmountLeft} = existingGrant;

    // If the incoming `grant.amount` is provided
    if (grant.amount) {
        const newAmount = +grant.amount;  // New incoming amount

        if (newAmount < currentAmount) {
            const decreaseInAmount = currentAmount - newAmount;

            if (currentAmountLeft < decreaseInAmount) {
                throw new Error(`لا يمكن تقليل المبلغ لأن المبلغ المتبقي هو ${currentAmountLeft} فقط.`);
            }
            const newAmountLeft = currentAmountLeft - decreaseInAmount;
            return await prisma.grant.update({
                where: {id: Number(grantId)},
                data: {
                    name: grant.name && grant.name,
                    type: grant.type && grant.type,
                    amount: newAmount,
                    amountLeft: newAmountLeft,
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    amount: true,
                    amountLeft: true,
                    _count: {
                        select: {
                            userGrants: true,
                        },
                    },
                },
            });
        } else if (newAmount > currentAmount) {
            const increaseInAmount = newAmount - currentAmount;
            const newAmountLeft = currentAmountLeft + increaseInAmount;

            return await prisma.grant.update({
                where: {id: Number(grantId)},
                data: {
                    name: grant.name && grant.name,
                    type: grant.type && grant.type,
                    amount: newAmount,
                    amountLeft: newAmountLeft,
                },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    amount: true,
                    amountLeft: true,
                    _count: {
                        select: {
                            userGrants: true,
                        },
                    },
                },
            });
        }
    }

    return await prisma.grant.update({
        where: {id: Number(grantId)},
        data: {
            name: grant.name,
            type: grant.type,
        },
        select: {
            id: true,
            name: true,
            type: true,
            amount: true,
            amountLeft: true,
            _count: {
                select: {
                    userGrants: true,
                },
            },
        },
    });
}

export async function deleteGrant(grantId) {
    // Check if the grant is related to any userGrant
    const relatedUserGrants = await prisma.userGrant.findFirst({
        where: {
            grantId: Number(grantId),
        },
    });

    if (relatedUserGrants) {
        throw new Error('هناك منح مرتبطه لا يمكن حذف هذا المشروع');
    }
    return await prisma.grant.delete({
        where: {
            id: Number(grantId),
        },
    });
}

// grant access
export async function getUserViewAccessForAGrant(grantId) {
    const where = {id: Number(grantId)}
    const grant = await prisma.grant.findUnique({
        where: where,
        select: {
            id: true,
            name: true,
            amount: true,
            amountLeft: true,
            type: true,
            viewAccessUsers: {
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
            }
        },
    });
    return grant
}

export async function assignUserToViewGrant(grantId, userId) {
    return await prisma.user.update({
        where: {id: Number(userId)},
        data: {
            viewGrants: {
                connect: {id: Number(grantId)}
            }
        },
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
    });

}

export async function removeUserFromViewGrant(grantId, userId) {
    return await prisma.user.update({
        where: {id: Number(userId)},
        data: {
            viewGrants: {
                disconnect: {id: Number(grantId)} // Disconnecting the relation with the grant
            }
        },
        select: {
            id: true,
        }
    });
}

// applications
export async function getApplications(searchParams, limit, skip, status = "PENDING") {
    const filters = JSON.parse(searchParams.filters);
    const where = {status};
    if (searchParams.nogrant === "true") {
        where.userGrants = {
            none: {}
        };
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of the current day

    if (searchParams.activeGrant === "true") {
        where.userGrants = {
            some: {
                endDate: {
                    gte: today // Greater than or equal to today
                }
            }
        };
    }

    // For ended grants (userGrant exists and endDate is less than today)
    if (searchParams.endedGrant === "true") {
        where.userGrants = {
            every: {
                endDate: {
                    lt: today // Less than today
                }
            }
        };
    }

    if (filters !== "undefined" && filters.query) {
        where.studentId = filters.query.id;
    }
    if (searchParams.supervisorId) {
        where.supervisorId = Number(searchParams.supervisorId)
    }
    const orderBy = filters.sort === "new" ? {createdAt: 'desc'} : {createdAt: 'asc'};

    const applications = await prisma.application.findMany({
        where: where,
        skip,
        take: limit,
        orderBy: orderBy,
        include: {
            student: {
                select: {
                    id: true,
                    email: true,
                    personalInfo: {
                        select: {
                            basicInfo: {
                                select: {
                                    name: true
                                }
                            },
                            contactInfo: {
                                select: {
                                    phone: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    const total = await prisma.application.count({where: where});

    return {applications, total}
}

export async function getApplicationById(appId) {
    return await prisma.application.findUnique({
        where: {id: Number(appId)},
        include: {
            scholarshipInfo: true,
            academicPerformance: {
                include: {
                    gradeRecords: true
                }
            },
            residenceInfo: true,
            supportingFiles: true,
            siblings: true,
        }
    })
}

export async function getSpecificApplicationField(appId, field) {
    return await prisma.application.findUnique({
        where: {id: Number(appId)},
        include: {
            [field]: true,
        }
    })
}

export async function approveApplication(appId, supervisorId = null) {
    const updateData = {
        status: 'APPROVED'
    };
    if (supervisorId) {
        updateData.supervisorId = Number(supervisorId);
    }
    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: updateData
    });

    return updatedApplication;
}

export async function rejectApplication(appId, rejectReason) {
    if (!rejectReason) {
        throw new Error('يجب داخال سبب للرفض');
    }

    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: {
            status: 'REJECTED',
            rejectReason: rejectReason
        }
    });

    return updatedApplication;
}

export async function markApplicationUnComplete(appId, fieldsData, unComplete) {
    if (!fieldsData || fieldsData.length === 0) {
        throw new Error('يجب ادخال الحقول التي تريد تحسينها من الطالب');
    }
    let fields;
    if (unComplete) {
        fields = fieldsData.map(request => ({
            modelName: request.modelName,
            arModelName: request.arModelName,
            fieldName: request.fieldName,
            arFieldName: request.arFieldName,
            message: request.message,
        }));
    } else {

        fields = fieldsData.map(field => ({
            title: field.title,
            message: field.message,
            type: unComplete ? undefined : field.type,
        }));

    }
    const updateData = unComplete
          ? {
              improvementRequests: {
                  createMany: {
                      data: fields
                  }
              }
          }
          : {
              askedFields: {
                  createMany: {
                      data: fields
                  }
              }
          };

    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: {
            status: 'UN_COMPLETE',
            ...updateData
        }
    });
    return updatedApplication;
}

export async function markApplicationUnderReview(appId, supervisorId) {
    if (!supervisorId) {
        throw new Error('يجب ان تختار مشرف لمراحعة الطلب');
    }

    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: {
            status: 'UNDER_REVIEW',
            supervisorId: supervisorId
        }
    });

    return updatedApplication;
}

export const getAllTickets = async (searchParams, skip, take) => {
    const filters = JSON.parse(searchParams.filters);
    let filter = {}
    if (filters && filters.status !== "all") {
        filter = {status: filters.status}
    }
    const tickets = await prisma.ticket.findMany({
        where: filter,
        select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            userId: true,
        },
        skip: skip,
        take: take,
        orderBy: {
            createdAt: 'desc',
        },
    });

    const total = await prisma.ticket.count({where: filter});
    return {tickets, total};
};


export const updateTicketStatus = async (ticketId, newStatus) => {
    return prisma.ticket.update({
        where: {id: ticketId},
        data: {status: newStatus},
    });
};

//tasks
// services/taskService.js
