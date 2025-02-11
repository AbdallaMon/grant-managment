"use client";
import { useEffect, useRef, useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid2 as Grid,
  Button,
  Divider,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/ar";
import { FiFilter, FiPrinter } from "react-icons/fi";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";
import SearchComponent from "../formComponents/SearchComponent";
import {
  ApplicationStatusOptions,
  PaymentStatus,
  ProgramType,
} from "@/app/helpers/constants";
import { ApplicationReport } from "./PrintableReport";
import { useReactToPrint } from "react-to-print";
import { exportToExcel } from "./excelPrint";
import { useAuth } from "@/app/providers/AuthProvider";
const PaymentStatusOptions = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
};

function ReportsPage({ isAdmin }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Reports />
    </LocalizationProvider>
  );
}
const Reports = () => {
  const { user } = useAuth();
  const [mainFilters, setMainFilters] = useState({
    grantId: "",
    country: "",
    startDate: null,
    endDate: null,
    status: null,
  });

  const [subFilter, setSubFilter] = useState({
    type: "",
    searchKey: "",
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries"
        );
        const data = await response.json();
        setCountries(data.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  const subFilterTypes = [
    { value: "student", label: "بحث عن طالب" },
    { value: "supervisor", label: "بحث عن مشرف" },
    { value: "programType", label: "نوع الاختصاص" },
    { value: "university", label: "الجامعة" },
    { value: "paymentStatus", label: "حالة الدفع" },
  ];
  const handleMainFilterChange = (id, value) => {
    setMainFilters((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDateChange = (field) => (date) => {
    setMainFilters((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  const handleSubFilterChange = (field) => (event) => {
    setSubFilter((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (field === "type") {
      setSubFilter((prev) => ({
        ...prev,
        searchKey: "",
      }));
    }
  };

  const handleSearchComponentSelect = (id, value) => {
    setSubFilter((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const renderSubFilterInput = () => {
    switch (subFilter.type) {
      case "student":
        return (
          <SearchComponent
            apiEndpoint="search?model=user"
            functionSearch={(value) =>
              handleSearchComponentSelect("searchKey", value?.id)
            }
            fullWidth={true}
            inputLabel="ابحث بالاسم او الايميل لاختيار طالب"
            renderKeys={["personalInfo.basicInfo.name", "email"]}
            mainKey="email"
            localFilters={{
              role: "STUDENT",
              sponsorId: user.role !== "ADMIN" && user.id,
            }}
            sx={{ backgroundColor: "white" }}
          />
        );
      case "supervisor":
        return (
          <SearchComponent
            apiEndpoint="search?model=user"
            functionSearch={(value) =>
              handleSearchComponentSelect("searchKey", value?.id)
            }
            fullWidth={true}
            inputLabel="ابحث بالاسم او الايميل لاختيار مشرف"
            renderKeys={["personalInfo.basicInfo.name", "email"]}
            mainKey="email"
            localFilters={{ role: "SUPERVISOR" }}
            sx={{ backgroundColor: "white" }}
          />
        );
      case "grant":
        return (
          <SearchComponent
            apiEndpoint="search?model=grant"
            functionSearch={(value) =>
              handleSearchComponentSelect("searchKey", value?.id)
            }
            fullWidth={true}
            inputLabel="ابحث عن منحة"
            renderKeys={["name"]}
            mainKey="name"
            sx={{ backgroundColor: "white" }}
          />
        );
      case "paymentStatus":
        return (
          <TextField
            select
            fullWidth
            label="حالة الدفع"
            value={subFilter.searchKey}
            onChange={(e) => handleSubFilterChange("searchKey")(e)}
            sx={{ backgroundColor: "white" }}
          >
            {Object.entries(PaymentStatusOptions).map(([key, value]) => (
              <MenuItem key={key} value={value}>
                {PaymentStatus[value]}
              </MenuItem>
            ))}
          </TextField>
        );
      case "programType":
        return (
          <TextField
            select
            fullWidth
            label="نوع الاختصاص"
            value={subFilter.searchKey}
            onChange={(e) => handleSubFilterChange("searchKey")(e)}
            sx={{ backgroundColor: "white" }}
          >
            {Object.entries(ProgramType).map(([key, value]) => (
              <MenuItem key={key} value={key}>
                {value}
              </MenuItem>
            ))}
          </TextField>
        );
      case "university":
        return (
          <TextField
            fullWidth
            label="الجامعة"
            value={subFilter.searchKey}
            onChange={(e) => handleSubFilterChange("searchKey")(e)}
            sx={{ backgroundColor: "white" }}
          />
        );
      default:
        return null;
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...subFilter,
        ...(mainFilters.grantId && { grantId: mainFilters.grantId }),
        ...(mainFilters.country && { country: mainFilters.country }),
        ...(mainFilters.startDate && {
          startDate: dayjs(mainFilters.startDate).format("YYYY-MM-DD"),
        }),
        ...(mainFilters.endDate && {
          endDate: dayjs(mainFilters.endDate).format("YYYY-MM-DD"),
        }),
        ...(mainFilters.status && {
          status: mainFilters.status,
        }),
        userId: user.id,
        userRole: user.role,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/${
          user.role === "ADMIN" ? "admin" : "sponsor"
        }/reports?${queryParams}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data) {
        setReportData(data.data);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      // Add your error handling UI here
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        تقارير المنح
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item size={12}>
            <Typography variant="h6" gutterBottom>
              <FiFilter style={{ marginRight: 8 }} />
              الفلاتر الرئيسية
            </Typography>
          </Grid>
          {user.role === "ADMIN" && (
            <Grid size={{ xs: 12, md: 6 }}>
              <SearchComponent
                apiEndpoint="search?model=grant"
                functionSearch={(value) => {
                  handleMainFilterChange("grantId", value ? value.id : null);
                }}
                fullWidth={true}
                inputLabel="ابحث عن منحة"
                renderKeys={["name"]}
                mainKey="name"
                sx={{ backgroundColor: "white" }}
              />
            </Grid>
          )}

          <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.country}
              onChange={(event, newValue) =>
                handleMainFilterChange("country", newValue?.country)
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="الدولة"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingCountries ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                  sx={{ bgcolor: "background.default", width: "100%" }}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              label="من تاريخ"
              value={mainFilters.startDate}
              onChange={handleDateChange("startDate")}
              helperText="يجب عليك ادخال تاريخ بداية ونهاية"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="يجب عليك ادخال تاريخ بداية ونهاية"
                />
              )}
              sx={{ bgcolor: "background.default", width: "100%" }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <DatePicker
              sx={{ bgcolor: "background.default", width: "100%" }}
              label="الى تاريخ"
              value={mainFilters.endDate}
              onChange={handleDateChange("endDate")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  helperText="يجب عليك ادخال تاريخ بداية ونهاية"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl sx={{ bgcolor: "background.default", width: "100%" }}>
              <InputLabel id="status">حالة الطلب</InputLabel>
              <Select
                onChange={(event) =>
                  handleMainFilterChange("status", event.target.value)
                }
                labelId="status"
                id="status"
                label="حالة الطلب"
                value={mainFilters.status}
              >
                {ApplicationStatusOptions.map((appStatus) => {
                  return (
                    <MenuItem key={appStatus.value} value={appStatus.value}>
                      {appStatus.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              الفلتر الفرعي
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              select
              label="نوع الفلتر"
              sx={{ bgcolor: "background.default", width: "100%" }}
              value={subFilter.type}
              onChange={handleSubFilterChange("type")}
            >
              {subFilterTypes.map((option) => {
                if (option.value === "supervisor" && user.role !== "ADMIN")
                  return;
                return (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>{renderSubFilterInput()}</Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            onClick={generateReport}
            disabled={loading}
            startIcon={<BsFileEarmarkSpreadsheet />}
          >
            توليد تقارير
          </Button>
        </Box>
      </Paper>
      <ReportActions reportData={reportData} />
    </Container>
  );
};
const PrintGrid = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  gap: "16px",
  "@media print": {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
  },
});

const PrintGridItem = styled(Box)(({ size }) => ({
  flex: `1 1 calc(100% - 16px)`,
  minWidth: `calc(100% - 16px)`,
  "@media (min-width: 900px)": {
    flex: `1 1 calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
    minWidth: `calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
  },
  "@media print": {
    flex: `1 1 calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
    minWidth: `calc(${((size?.md || 12) * 100) / 12}% - 16px)`,
  },
}));

const ReportActions = ({ reportData }) => {
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <Box sx={{ mb: 2, display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          startIcon={<FiPrinter />}
          onClick={reactToPrintFn}
        >
          طباعة التقرير
        </Button>
        <Button
          variant="outlined"
          startIcon={<BsFileEarmarkSpreadsheet />}
          onClick={() => exportToExcel(reportData)}
        >
          تصدير إلى Excel
        </Button>
      </Box>
      <div ref={contentRef}>
        {reportData && (
          <div className="print-ref">
            <Box sx={{ p: { xs: 1.5, md: 4 }, bgcolor: "background.paper" }}>
              <PrintGrid>
                {/* Summary Cards */}
                <PrintGridItem>
                  <Typography variant="h6" gutterBottom>
                    ملخص
                  </Typography>
                </PrintGridItem>

                <PrintGridItem size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        اجمالي المدفوع
                      </Typography>
                      <Typography variant="h5">
                        ${reportData.summary.totalMoneyPaid.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </PrintGridItem>

                <PrintGridItem size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        اجمالي الاموال المعلقه
                      </Typography>
                      <Typography variant="h5">
                        ${reportData.summary.totalPending.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </PrintGridItem>

                <PrintGridItem size={{ xs: 12, md: 4 }}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        الاجمالي
                      </Typography>
                      <Typography variant="h5">
                        ${reportData.summary.total.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </PrintGridItem>

                {/* Report Data Table - You can add a detailed table here */}
                <PrintGridItem size={12}>
                  <Paper sx={{ p: 3 }}>
                    <PrintGridItem variant="h6" gutterBottom>
                      تقرير مفصل
                    </PrintGridItem>
                    <div>
                      {reportData.report.map((application) => (
                        <ApplicationReport
                          key={application.applicationId}
                          application={application}
                        />
                      ))}
                    </div>{" "}
                  </Paper>
                </PrintGridItem>
              </PrintGrid>
            </Box>
          </div>
        )}
      </div>
    </>
  );
};
export default ReportsPage;
