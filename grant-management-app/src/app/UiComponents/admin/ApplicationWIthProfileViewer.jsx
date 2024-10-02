import React, {useState, useEffect} from "react";
import {
    Box,
    Typography,
    Button,
    Collapse,
    Card,
    CardContent,
    Divider, TextField, MenuItem, Snackbar, IconButton, Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {MdOutlineExpandMore as ExpandMoreIcon} from "react-icons/md";
import {MdOutlineExpandLess as ExpandLessIcon} from "react-icons/md";
import {AiOutlineEdit as EditIcon} from "react-icons/ai";
import {FaDeleteLeft as DeleteIcon} from "react-icons/fa6";
import CircularProgress from "@mui/material/CircularProgress";
import {getData} from "@/app/helpers/functions/getData";
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import {MdDateRange as DateIcon} from "react-icons/md";

import {
    FieldStatus, FieldType,
    GenderType,
    GpaType,
    ParentStatus,
    ResidenceType,
    StudySource,
    StudyType,
    SupportType
} from "@/app/helpers/constants";
import {renderFileLink} from "@/app/helpers/functions/utility";
import dayjs from "dayjs";
import MuiAlert from "@mui/material/Alert";
import ConfirmWithActionModel from "@/app/UiComponents/models/ConfirmsWithActionModel";
import SearchComponent from "@/app/UiComponents/formComponents/SearchComponent";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import DrawerWithContent from "@/app/UiComponents/DataViewer/DrawerWithContent";
import {Form} from "@/app/UiComponents/formComponents/forms/Form";

export default function ApplicationWithProfileViewer({
                                                         item,
                                                         route,
                                                         onClose,
                                                         setData,
                                                         view = false,
                                                         isAdmin = true,
                                                         isStudent = false
                                                     }) {
    route = isStudent ? "student" : `${route}/student`

    const [personalInfo, setPersonalInfo] = useState(null);
    const [application, setApplication] = useState(null);

    const [loadingPersonalInfo, setLoadingPersonalInfo] = useState(true);
    const [loadingApplication, setLoadingApplication] = useState(true);
    const [openPersonalInfo, setOpenPersonalInfo] = useState(false);
    const [openAppDetails, setOpenAppDetails] = useState(true)
    useEffect(() => {
        const fetchPersonalInfo = async () => {
            setLoadingPersonalInfo(true);
            const response = await getData({
                url: `${route}/${item.studentId}/personal`,
                setLoading: setLoadingPersonalInfo
            })
            setPersonalInfo(response.data);
            setLoadingPersonalInfo(false);
        };

        const fetchApplication = async () => {
            setLoadingApplication(true);
            const url = isStudent ? `student/applications/${item.id}/approved` : `${route}/${item.id}`
            const response = await getData({url, setLoading: setLoadingApplication})
            console.log(response, "response")
            setApplication(response.data);
        };


        fetchPersonalInfo();
        fetchApplication();
    }, [item]);

    // Personal Info Rendering
    const renderPersonalInfo = () => {
        const {basicInfo, contactInfo, studyInfo} = personalInfo;

        return (
              <Card variant="outlined" sx={{mb: 2, p: 2, backgroundColor: "#f7f9fc", borderRadius: "12px"}}>
                  <CardContent>
                      <Typography variant="h6" fontWeight="bold" sx={{mb: 2}}>
                          المعلومات الشخصية
                      </Typography>
                      <Divider sx={{my: 2}}/>
                      <Grid container spacing={3}>
                          {/* Basic Information */}
                          <Grid size={{xs: 12}}>
                              <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 1}}>
                                  المعلومات الأساسية
                              </Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>الاسم: {basicInfo?.name || "لا يوجد"}</Typography>
                              <Typography>اسم الأب: {basicInfo?.fatherName || "لا يوجد"}</Typography>
                              <Typography>اسم العائلة: {basicInfo?.familyName || "لا يوجد"}</Typography>
                              <Typography>الجنسية: {basicInfo?.nationality || "لا يوجد"}</Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>الجواز: {basicInfo?.passport || "لا يوجد"}</Typography>
                              <Typography>الجنس: {GenderType[basicInfo?.gender] || "غير متوفر"}</Typography>
                              <Typography>
                                  تاريخ
                                  الميلاد: {basicInfo?.birthDate ? dayjs(basicInfo.birthDate).format("DD/ MM/ YYYY") : "غير متوفر"}
                              </Typography>
                              <Typography>البلد: {basicInfo?.residenceCountry || "لا يوجد"}</Typography>
                          </Grid>
                          <Grid size={{xs: 12}}>
                              <Typography>هل لديك إعاقة: {basicInfo?.hasDisability ? "نعم" : "لا"}</Typography>
                              {basicInfo?.hasDisability && (
                                    <Typography>نوع الإعاقة: {basicInfo?.disability || "غير متوفر"}</Typography>
                              )}
                          </Grid>

                          {/* Contact Information */}
                          <Grid size={{xs: 12}} sx={{mt: 2}}>
                              <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 1}}>
                                  معلومات الاتصال
                              </Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>الهاتف: {contactInfo?.phone || "لا يوجد"}</Typography>
                              <Typography>واتساب: {contactInfo?.whatsapp || "لا يوجد"}</Typography>
                              <Typography>فيسبوك: {contactInfo?.facebook || "لا يوجد"}</Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>انستغرام: {contactInfo?.instagram || "لا يوجد"}</Typography>
                              <Typography>تويتر: {contactInfo?.twitter || "لا يوجد"}</Typography>
                          </Grid>

                          {/* Study Information */}
                          <Grid size={{xs: 12}} sx={{mt: 2}}>
                              <Typography variant="subtitle1" fontWeight="bold" sx={{mb: 1}}>
                                  المعلومات الدراسية
                              </Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>الجامعة: {studyInfo?.university || "لا يوجد"}</Typography>
                              <Typography>الكلية: {studyInfo?.college || "لا يوجد"}</Typography>
                          </Grid>
                          <Grid size={{xs: 12, sm: 6}}>
                              <Typography>القسم: {studyInfo?.department || "لا يوجد"}</Typography>
                              <Typography>السنة الدراسية: {studyInfo?.year || "لا يوجد"}</Typography>
                              <Typography>رقم الطالب: {studyInfo?.studentIdNo || "لا يوجد"}</Typography>
                          </Grid>
                      </Grid>
                  </CardContent>
              </Card>
        );
    };

    const renderApplicationData = () => {
        const {
            scholarshipInfo,
            academicPerformance,
            residenceInfo,
            supportingFiles,
            siblings,
            commitment,
            scholarshipTerms,
        } = application;

        return (
              <Card variant="outlined" sx={{p: 4, backgroundColor: "#f9f9f9", borderRadius: "12px"}}>
                  <CardContent>
                      <Typography variant="h5" fontWeight="bold" sx={{mb: 2}}>
                          بيانات الطلب
                      </Typography>
                      <Divider sx={{mb: 3}}/>

                      {/* Scholarship Info */}
                      <Box mb={4}>
                          <Typography variant="h6" fontWeight="bold" sx={{mb: 1}}>
                              معلومات المنحة
                          </Typography>
                          <Grid container spacing={2}>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>نوع الدعم
                                      المطلوب: {SupportType[scholarshipInfo?.supportType] || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>الرسوم
                                      السنوية: {scholarshipInfo?.annualTuitionFee || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12}}>
                                  <Typography>المبلغ الممكن
                                      توفيره: {scholarshipInfo?.providedAmount || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12}}>
                                  <Typography>المبلغ
                                      المطلوب: {scholarshipInfo?.requestedAmount || "لا يوجد"}</Typography>
                              </Grid>
                          </Grid>
                      </Box>

                      {/* Academic Performance */}
                      <Box mb={4}>
                          <Typography variant="h6" fontWeight="bold" sx={{mb: 1}}>
                              الأداء الأكاديمي
                          </Typography>
                          <Grid container spacing={2}>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>نوع
                                      الدراسة: {StudyType[academicPerformance?.typeOfStudy] || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>نوع
                                      المعدل: {GpaType[academicPerformance?.gpaType] || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>قيمة المعدل: {academicPerformance?.gpaValue || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12}}>
                                  {renderFileLink(academicPerformance?.transcript, "كشف الدرجات")}
                              </Grid>
                          </Grid>
                      </Box>

                      {/* Residence Info */}
                      <Box mb={4}>
                          <Typography variant="h6" fontWeight="bold" sx={{mb: 1}}>
                              معلومات السكن
                          </Typography>
                          <Grid container spacing={2}>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>نوع
                                      السكن: {ResidenceType[residenceInfo?.residenceType] || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>الدولة: {residenceInfo?.country || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>المدينة: {residenceInfo?.city || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>العنوان: {residenceInfo?.address || "لا يوجد"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>حالة
                                      الأب: {ParentStatus[residenceInfo?.fatherStatus] || "غير متوفر"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>دخل
                                      الأب: {residenceInfo?.fatherIncome ? `${residenceInfo.fatherIncome} USD` : "غير متوفر"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>حالة
                                      الأم: {ParentStatus[residenceInfo?.motherStatus] || "غير متوفر"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  <Typography>دخل
                                      الأم: {residenceInfo?.motherIncome ? `${residenceInfo.motherIncome} USD` : "غير متوفر"}</Typography>
                              </Grid>
                              <Grid size={{xs: 12}}>
                                  <Typography>إجمالي دخل
                                      الأسرة: {residenceInfo?.familyIncome ? `${residenceInfo.familyIncome} USD` : "غير متوفر"}</Typography>
                              </Grid>
                          </Grid>
                      </Box>

                      {/* Supporting Files */}
                      <Box mb={4}>
                          <Typography variant="h6" fontWeight="bold" sx={{mb: 1}}>
                              الملفات الداعمة
                          </Typography>
                          <Grid container spacing={2}>
                              <Grid size={{xs: 12, sm: 6}}>
                                  {renderFileLink(supportingFiles?.personalId, "الهوية الشخصية")}
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  {renderFileLink(supportingFiles?.studentDoc, "وثيقة الطالب")}
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  {renderFileLink(supportingFiles?.medicalReport, "التقرير الطبي")}
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  {renderFileLink(supportingFiles?.personalPhoto, "الصورة الشخصية")}
                              </Grid>
                              <Grid size={{xs: 12, sm: 6}}>
                                  {renderFileLink(supportingFiles?.proofOfAddress, "إثبات العنوان")}
                              </Grid>
                          </Grid>
                      </Box>

                      {/* Siblings */}
                      <Box mb={4}>
                          <Typography variant="h6" fontWeight="bold" sx={{mb: 2}}>
                              الأشقاء
                          </Typography>

                          {siblings?.length > 0 ? (
                                <Grid container spacing={3}>
                                    {siblings.map((sibling, index) => (
                                          <Grid size={{xs: 12}} key={index}>
                                              <Box sx={{
                                                  p: 3,
                                                  backgroundColor: "#f0f4f8",
                                                  borderRadius: "8px",
                                                  boxShadow: 2,
                                                  mb: 2
                                              }}>
                                                  <Typography fontWeight="bold" sx={{mb: 2}}>
                                                      {`الأخ ${index + 1}`}
                                                  </Typography>
                                                  <Grid container spacing={2}>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>الاسم: {sibling.name}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>العلاقة: {sibling.relation}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>الجامعة: {sibling.university}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>الكلية: {sibling.college}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>القسم: {sibling.department}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>سنة
                                                              الدراسة: {sibling.studyYear}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>مصدر تغطية
                                                              الدراسة: {StudySource[sibling.sourceOfStudy]}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>مصدر
                                                              المنحة: {sibling.grantSource || "غير متوفر"}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12, sm: 6}}>
                                                          <Typography>قيمة
                                                              المنحة: {sibling.grantAmount || "غير متوفر"}</Typography>
                                                      </Grid>
                                                      <Grid size={{xs: 12}}>
                                                          {renderFileLink(sibling.document, "الوثيقة")}
                                                      </Grid>
                                                  </Grid>
                                              </Box>
                                          </Grid>
                                    ))}
                                </Grid>
                          ) : (
                                <Typography>لا يوجد معلومات عن الأخوة</Typography>
                          )}
                      </Box>

                      {/* Commitment & Scholarship Terms */}
                      <Box mb={4}>
                          <Typography>{commitment ? "تم الموافقة على التعهد" : "لم يتم الموافقة على التعهد"}</Typography>
                          <Typography>{scholarshipTerms ? "تم الموافقة على شروط المنحة" : "لم يتم الموافقة على شروط المنحة"}</Typography>
                      </Box>
                  </CardContent>
              </Card>
        );
    };
    return (
          <Box>
              {loadingPersonalInfo ? (
                    <CircularProgress/>
              ) : (
                    <>
                        <Button
                              variant="contained"
                              onClick={() => setOpenPersonalInfo(!openPersonalInfo)}
                              sx={{mb: 2}}
                        >
                            {openPersonalInfo ? "إخفاء المعلومات الشخصية" : "عرض المعلومات الشخصية"}
                            {openPersonalInfo ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </Button>
                        <Collapse in={openPersonalInfo}>{renderPersonalInfo()}</Collapse>
                    </>
              )}

              {loadingApplication ? <FullScreenLoader/> :
                    <>
                        <Button
                              variant="contained"
                              onClick={() => setOpenAppDetails(!openAppDetails)}
                              sx={{mb: 2}}
                        >
                            {openAppDetails ? "إخفاء معلومات طلب المنحة" : "عرض معلومات طلب المنحة"}
                            {openAppDetails ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </Button>
                        <Collapse in={openAppDetails}>{renderApplicationData()}</Collapse>
                    </>
              }
              <RenderImprovementsAndAskedFields item={item} route={route} view={view} isStudent={isStudent}/>

              {!loadingApplication && !isStudent &&
                    <RenderActionsButtons isAdmin={isAdmin} onClose={onClose} appId={item.id}
                                          setData={setData}
                                          item={item}
                                          route={route}
                                          view={view}
                                          application={application}
                    />
              }
          </Box>
    );
};

const RenderImprovementsAndAskedFields = ({item, route, view, isStudent}) => {
    const [openImprovements, setOpenImprovements] = useState(false);
    const [openAskedFields, setOpenAskedFields] = useState(false);
    const [openUpdates, setOpenUpdates] = useState(false); // State for updates

    const [improvementRequests, setImprovementRequest] = useState(null)
    const [loadingRequest, setLoadingRequests] = useState(true)
    const [askedFields, setAskedFields] = useState(null)
    const [loadingAsked, setLoadingAsked] = useState(true)
    const [updates, setUpdates] = useState(null);
    const [loadingUpdates, setLoadingUpdates] = useState(true);
    const fetchImprovements = async (key, setLoading, setData) => {
        setLoading(true);
        route = !isStudent ? route : 'student/applications'
        const response = await getData({url: `${route}/${item.id}/${key}`, setLoading: setLoading})
        if (response.data) {
            key = key === "asked" ? "askedFields" : key === "updates" ? "updates" : "improvementRequests"
            setData(response.data[key]);
        }
    };
    useEffect(() => {
        if (openImprovements && !improvementRequests) {
            fetchImprovements("improvements", setLoadingRequests, setImprovementRequest)
        }
    }, [openImprovements])
    useEffect(() => {
        if (openAskedFields && !askedFields) {
            fetchImprovements("asked", setLoadingAsked, setAskedFields)
        }
    }, [openAskedFields])
    useEffect(() => {
        if (openUpdates && !updates) {
            fetchImprovements("updates", setLoadingUpdates, setUpdates)
        }
    }, [openUpdates]);
    const renderImprovementRequests = () => {
        if (loadingRequest) return <CircularProgress/>
        return improvementRequests?.length > 0 ? (
              improvementRequests.map((request, index) => (
                    <Card key={index} variant="outlined" sx={{my: 2, p: 2}}>
                        <Typography fontWeight="bold">العنوان: {request.title}</Typography>
                        <Typography>الرسالة: {request.message}</Typography>
                        <Typography>الحالة: {FieldStatus[request.status]}</Typography>
                    </Card>
              ))
        ) : (
              <Typography>لا يوجد طلبات تحسين حقول </Typography>
        );
    };
    const renderAskedFields = () => {
        if (loadingAsked) return <CircularProgress/>
        return askedFields?.length > 0 ? (
              askedFields.map((field, index) => (
                    <Card key={index} variant="outlined" sx={{my: 2, p: 2}}>
                        <Typography fontWeight="bold">العنوان: {field.title}</Typography>
                        <Typography>الرسالة: {field.message}</Typography>
                        <Typography>الحالة: {FieldStatus[field.status]}</Typography>
                        <Typography>نوع الطلب: {FieldType[field.type]}</Typography>
                        {field.type === "FILE" ?
                              <>
                                  {renderFileLink(field.value, "الملف")}
                              </>
                              : <Typography>الرد: {field.value || "لم يتم الرد بعد"}</Typography>
                        }
                    </Card>
              ))
        ) : (
              <Typography>لا يوجد طلبات اضافه تحسينات جديده</Typography>
        );
    };

    const renderUpdates = () => {
        if (loadingUpdates) return <CircularProgress/>;
        return <>
            {isStudent &&
                  <CreateNewUpdate setData={setUpdates} appId={item.id}/>
            }
            {updates?.length > 0 ? (
                  updates.map((update, index) => (
                        <Card key={index} variant="outlined" sx={{
                            my: 3,
                            p: 3,
                            backgroundColor: "#f9fafc", // Light background for distinction
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)", // Subtle shadow for elevation

                        }}
                        >
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>

                                <Typography fontWeight="bold">العنوان: {update.title || "بدون عنوان"}</Typography>
                                <Typography>الوصف: {update.description || "لا يوجد وصف"}</Typography>
                                {renderFileLink(update.url, "الملف المرفق")}
                                <Typography
                                      color="textSecondary"
                                      sx={{
                                          display: "flex",
                                          alignItems: "center",
                                      }}
                                >
                                    <DateIcon sx={{mr: 1}}/>
                                    {dayjs(update.createdAt).format("DD/MM/YYYY")}
                                </Typography>
                            </Box>
                        </Card>
                  ))
            ) : (
                  <Typography>لا يوجد تحديثات</Typography>
            )
            }
        </>
    };
    return (
          <Box>
              {(view || isStudent) &&
                    <Box my={2}>
                        <Button
                              variant="contained"
                              onClick={() => setOpenUpdates(!openUpdates)}
                              endIcon={openUpdates ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                              sx={{mb: 2}}
                        >
                            {openUpdates ? "إخفاء التحديثات" : "عرض  تحديثات الطالب"}
                        </Button>
                        <Collapse in={openUpdates}>
                            <Card variant="outlined" sx={{p: 3}}>
                                <Typography variant="h5" fontWeight="bold" sx={{mb: 2}}>
                                    تحديثات تم اضافتها من قبل الطالب ( بعد قبول منحته )
                                </Typography>
                                <Divider sx={{mb: 2}}/>
                                {renderUpdates()}
                            </Card>
                        </Collapse>
                    </Box>
              }
              {!isStudent &&
                    <Alert severity="info" my={2}>ملحوظه التعديلات التي بالاسفل انت او الادمن ارسل طلب الي الطالب
                        لتعديلها
                        سواء علي
                        حقل معين او اضافه
                        جديده تمام</Alert>
              }
              <Box my={2}>
                  <Button
                        variant="contained"
                        onClick={() => setOpenImprovements(!openImprovements)}
                        endIcon={openImprovements ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        sx={{mb: 2}}

                  >
                      {openImprovements ? "إخفاء طلبات تحسين حقول موجوده من قبل" : "عرض طلبات تحسين حقول موجوده من قبل"}
                  </Button>
                  <Collapse in={openImprovements}>
                      <Card variant="outlined" sx={{p: 3}}>
                          <Typography variant="h5" fontWeight="bold" sx={{mb: 2}}>
                              طلبات تحسين حقول موجود من قبل
                          </Typography>
                          <Divider sx={{mb: 2}}/>
                          {renderImprovementRequests()}
                      </Card>
                  </Collapse>
              </Box>

              <Box my={2}>
                  <Button
                        variant="contained"
                        onClick={() => setOpenAskedFields(!openAskedFields)}
                        endIcon={openAskedFields ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        sx={{mb: 2}}

                  >
                      {openAskedFields ? "إخفاء طلبات اضافه تحسينات جديده" : "عرض طلبات اضافه تحسينات جديده"}
                  </Button>
                  <Collapse in={openAskedFields}>
                      <Card variant="outlined" sx={{p: 3}}>
                          <Typography variant="h5" fontWeight="bold" sx={{mb: 2}}>
                              طلبات اضافه تحسينات جديده
                          </Typography>
                          <Divider sx={{mb: 2}}/>
                          {renderAskedFields()}
                      </Card>
                  </Collapse>
              </Box>
          </Box>
    );
};

function CreateNewUpdate({appId, setData}) {
    const [error, setError] = useState(null)

    const {setLoading} = useToastContext()
    const [rerender, setRerender] = useState(false)

    async function handleBeforeUpdate(url) {
        const formData = new FormData()
        formData.append("url", url[0]);

        const request = await handleRequestSubmit(formData, setLoading, "upload", true, "جاري رفع  ملفك")
        if (request.status === 200)
            return request.data
    }

    async function submit(data) {
        const {url, description, title} = data
        if (!title || !description && !url) {
            setError("يجب عليك ملئ جميع الحقول")
            return
        }
        const newUrl = await handleBeforeUpdate(url)
        const request = await handleRequestSubmit({
            title, description, url: newUrl.url
        }, setLoading, `student/applications/${appId}/updates`, false, "جاري اضافة التحديث")
        if (request.status === 200) {
            setData((oldData) => ([...oldData, request.data]))
            setRerender(true)
        }
    }

    const inputs = [
        {
            data: {id: "title", type: "text", label: "عنوان التحديث"},
            pattern: {
                required: {value: true, message: "يجب عليك ادخال عنوان للتحديث"}
            }
        },
        {
            data: {id: "description", type: "textarea", label: "تفاصيل التحديث"}
            ,
            pattern: {
                required: {value: true, message: "يجب عليك ادخال عنوان تفاصيل"}
            }
        },
        {
            data: {id: "url", type: "file", label: "مرفق"},
            pattern: {
                required: {value: true, message: "يجب عليك ادخال مرفق"}
            }
        },
    ]
    return (
          <>
              <DrawerWithContent
                    extraData={{
                        label: "اضافة تحديث علي الطلب",
                        onSubmit: submit,
                        inputs: inputs,
                        formTitle: "اضافة تحديث جديد",
                        btnText: "اضافة",
                        variant: "outlined"
                    }}
                    rerender={rerender}
                    component={Form}
              >
              </DrawerWithContent>
              {error &&
                    <Snackbar
                          open={!!error}
                          autoHideDuration={6000}
                          sx={{zIndex: 500000000}}
                          onClose={() => setError(null)}
                    >
                        <MuiAlert
                              onClose={() => setError(null)}
                              severity="error"
                              elevation={6}
                              variant="filled"
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
              }
          </>
    )
}

function RenderActionsButtons({isAdmin, route, appId, onClose, setData, item, view, application}) {
    return (
          <>
              <Alert severity="warning">
                  تحذير: في حالة طلب تحديثات سيتم تعديل الطلب الي غير مكتمل
              </Alert>
              <Box display="flex" gap={2} alignItem="center" flexWrap="wrap" mt={4}>
                  {isAdmin && !view &&
                        <>
                            <ApproveByAdmin route={route} setData={setData} appId={appId} onClose={onClose}
                                            application={application}/>
                            <MarkUnderReview route={route} setData={setData} appId={appId} onClose={onClose}/>
                        </>
                  }
                  {!isAdmin && !view &&
                        <ApproveBySupervisor route={route} setData={setData} appId={appId} onClose={onClose}/>}
                  <DrawerWithContent item={item} component={MarkAsUnCompleteAndAskForImprovement}
                                     extraData={{
                                         route: route,
                                         label: "طلب تعديل حقول نموذج معين",
                                         setData: setData,
                                         appId: item.id,
                                         otherOnClose: onClose,
                                         improvement: true
                                     }}/>
                  <DrawerWithContent item={item} component={MarkAsUnCompleteAndAskForImprovement}
                                     extraData={{
                                         route: route,
                                         label: "طلب اضافة تحسينات",
                                         setData: setData,
                                         appId: item.id,
                                         otherOnClose: onClose
                                     }}/>

                  {!view &&
                        <RejectApplication route={route} setData={setData} appId={appId} onClose={onClose}/>
                  }
              </Box>
          </>
    )
}

function ApproveByAdmin({route, appId, onClose, setData, application}) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()

    async function confirm() {
        if (!user && !application.supervisorId) {
            setError("يجب ان تختار مشرف حتي تتم عملية الموافقه علي الطلب")
            return
        }
        const request = await handleRequestSubmit({
            supervisorId: user.query?.id,
            action: "approve",
            notAdmin: application.supervisorId
        }, setLoading, `${route}/${appId}`, false, "جاري الموافقه علي الطلب")
        if (request.status === 200) {
            setData((oldData) => oldData.filter((item) => item.id !== appId))
            onClose()
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"الموافقة علي الطلب"}
                    handleConfirm={confirm}
                    title={"تعين مشرف والموافقه علي الطلب"}
                    removeAfterConfirm={true}
              >
                  {!application.supervisorId &&
                        <SearchComponent
                              apiEndpoint="search?model=user"
                              setFilters={setUser}
                              inputLabel="  ابحث بالاسم او الايميل لاختيار مشرف"
                              renderKeys={["personalInfo.basicInfo.name", "email"]}
                              mainKey="email"
                              localFilters={{role: "SUPERVISOR"}}
                        />
                  }
              </ConfirmWithActionModel>
              {error &&
                    <Snackbar
                          open={!!error}
                          autoHideDuration={6000}
                          sx={{zIndex: 500000000}}
                          onClose={() => setError(null)}
                    >
                        <MuiAlert
                              onClose={() => setError(null)}
                              severity="error"
                              elevation={6}
                              variant="filled"
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
              }
          </>
    )
}

function ApproveBySupervisor({route, appId, onClose, setData}) {
    const {setLoading} = useToastContext()

    async function confirm() {
        const request = await handleRequestSubmit({
            action: "approve", notAdmin: true,
        }, setLoading, `${route}/${appId}`, false, "جاري الموافقه علي الطلب")
        if (request.status === 200) {
            setData((oldData) => oldData.filter((item) => item.id !== appId))
            onClose()
            return request
        }
    }

    return (
          <ConfirmWithActionModel
                label={"الموافقة علي الطلب"}
                handleConfirm={confirm}
                title={"الموافقه علي الطلب"}
                removeAfterConfirm={true}
          />

    )
}

function RejectApplication({route, appId, onClose, setData}) {
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()
    const [rejectReason, setRejectReason] = useState(null)

    async function reject() {
        if (!rejectReason) {
            setError("يجب ان تكتب سبب الرفض")
            return
        }
        const request = await handleRequestSubmit({
            rejectReason,
            action: "reject"
        }, setLoading, `${route}/${appId}`, false, "جاري رفض الطلب")
        console.log(request, "request")
        if (request.status === 200) {
            setData((oldData) => oldData.filter((item) => item.id !== appId))
            onClose()
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"رفض الطلب"}
                    handleConfirm={reject}
                    title={"رفض الطلب وذكر سبب الرفض"}
                    removeAfterConfirm={true}
                    isDelete={true}
              >
                  <TextField
                        id="reject"
                        fullWidth
                        margin="normal"
                        label="سبب الرفض"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required
                  />
              </ConfirmWithActionModel>
              {error &&
                    <Snackbar
                          open={!!error}
                          autoHideDuration={6000}
                          sx={{zIndex: 500000000}}

                          onClose={() => setError(null)}
                    >
                        <MuiAlert
                              onClose={() => setError(null)}
                              severity="error"
                              elevation={6}
                              variant="filled"
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
              }
          </>
    )
}

function MarkAsUnCompleteAndAskForImprovement({route, appId, onClose, setData, otherOnClose, improvement = false}) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] = useState("TEXT");
    const [error, setError] = useState("");
    const [askFields, setAskFields] = useState([]);
    const [editIndex, setEditIndex] = useState(null); // To track editing
    const {setLoading} = useToastContext()
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !message || (!type && !improvement)) {
            setError("جميع الحقول مطلوبة");
            return;
        }
        const newField = {title, message, type};
        if (editIndex !== null) {
            const updatedFields = [...askFields];
            updatedFields[editIndex] = newField;
            setAskFields(updatedFields);
            setEditIndex(null); // Reset edit index
        } else {
            setAskFields([...askFields, newField]);
        }
        setTitle("");
        setMessage("");
        setType("TEXT");
    };

    const handleEdit = (index) => {
        const field = askFields[index];
        setTitle(field.title);
        setMessage(field.message);
        setType(field.type);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedFields = askFields.filter((_, i) => i !== index);
        setAskFields(updatedFields);
    };

    const handleSubmitAll = async () => {
        if (askFields.length === 0) {
            setError("يجب إضافة حقول قبل الإرسال");
            return;
        }
        const request = await handleRequestSubmit({
            askFields,
            action: !improvement ? "uncomplete" : "uncomplete_with_edit"
        }, setLoading, `${route}/${appId}`, false, "جاري تعين هذا الطلب كغير مكتمل")
        if (request.status === 200) {
            setData((oldData) => oldData.filter((item) => item.id !== appId))
            onClose()
            otherOnClose()
        }
    };

    return (
          <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    width: "100%",
                    maxWidth: "800px",
                    mx: "auto",
                    mt: 4,
                    boxShadow: 2,
                }}
          >

              <Typography variant="h5" gutterBottom>
                  {!improvement ?
                        "إضافة طلبات تحسينات" : "طلب تعديل حقول معينه"}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                  {!improvement ?
                        "اكتب ملخص لما تريد اضافته يمكنك اضافة اكثر من طلب" : "اكتب اسم النموذج الذي تريد من الطالب تعديله في العنوان مع ذكر اي حقل تريد تعديله والتفاصيل في الرساله"}
              </Typography>
              <TextField
                    fullWidth
                    margin="normal"
                    label="العنوان"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
              />
              <TextField
                    fullWidth
                    margin="normal"
                    label="الرسالة"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    multiline
                    rows={4}
              />
              {!improvement &&
                    <TextField
                          select
                          fullWidth
                          margin="normal"
                          label="نوع الطلب"
                          helperText={"هل تريد من الطلب رفع ملف ام اجابة عن الحقل فقط"}
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                    >
                        <MenuItem value="TEXT">نص</MenuItem>
                        <MenuItem value="FILE">ملف</MenuItem>
                    </TextField>
              }
              {error && (
                    <Snackbar
                          open={!!error}
                          autoHideDuration={6000}
                          onClose={() => setError(null)}
                    >
                        <MuiAlert
                              onClose={() => setError(null)}
                              severity="error"
                              elevation={6}
                              variant="filled"
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
              )}

              <Button variant="contained" color="primary" fullWidth type="submit">
                  {editIndex !== null ? "تحديث" : "إضافة طلب جديد"}
              </Button>

              {/* Render the saved ask fields */}
              {askFields.length > 0 && (
                    <Box mt={4}>
                        <Typography variant="h6">الطلبات المحفوظة:</Typography>
                        {askFields.map((field, index) => (
                              <Card
                                    key={index}
                                    variant="outlined"
                                    sx={{mb: 2, p: 2, position: "relative"}}
                              >
                                  <CardContent>
                                      <Typography>عنوان بسيط: {field.title}</Typography>
                                      <Typography>الطلب: {field.message}</Typography>
                                      <Typography>النوع: {field.type === "TEXT" ? "نص" : "ملف"}</Typography>
                                  </CardContent>
                                  <Box
                                        sx={{position: "absolute", top: "10px", right: "10px", display: "flex", gap: 1}}
                                  >
                                      <IconButton
                                            aria-label="edit"
                                            onClick={() => handleEdit(index)}
                                      >
                                          <EditIcon/>
                                      </IconButton>
                                      <IconButton
                                            aria-label="delete"
                                            onClick={() => handleDelete(index)}
                                      >
                                          <DeleteIcon/>
                                      </IconButton>
                                  </Box>
                              </Card>
                        ))}
                    </Box>
              )}

              <Button
                    variant="contained"
                    color="secondary"
                    disables={askFields.length === 0}
                    fullWidth
                    onClick={handleSubmitAll}
                    sx={{mt: 2}}
              >
                  إرسال جميع الطلبات
              </Button>

          </Box>
    );
}


function MarkUnderReview({route, appId, onClose, setData}) {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const {setLoading} = useToastContext()

    async function review() {
        if (!user) {
            setError("يجب ان تختار مشرف حتي تتم تعين مشرف لمراجعة الطلب")
        }
        const request = await handleRequestSubmit({
            supervisorId: user.query.id,
            action: "review"
        }, setLoading, `${route}/${appId}`, false, "جاري تعين مشرف")
        if (request.status === 200) {
            setData((oldData) => oldData.filter((item) => item.id !== appId))
            onClose()
            return request
        }
    }

    return (
          <>
              <ConfirmWithActionModel
                    label={"تعين مشرف للمراجعة"}
                    handleConfirm={review}
                    title={"تعين مشرف لمراجعة الطلب"}
                    removeAfterConfirm={true}
                    color="warning"
              >
                  <SearchComponent
                        apiEndpoint="search?model=user"
                        setFilters={setUser}
                        inputLabel="  ابحث بالاسم او الايميل لاختيار مشرف"
                        renderKeys={["personalInfo.basicInfo.name", "email"]}
                        mainKey="email"
                        localFilters={{role: "SUPERVISOR"}}
                  />
              </ConfirmWithActionModel>
              {error &&
                    <Snackbar
                          open={!!error}
                          autoHideDuration={6000}
                          onClose={() => setError(null)}
                          sx={{zIndex: 500000000}}

                    >
                        <MuiAlert
                              onClose={() => setError(null)}
                              severity="error"
                              elevation={6}
                              variant="filled"
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
              }
          </>
    )
}


