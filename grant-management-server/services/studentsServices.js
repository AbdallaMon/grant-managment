import prisma from '../prisma/prisma.js';
import {deleteListOfFiles} from "./utility.js";

export const getStudentApplications = async (studentId, skip, limit) => {
    const applications = await prisma.application.findMany({
        where: {studentId},
        skip,
        take: limit,
        select: {
            id: true,
            status: true,
            rejectReason: true,
            userGrants: {
                select: {
                    id: true
                }
            }
        },
    });
    const total = await prisma.application.count({where: {studentId}});

    return {applications, total};
};
// drafts
export const createNewApplication = async (studentId) => {
    const application = await prisma.application.create({
        data: {studentId, status: "DRAFT"},
        select: {id: true}
    })
    return application.id
}
export const deleteDraftApplication = async (appId) => {
    const supportingFiles = await prisma.supportingFiles.findFirst({where: {applicationId: Number(appId)}})
    let deleteFiles = [];
    if (supportingFiles) {
        deleteFiles = [supportingFiles.personalId, supportingFiles.studentDoc, supportingFiles.medicalReport, supportingFiles.personalPhoto, supportingFiles.proofOfAddress]
    }
    const siblings = await prisma.sibling.findMany({
        where: {applicationId: Number(appId)}, select: {
            document: true
        }
    })
    if (siblings) {
        siblings.forEach((sibling) => {
            if (sibling.document) {
                deleteFiles.push(sibling.document)
            }
        })
    }
    const academicPerformance = await prisma.academicPerformance.findFirst({
              where: {applicationId: Number(appId)},
              select: {transcript: true}
          }
    )
    if (academicPerformance && academicPerformance.transcript) {
        deleteFiles.push(academicPerformance.transcript)
    }
    await prisma.application.delete({
        where: {
            id: appId, status: "DRAFT"
        }, select: {id: true}
    })
    await deleteListOfFiles(deleteFiles)
}

export const getApplicationModel = async (appId, model, status = "DRAFT") => {
    const where = {id: Number(appId)}
    if (status) {
        where.status = status
    }
    const application = await prisma.application.findUnique({
        where,
        select: {
            scholarshipInfo: model === 'scholarshipInfo',
            supportingFiles: model === 'supportingFiles',
            academicPerformance: model === 'academicPerformance',
            residenceInfo: model === 'residenceInfo',
            siblings: model === 'siblings',
            commitment: model === "commitment"
            , scholarshipTerms: model === "scholarshipTerms"
        }
    });
    if (!application) {
        throw new Error('خطا غير مسموح بتعديل هذا الطلب او انه غير موجود');
    }

    return application[model] || null;
};
export const createDraftApplicationModel = async (appId, model, inputData) => {
    switch (model) {
        case 'supportingFiles':
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    supportingFiles: {
                        create: inputData
                    }
                }
            });
        case 'scholarshipInfo':
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    scholarshipInfo: {
                        create: {
                            supportType: inputData.supportType,
                            annualTuitionFee: +inputData.annualTuitionFee,
                            providedAmount: +inputData.providedAmount,
                            requestedAmount: +inputData.requestedAmount,
                        }
                    }
                }
            });
        case 'academicPerformance':
            if (inputData.gpaType === "GPA_4" && (inputData.gpaValue > 4 || inputData.gpaValue < 0)) {
                throw new Error("المعدل التراكمي يجب ان يكون اكبر من 0 واقل من او يساوي 4 اذا كان نوعه معدل من 4 نقاط")
            }
            if (inputData.gpaType === "PERCENTAGE" && (inputData.gpaValue > 100 || inputData.gpaValue < 0)) {
                throw new Error("المعدل التراكمي يجب ان يكون اكبر من 0 واقل من او يساوي 100 اذا كان نوعه معدل مئوي")
            }
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    academicPerformance: {
                        create: {
                            gpaType: inputData.gpaType,
                            gpaValue: +inputData.gpaValue,
                            typeOfStudy: inputData.typeOfStudy,
                            transcript: inputData.transcript
                        }
                    }
                }
            });
        case 'residenceInfo':
            if (inputData.familyIncome) inputData.familyIncome = +inputData.familyIncome;
            if (inputData.motherIncome) inputData.motherIncome = +inputData.motherIncome
            if (inputData.fatherIncome) inputData.fatherIncome = +inputData.fatherIncome;

            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    residenceInfo: {
                        create: inputData
                    }
                }
            });
        case 'siblings':
            inputData.studyYear = +inputData.studyYear
            if (inputData.grantAmount === "") inputData.grantAmount = null
            if (inputData.grantAmount) inputData.grantAmount = +inputData.grantAmount;
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    siblings: {
                        create: inputData,
                    },
                },
                include: {
                    siblings: true, // Include siblings to return the created sibling data
                },
            }).then(result => {
                return result.siblings[result.siblings.length - 1]; // Return the last created sibling
            });
        case 'commitment':
            if (inputData.commitment !== true) throw new Error("يجب عليك الموافقه في حالة كنت موافق بالفعل اعد تحميل الصفحة واكد موافقتك من فضلك")
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {commitment: inputData.commitment}
            });
        case 'grantShipTerms':
            if (inputData.grantShipTerms !== true) throw new Error("يجب عليك الموافقه في حالة كنت موافق بالفعل اعد تحميل الصفحة واكد موافقتك من فضلك")
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {scholarshipTerms: inputData.grantShipTerms}
            });
        default:
            throw new Error("نموذج غير صالح");
    }
};
export const updateApplicationModel = async (appId, model, inputData) => {

    switch (model) {
        case 'supportingFiles':
            const keysToDelete = Object.keys(inputData).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            let oldFiles = null;
            if (keysToDelete && keysToDelete.length > 0) {
                oldFiles = await prisma.supportingFiles.findUnique({
                    where: {
                        applicationId: Number(appId)
                    },
                    select: {
                        ...keysToDelete
                    }
                })
            }
            const update = await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    supportingFiles: {
                        update: inputData
                    }
                }
            });
            if (oldFiles) {
                await deleteListOfFiles(Object.values(oldFiles))
            }
            return update;
        case 'scholarshipInfo':
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    scholarshipInfo: {
                        update: {
                            supportType: inputData.supportType,
                            annualTuitionFee: +inputData.annualTuitionFee,
                            providedAmount: +inputData.providedAmount,
                            requestedAmount: +inputData.requestedAmount,
                        }
                    }
                }
            });
        case 'academicPerformance':
            let oldFileUrl = null;

            if (inputData.transcript && typeof inputData.transcript === 'string' && inputData.transcript.trim() !== '') {
                const currentAcademicPerformance = await prisma.academicPerformance.findUnique({
                    where: {applicationId: Number(appId)},
                    select: {transcript: true}, // Only select the transcript field
                });

                if (currentAcademicPerformance && currentAcademicPerformance.transcript) {
                    oldFileUrl = currentAcademicPerformance.transcript;
                }
            }
            if (inputData.gpaType === "GPA_4" && (inputData.gpaValue > 4 || inputData.gpaValue < 0)) {
                throw new Error("المعدل التراكمي يجب ان يكون اكبر من 0 واقل من او يساوي 4 اذا كان نوعه معدل من 4 نقاط")
            }
            if (inputData.gpaType === "PERCENTAGE" && (inputData.gpaValue > 100 || inputData.gpaValue < 0)) {
                throw new Error("المعدل التراكمي يجب ان يكون اكبر من 0 واقل من او يساوي 100 اذا كان نوعه معدل مئوي")
            }

            const updatedApplication = await prisma.application.update({
                where: {id: Number(appId)},
                data: {
                    academicPerformance: {
                        update: {
                            gpaType: inputData.gpaType,
                            gpaValue: inputData.gpaValue && +inputData.gpaValue,
                            typeOfStudy: inputData.typeOfStudy,
                            transcript: typeof inputData.transcript === 'string' && inputData.transcript.trim() !== '' ? inputData.transcript : undefined
                        }
                    }
                }
            });
            if (oldFileUrl) {
                await deleteListOfFiles([oldFileUrl])
            }

            return updatedApplication;
        case 'residenceInfo':
            delete inputData.id;
            delete inputData.applicationId
            if (inputData.familyIncome) inputData.familyIncome = +inputData.familyIncome;
            if (inputData.motherIncome) inputData.motherIncome = +inputData.motherIncome
            if (inputData.fatherIncome) inputData.fatherIncome = +inputData.fatherIncome;
            if (inputData.fatherStatus !== "ALIVE") inputData.fatherIncome = 0;
            if (inputData.motherStatus !== "ALIVE") inputData.motherIncome = 0;

            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {
                    residenceInfo: {
                        update: inputData
                    }
                }
            });
        case 'siblings':
            let oldDocument = null;
            if (inputData.studyYear) {
                inputData.studyYear = +inputData.studyYear
            }
            if (inputData.grantAmount === "") inputData.grantAmount = null

            if (inputData.grantAmount) {
                inputData.grantAmount = +inputData.grantAmount;
            }

            if (inputData.document) {
                const oldData = await prisma.sibling.findUnique({
                    where: {id: Number(appId)},
                    select: {document: true}
                })
                oldDocument = oldData.document
            }
            const updated = await prisma.sibling.update({
                where: {id: Number(appId)},
                data: inputData
            });
            if (oldDocument) {
                await deleteListOfFiles([oldDocument])
            }
            return updated;
        case 'commitment':
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {commitment: inputData}
            });
        case 'grantShipTerms':
            return await prisma.application.update({
                where: {id: Number(appId), status: 'DRAFT'},
                data: {grantShipTerms: inputData}
            });
        default:
            throw new Error("نموذج غير صالح");
    }
};
export const deleteSibling = async (siblingId,) => {
    const sibling = await prisma.sibling.delete({
        where: {id: Number(siblingId)},
    });
    await deleteListOfFiles([sibling.document])
    return sibling
}


// profile

export const getPersonalInfo = async (userId) => {
    return await prisma.personalInfo.findUnique({
        where: {userId: Number(userId)},
        include: {
            basicInfo: true,
            contactInfo: true,
            studyInfo: true
        }
    });
};

export const updatePersonalInfo = async (userId, model, updateData) => {
    const updateFields = {};
    if (updateData.birthDate) {
        updateData.birthDate = new Date(updateData.birthDate).toISOString();
    }
    if (model === 'basicInfo') {
        updateFields.basicInfo = {
            update: updateData
        };
    } else if (model === 'contactInfo') {
        updateFields.contactInfo = {
            update: updateData
        };
    } else if (model === 'studyInfo') {
        updateFields.studyInfo = {
            update: updateData
        };
    } else {
        throw new Error('نموذج غير صالح للتحديث');
    }

    return await prisma.personalInfo.update({
        where: {userId: Number(userId)},
        data: updateFields,
    });
};
export const checkIfFieldsAreEmpty = async (appId) => {
    const application = await prisma.application.findUnique({
        where: {id: Number(appId)},
        select: {
            supportingFiles: true,
            scholarshipInfo: true,
            academicPerformance: true,
            residenceInfo: true,
            siblings: true,
            commitment: true,
            scholarshipTerms: true
        }
    });
    if (!application) {
        throw new Error("الطلب غير موجود او انك قمت بملئه من قبل ");
    }
    if (application.siblings?.length === 0) application.siblings = null

    const missingFields = [];
    const fieldLinks = {
        supportingFiles: {href: "supporting-files", text: "الذهاب لمليء الملفات الداعمة"},
        scholarshipInfo: {href: "scholarship-info", text: "الذهاب لمليء معلومات المنحة"},
        academicPerformance: {href: "academic-performance", text: "الذهاب لمليء الأداء الأكاديمي"},
        residenceInfo: {href: "residence-info", text: "الذهاب لمليء معلومات الإقامة"},
        siblings: {href: "siblings", text: "الذهاب لمليء معلومات الأخوة"},
        commitment: {href: "commitment", text: "الذهاب لمليء التعهد"},
        scholarshipTerms: {href: "ship-terms", text: "الذهاب لمليء شروط المنحة"}
    };

    Object.keys(fieldLinks).forEach((key) => {
        if (!application[key]) {
            missingFields.push({
                key: key,
                ...fieldLinks[key]
            });
        }
    });

    return missingFields;
};

export const submitApplication = async (appId) => {
    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: {
            status: 'PENDING',
            createdAt: new Date()

        }
    });

    return updatedApplication;
};

export async function getPendingFieldsAndRequests(appId, status) {
    const application = await prisma.application.findUnique({where: {id: Number(appId), status}})
    if (!application) throw new Error("ليس هناك طلب بهذه الحاله")
    const askedFields = await prisma.askedField.findMany({
        where: {
            applicationId: Number(appId),
            status: 'PENDING' // Fetch only fields with pending status
        },
    });

    const improvementRequests = await prisma.improvementRequest.findMany({
        where: {
            applicationId: Number(appId),
            status: 'PENDING' // Fetch only requests with pending status
        },
    });

    // Return both askedFields and improvementRequests together
    return {
        askedFields,
        improvementRequests
    };
}

export async function updateAskedFieldsAndImprovementRequests(appId, askedFieldsData, improvementRequestsData) {
    if (askedFieldsData && askedFieldsData.length > 0) {
        for (const field of askedFieldsData) {
            await prisma.askedField.update({
                where: {id: Number(field.id)},
                data: {
                    value: field.value,
                    status: 'COMPLETED'
                }
            });
        }
    }

    if (improvementRequestsData && improvementRequestsData.length > 0) {
        for (const request of improvementRequestsData) {
            await prisma.improvementRequest.update({
                where: {id: Number(request.id)},
                data: {
                    status: 'COMPLETED'
                }
            });
        }
    }

    const updatedApplication = await prisma.application.update({
        where: {id: Number(appId)},
        data: {
            status: 'UPDATED'
        }
    });

    return updatedApplication;
}

export async function createNewUpdate(appId, data) {
    const newUpdate = await prisma.file.create({
        data: {
            applicationId: Number(appId),
            title: data.title,
            description: data.description,
            url: data.url
        }
    })
    return newUpdate
}


//tickets
export const getTicketsByUser = async (userId, skip, take) => {
    const tickets = await prisma.ticket.findMany({
        where: {userId},
        select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
        },
        skip,
        take,
        orderBy: {createdAt: 'desc'},
    });

    const totalTickets = await prisma.ticket.count({
        where: {userId},
    });

    return [tickets, totalTickets];
};

export const createTicket = async (userId, title, content) => {
    return await prisma.ticket.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            userId: userId,
            status: 'OPEN',
        },
        select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
        },
    });
};

export const getMessagesByTicket = async (ticketId, skip, take) => {
    const ticket = await prisma.ticket.findFirst({
        where: {id: ticketId,},
        select: {
            id: true, status: true, title: true, content: true,
        },
    });
    if (!ticket) {
        throw new Error('تذكرة غير موجودة.');
    }

    const messages = await prisma.message.findMany({
        where: {ticketId: ticketId},
        orderBy: {createdAt: 'desc'},
        skip: skip,
        take: take,
        select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            sender: {select: {role: true}},
        },
    });

    const totalMessages = await prisma.message.count({
        where: {ticketId: ticketId},
    });

    return {
        ticketId: ticket.id,
        status: ticket.status,
        title: ticket.title,      // Include title in the response
        content: ticket.content,  // Include content in the response
        messages: messages.reverse(),
        totalMessages
    };
};

export const createMessage = async (userId, ticketId, content) => {
    const ticket = await prisma.ticket.findFirst({
        where: {id: ticketId, status: 'OPEN'},
    });

    if (!ticket) {
        throw new Error('تذكرة غير موجودة أو مغلقة.');
    }

    const message = await prisma.message.create({
        data: {
            ticketId: ticketId,
            content: content.trim(),
            senderId: userId,
        },
        select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
            sender: {select: {role: true}},
        },
    });
    return {...message, studentId: ticket.userId}
};