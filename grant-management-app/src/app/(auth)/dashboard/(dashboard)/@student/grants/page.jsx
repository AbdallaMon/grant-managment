"use client";
import {
    Box,
    Button,
    Typography,
    Card,
    CardContent, Modal, Fade,
} from "@mui/material";
import Grid from "@mui/material/grid2"
import FullScreenLoader from "@/app/UiComponents/feedback/loaders/FullscreenLoader";
import useDataFetcher from "@/app/helpers/hooks/useDataFetcher";
import PaginationWithLimit from "@/app/UiComponents/DataViewer/PaginationWithLimit";
import ErrorMessage from "@/app/UiComponents/DataViewer/ErrorMessage";
import DeleteModal from "@/app/UiComponents/models/DeleteModal";
import {simpleModalStyle} from "@/app/helpers/constants";
import React, {useState} from "react";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {useRouter} from "next/navigation";
import Link from "next/link";


export default function UserGrantsPage() {
    const {
        data: applications,
        loading,
        setData,
        page,
        setPage,
        totalPages,
        limit,
        setLimit,
        total,
        error
    } = useDataFetcher("student/applications", false);
    if (loading) return <FullScreenLoader/>; // Display loading spinner
    return (
          <Box sx={{p: 4}}>
              <Typography variant="h4" gutterBottom>
                  طلبات المنح
              </Typography>
              <CreateNewAppModel/>
              {!loading && applications && applications.length === 0 && <Typography>
                  ليس هناك اي طلبات للمنح
              </Typography>}
              {error && <ErrorMessage error={error}/>}
              <Grid container spacing={2}>
                  {applications.map((app, index) => (
                        <Grid size={{xs: 12, md: 6, xl: 4}} key={app.id}>
                            <ApplicationCard app={app} setData={setData} index={index}/>
                        </Grid>
                  ))}
              </Grid>
              <PaginationWithLimit total={total} limit={limit} page={page} setLimit={setLimit} setPage={setPage}
                                   totalPages={totalPages}/>


          </Box>
    );
}

function CreateNewAppModel() {
    const [open, setOpen] = useState(false)
    const {setLoading} = useToastContext()
    const router = useRouter()

    async function handleSubmit() {
        const response = await handleRequestSubmit({}, setLoading, "student/applications/draft", false, "جاري الانشاء وسيتم تحويلك بعد لحظات")
        if (response.status === 200) {
            const id = response.id
            router.push("/dashboard/applications/drafts/" + id)
        }
    }

    function handleClose() {
        setOpen(false)
    }

    if (!open) return (
          <Button variant="contained" color="primary" sx={{mb: 3}} onClick={() => setOpen(true)}>
              إنشاء طلب منحة جديد
          </Button>
    )
    return (
          <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
          >
              <Fade in={open}>
                  <Box sx={{...simpleModalStyle}}>
                      <Typography variant="h6" component="h2">
                          هل انت متاكد انك تريد انشاء طلب جديد؟
                      </Typography>
                      <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
                          <Button variant="contained" color="primary"
                                  onClick={handleSubmit}>
                              نعم
                          </Button>
                          <Button variant="contained" onClick={handleClose} sx={{marginLeft: '8px'}} color="error">
                              الغاء
                          </Button>
                      </Box>
                  </Box>
              </Fade>
          </Modal>
    )
}

function ApplicationCard({app, setData, index}) {
    let content;

    switch (app.status) {
        case "PENDING":
            content = (
                  <Box>
                      <Typography mb={1}>
                          هذا الطلب معلق حاليًا ولم يتم تعيين مشرف بعد.</Typography>
                      <Button variant="outlined" color="primary" href={`/dashboard/application/view/${app.id}`}
                              component={Link}>
                          عرض الطلب
                      </Button>
                  </Box>
            );
            break;
        case "UNDER_REVIEW":
            content = (
                  <Box>
                      <Typography mb={1}>
                          طلبك قيد المراجعة من قبل المشرف. سيتم إشعارك عند الانتهاء.
                      </Typography>
                      <Button variant="outlined" color="primary" href={`/dashboard/application/view/${app.id}`}
                              component={Link}>
                          عرض الطلب
                      </Button>
                  </Box>
            );
            break;
        case "REJECTED":
            content = (
                  <Box>
                      <Typography color="error" mb={1}>تم رفض الطلب.</Typography>
                      <Typography variant="body2">السبب: {app.rejectReason}</Typography>
                  </Box>
            );
            break;
        case "DRAFT":
            content = (
                  <Box>
                      <Typography color="textSecondary" mb={1}>هذا الطلب مسودة ولم يتم تقديمه بعد.</Typography>
                      <Box sx={{
                          display: "flex"
                      }} gap={2}>

                          <Button variant="outlined" color="primary" href={`/dashboard/applications/drafts/${app.id}`}
                                  component={Link}>
                              اكمال بيانات الطلب
                          </Button>
                          <DeleteModal
                                href={"student/applications/draft"}
                                setData={setData}
                                item={app}
                          />
                      </Box>

                  </Box>
            );
            break;
        case "APPROVED":
            content = (
                  <Box>
                      {app.userGrants?.id ? (
                            <>
                                <Typography>تم قبول الطلب .</Typography>
                                <Button variant="contained" color="success"
                                        href={`/dashboard/grants/${app.userGrants.id}`}
                                        component={Link}
                                >
                                    عرض المنحة
                                </Button>
                            </>
                      ) : (
                            <Typography>تم قبول الطلب وسيتم إنشاء منحة قريبًا.</Typography>
                      )}
                  </Box>
            );
            break;
        case "UN_COMPLETE":
            content = (
                  <Box>
                      <Typography color="warning">
                          هذا الطلب غير مكتمل. تحتاج إلى إعادة تحميل بعض المستندات أو إجراء تغييرات.
                      </Typography>
                      <Button variant="outlined" color="primary" href={`/dashboard/application/uncomplete/${app.id}`}
                              component={Link}
                      >
                          تعديل الطلب غير المكتمل
                      </Button>
                  </Box>
            );
            break;
        default:
            content = <Typography>حالة غير معروفة.</Typography>;
            break;
    }

    return (
          <Card sx={{mb: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
              <CardContent>
                  <Typography variant="h6">{index + 1} - معرف الطلب : #{app.id}</Typography>
                  {content}
              </CardContent>
          </Card>
    );
}
