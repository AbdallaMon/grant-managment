import prisma from '../prisma/prisma.js';
import axios from "axios";
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
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    siblings: {
                        create: inputData
                    }
                }
            });
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
export const updateDraftApplicationModel = async (appId, model, inputData) => {
    console.log(inputData,'update')
    switch (model) {
        case 'supportingFiles':
            const keysToDelete = Object.keys(inputData).reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            let oldFiles=null;
              if(keysToDelete)
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
            return await prisma.application.update({
                where: { id: Number(appId), status: 'DRAFT' },
                data: {
                    siblings: {
                        updateMany: inputData
                    }
                }
            });
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
