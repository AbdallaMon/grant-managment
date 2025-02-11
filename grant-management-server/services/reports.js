import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function getGrantReport(req, res) {
  const {
    type,
    searchKey,
    grantId,
    country,
    startDate,
    endDate,
    status,
    userId,
    userRole,
  } = req.query;
  let whereClause = {};
  if (type && searchKey) {
    whereClause = buildWhereClause(type, searchKey);
  }

  const mainFilters = {};
  if (grantId) {
    mainFilters.grantId = Number(grantId);
  }
  if (country) {
    mainFilters.country = country;
  }
  console.log(whereClause, "wherEV");

  if (startDate || endDate) {
    mainFilters.dateRange = {
      startDate: startDate
        ? new Date(startDate)
        : new Date(new Date(endDate).setDate(new Date(endDate).getDate() - 1)),
      endDate: endDate ? new Date(endDate) : new Date(),
    };
  }
  if (status) {
    whereClause.status = status;
  } else {
    whereClause.status = {
      not: "DRAFT",
    };
  }
  if (userRole !== "ADMIN") {
    if (whereClause.userGrants) {
      // If userGrants exists, merge the conditions
      whereClause.userGrants = {
        some: {
          AND: [
            whereClause.userGrants.some, // Existing conditions
            {
              grant: {
                viewAccessUsers: {
                  some: {
                    id: Number(userId),
                  },
                },
              },
            },
          ],
        },
      };
    } else {
      whereClause.userGrants = {
        some: {
          grant: {
            viewAccessUsers: {
              some: {
                id: Number(userId),
              },
            },
          },
        },
      };
    }
  }
  if (Object.keys(mainFilters).length > 0) {
    whereClause = {
      AND: [whereClause, buildMainFiltersClause(mainFilters)],
    };
  }
  console.log(whereClause, "AND");

  try {
    const applications = await prisma.application.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        createdAt: true,
        scholarshipInfo: {
          select: {
            supportType: true,
            requestedAmount: true,
            providedAmount: true,
          },
        },
        student: {
          select: {
            id: true,
            email: true,
            personalInfo: {
              select: {
                basicInfo: {
                  select: {
                    name: true,
                    nationality: true,
                    fatherName: true,
                    familyName: true,
                  },
                },
                studyInfo: {
                  select: {
                    programType: true,
                    university: true,
                    college: true,
                    department: true,
                    year: true,
                  },
                },
              },
            },
          },
        },
        userGrants: {
          select: {
            id: true,
            startDate: true,
            endDate: true,
            payEvery: true,
            totalAmounts: true,
            supervisor: {
              select: {
                id: true,
                email: true,
                personalInfo: {
                  select: {
                    basicInfo: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
            grant: {
              select: {
                id: true,
                name: true,
                type: true,
                amount: true,
              },
            },
            payments: {
              select: {
                id: true,
                amount: true,
                amountPaid: true,
                dueDate: true,
                paidAt: true,
                status: true,
                invoices: {
                  select: {
                    invoiceNumber: true,
                    amount: true,
                    paidAt: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const summary = calculateReportSummary(applications);
    const formattedData = formatApplicationData(applications);

    res.json({ data: { report: formattedData, summary } });
  } catch (error) {
    console.log(error, "error");
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred",
    });
  }
}
function buildMainFiltersClause(mainFilters) {
  const conditions = [];

  if (mainFilters.grantId) {
    conditions.push({
      userGrants: {
        some: {
          grant: {
            id: mainFilters.grantId,
          },
        },
      },
    });
  }

  if (mainFilters.country) {
    conditions.push({
      student: {
        personalInfo: {
          basicInfo: {
            residenceCountry: mainFilters.country,
          },
        },
      },
    });
  }

  if (mainFilters.dateRange) {
    conditions.push({
      createdAt: {
        gte: mainFilters.dateRange.startDate,
        lte: mainFilters.dateRange.endDate,
      },
    });
  }

  return conditions.length > 0 ? { AND: conditions } : {};
}
function buildWhereClause(type, searchKey) {
  switch (type) {
    case "student":
      return { studentId: Number(searchKey) };
    case "supervisor":
      return {
        supervisorId: Number(searchKey),
      };
    case "programType":
      return {
        student: {
          personalInfo: {
            studyInfo: { programType: searchKey },
          },
        },
      };
    case "university":
      return {
        student: {
          personalInfo: {
            studyInfo: {
              university: {
                contains: searchKey,
              },
            },
          },
        },
      };
    case "paymentStatus": {
      switch (searchKey) {
        case "PAID":
          return {
            userGrants: {
              some: {
                payments: {
                  every: {
                    status: "PAID",
                  },
                },
              },
            },
          };
        case "PENDING":
          return {
            userGrants: {
              some: {
                payments: {
                  some: {
                    AND: [
                      { status: "PENDING" },
                      { dueDate: { gt: new Date() } },
                    ],
                  },
                },
              },
            },
          };
        case "OVERDUE":
          return {
            userGrants: {
              some: {
                payments: {
                  some: {
                    AND: [
                      { status: "PENDING" },
                      { dueDate: { lt: new Date() } },
                    ],
                  },
                },
              },
            },
          };
        default:
          throw new Error("Invalid payment status");
      }
    }
    default:
      throw new Error("Invalid filter type");
  }
}

function calculateReportSummary(applications) {
  let totalMoneyPaid = 0;
  let totalPending = 0;
  let totalGrants = 0;

  applications.forEach((app) => {
    totalGrants += app.userGrants.length;
    app.userGrants.forEach((grant) => {
      grant.payments.forEach((payment) => {
        if (payment.status === "PAID") {
          totalMoneyPaid += payment.amountPaid || 0;
        } else {
          totalPending += payment.amount;
        }
      });
    });
  });

  return {
    totalMoneyPaid,
    totalPending,
    total: totalMoneyPaid + totalPending,
    totalApplications: applications.length,
    totalGrants,
    averageGrantAmount: totalGrants
      ? (totalMoneyPaid + totalPending) / totalGrants
      : 0,
  };
}

function formatApplicationData(applications) {
  return applications.map((app) => ({
    applicationId: app.id,
    status: app.status,
    createdAt: app.createdAt,
    student: {
      id: app.student.id,
      name: app.student.personalInfo?.basicInfo?.name,
      email: app.student.email,
      studyInfo: app.student.personalInfo?.studyInfo,
    },
    scholarshipInfo: app.scholarshipInfo,
    grants: app.userGrants.map((grant) => ({
      id: grant.id,
      grantName: grant.grant.name,
      grantType: grant.grant.type,
      totalAmount: grant.totalAmounts,
      startDate: grant.startDate,
      endDate: grant.endDate,
      paymentSchedule: grant.payEvery,
      supervisor: grant.supervisor
        ? {
            id: grant.supervisor.id,
            name: grant.supervisor.personalInfo?.basicInfo?.name,
            email: grant.supervisor.email,
          }
        : null,
      payments: grant.payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        amountPaid: payment.amountPaid,
        status: payment.status,
        dueDate: payment.dueDate,
        paidAt: payment.paidAt,
        invoices: payment.invoices,
      })),
    })),
  }));
}
