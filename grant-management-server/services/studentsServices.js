import prisma from '../prisma/prisma.js';
import {deleteListOfFiles} from "./utility.js";

export const getStudentApplications = async (studentId, skip, limit) => {
    const applications = await prisma.application.findMany({
        where: { studentId },
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
    const total = await prisma.application.count({ where: { studentId } });

    return { applications, total };
};
// drafts
export const createNewApplication=async (studentId)=>{
    const application=await prisma.application.create({
        data:{studentId,status:"DRAFT"},
        select:{id:true}
    })
    return application.id
}
export const deleteDraftApplication=async (appId)=>{
    await prisma.application.delete({
        where:{
            id:appId,status:"DRAFT"
       }, select:{id:true}
    })
}

export const getDraftApplicationModel = async (appId, model) => {
    const application = await prisma.application.findUnique({
        where: { id: parseInt(appId),status:"DRAFT" },
        select: {
            scholarshipInfo: model === 'scholarshipInfo',
            supportingFiles: model === 'supportingFiles',
            academicPerformance: model === 'academicPerformance',
            residenceInfo: model === 'residenceInfo',
            siblings: model === 'siblings',
            commitment:model==="commitment"
            ,scholarshipTerms:model==="scholarshipTerms"
        }
    });
    if (!application ) {
        throw new Error('خطا غير مسموح بتعديل هذا الطلب او انه غير موجود');
    }

    return application[model] || null;
};
export const createDraftApplicationModel = async (appId, model, inputData) => {
    console.log(inputData,"inputd")
    switch (model) {
        case 'supportingFiles':
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    supportingFiles: {
                        create: inputData
                    }
                }
            });
        case 'scholarshipInfo':
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
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
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
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
            if(inputData.familyIncome)inputData.familyIncome= +inputData.familyIncome;
            if(inputData.motherIncome)inputData.motherIncome= +inputData.motherIncome
            if(inputData.fatherIncome)inputData.fatherIncome= +inputData.fatherIncome;

            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    residenceInfo: {
                        create: inputData
                    }
                }
            });
        case 'siblings':
            inputData.studyYear = new Date(inputData.studyYear).toISOString();
            if (inputData.grantAmount) inputData.grantAmount = +inputData.grantAmount;

            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    siblings: {
                        create: inputData,
                    },
                },
                include: {
                    siblings: true, // Include siblings to return the created sibling data
                },
            }).then(result => {
                // Return the newly created sibling from the result
                return result.siblings[result.siblings.length - 1]; // Return the last created sibling
            });
        case 'commitment':
            if(inputData.commitment!==true) throw new Error("يجب عليك الموافقه في حالة كنت موافق بالفعل اعد تحميل الصفحة واكد موافقتك من فضلك")
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: { commitment: inputData.commitment }
            });
        case 'grantShipTerms':
            if(inputData.commitment!==true) throw new Error("يجب عليك الموافقه في حالة كنت موافق بالفعل اعد تحميل الصفحة واكد موافقتك من فضلك")
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: { grantShipTerms: inputData.grantShipTerms }
            });
        default:
            throw new Error("نموذج غير صالح");
    }
};
export const updateDraftApplicationModel = async (appId, model, inputData) => {

    switch (model) {
        case 'supportingFiles':
            const keysToDelete = Object.keys(inputData).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            let oldFiles=null;
              if(keysToDelete&&keysToDelete.length>0)
              {
                  oldFiles=await prisma.supportingFiles.findUnique({
                      where:{
                          applicationId:Number(appId)
                      },
                      select:{
                        ...keysToDelete
                      }
                  })
              }
            const update= await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    supportingFiles: {
                        update: inputData
                    }
                }
            });
            if(oldFiles){
                await deleteListOfFiles(Object.values(oldFiles))
            }
            return update;
        case 'scholarshipInfo':
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
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

            if (inputData.transcript&&typeof inputData.transcript === 'string' && inputData.transcript.trim() !== '') {
                const currentAcademicPerformance = await prisma.academicPerformance.findUnique({
                    where: { applicationId: Number(appId) },
                    select: { transcript: true }, // Only select the transcript field
                });

                if (currentAcademicPerformance && currentAcademicPerformance.transcript) {
                    oldFileUrl = currentAcademicPerformance.transcript;
                }
            }
            const updatedApplication = await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    academicPerformance: {
                        update: {
                            gpaType: inputData.gpaType,
                            gpaValue: inputData.gpaValue&&+inputData.gpaValue,
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
            if(inputData.familyIncome)inputData.familyIncome= +inputData.familyIncome;
            if(inputData.motherIncome)inputData.motherIncome= +inputData.motherIncome
            if(inputData.fatherIncome)inputData.fatherIncome= +inputData.fatherIncome;
            if(inputData.fatherStatus!=="ALIVE")inputData.fatherIncome=0;
            if(inputData.motherStatus!=="ALIVE")inputData.motherIncome=0;

            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    residenceInfo: {
                        update: inputData
                    }
                }
            });
        case 'siblings':
            let oldDocument=null;
            if(inputData.studyYear){
            inputData.studyYear = new Date(inputData.studyYear).toISOString();
            }
            if(inputData.grantAmount){
            inputData.grantAmount = +inputData.grantAmount;
            }

            if(inputData.document)
            {
           const oldData=await prisma.sibling.findUnique({
            where:{id: Number(appId)},
            select:{document:true}
            })
                oldDocument=oldData.document
            }
            const updated =await prisma.sibling.update({
                where: { id: Number(appId) },
                data: inputData
            });
            if(oldDocument){
                await deleteListOfFiles([oldDocument])
            }
            return updated;
        case 'commitment':
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: { commitment: inputData }
            });
        case 'grantShipTerms':
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: { grantShipTerms: inputData }
            });
        default:
            throw new Error("نموذج غير صالح");
    }
};
export const deleteSibling = async (siblingId,) => {
    const sibling= await prisma.sibling.delete({
        where: { id: Number(siblingId) },
    });
    await deleteListOfFiles([sibling.document])
    return sibling
}


// profile

export const getPersonalInfo = async (userId) => {
    return await prisma.personalInfo.findUnique({
        where: { userId: Number(userId) },
        include: {
            basicInfo: true,
            contactInfo: true,
            studyInfo: true
        }
    });
};

export const updatePersonalInfo = async (userId, model, updateData) => {
    const updateFields = {};
console.log(updateData,"updatedData")
    console.log(model,"model")
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
        where: { userId: Number(userId) },
        data: updateFields,
    });
};
