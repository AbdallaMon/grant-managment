import prisma from '../prisma/prisma.js';

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
export const createNewApplication=async function(studentId){
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