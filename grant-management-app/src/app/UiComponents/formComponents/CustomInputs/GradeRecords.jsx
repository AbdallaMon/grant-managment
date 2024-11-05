import {Fragment, useEffect, useState} from "react";
import {Alert, Button, Grid2 as Grid, Snackbar, Typography} from "@mui/material";
import MuiInputField from "@/app/UiComponents/formComponents/MUIInputs/MuiInputField";
import MuiFileField from "@/app/UiComponents/formComponents/MUIInputs/MuiFileField";
import {MdDelete as DeleteIcon} from "react-icons/md";

const textInput = {
    data: {
        label: "سجل الدرجات للسنة الواحدة",
        type: "text",
        required: true
    }, size: {
        xs: 12, md: 6
    },
    pattern: {
        required: {value: true, message: "هذه الخانة  مطلوبة"},
    },
}
const fileInput = {
    data: {
        label: "كشف الدرجات للسنة الواحدة",
        type: "file",
        required: true
    }, size: {
        xs: 12, md: 6
    },
    pattern: {
        required: {value: true, message: "هذه الخانة  مطلوبة"},
    },
}

export function GradeRecords({register, watch, setValue, errors, control, data}) {
    const [items, setItems] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        if (data && data.gradeRecords && data.gradeRecords.length > 0) {
            setItems(data.gradeRecords);
        } else {
            setItems([{description: "سجل درجات السنة رقم 1", url: "", uniqueId: Date.now()}]);
        }
    }, [data]);

    const addNewField = () => {
        const newItem = {
            description: `سجل درجات السنة رقم ${items.length + 1}`,
            url: "",
            uniqueId: Date.now(),
        };
        setItems((items) => [...items, newItem]);
    };

    const deleteAField = (index) => {
        const actualItems = items.filter((item) => !item.deleted)
        if (actualItems.length === 1) {
            setShowAlert(true); // Show alert if trying to delete the last item
            return;
        }

        setItems((prevItems) =>
              prevItems.map((item, i) => {
                  if (i === index) {
                      const fileKey = index.toString() + "_file";
                      const textKey = index.toString() + "_text";
                      const previewKey = index.toString() + "_url";

                      setValue(fileKey, null);
                      setValue(previewKey, null);
                      setValue(textKey, null);
                      item.deleted = true;
                  }
                  return item;
              })
        );
    };

    return (
          <>
              <Typography variant="h6" gutterBottom>
                  سجل درجات السنوات الأكاديمية
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                  الرجاء رفع ملف لكل سنة دراسية يحتوي على كشف درجات السنة.
                  {items.length > 0 && ` حاليًا لديك ${items.length} سنة(سنوات) مدرجة.`}
              </Typography>


              {items.map((item, index) => {
                  if (item.deleted) return null;

                  let itemTextInput = {
                      ...textInput,
                      data: {...textInput.data, id: index + "_text", defaultValue: item.description}
                  };
                  let itemFileInput = {
                      ...fileInput,
                      data: {...fileInput.data, id: index + "_file"},
                      preview: item.url
                  };

                  return (
                        <Fragment key={item.id || item.uniqueId}>
                            <Grid container spacing={2} style={{marginBottom: '1rem'}}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <MuiInputField
                                          errors={errors}
                                          input={itemTextInput}
                                          register={register}
                                          setValue={setValue}
                                          watch={watch}
                                          variant="outlined"
                                    />
                                    {item.url && (
                                          <input {...register(`${index}_url`)} value={item.url} type="hidden"
                                                 style={{display: "none"}}/>
                                    )}
                                </Grid>
                                <Grid size={{xs: 12, md: 6}}>
                                    <MuiFileField
                                          setValue={setValue}
                                          register={register}
                                          input={itemFileInput}
                                          errors={errors}
                                          control={control}
                                          variant="outlined"
                                          noValue={true}
                                    />
                                </Grid>
                                <Button
                                      variant="contained"
                                      color="secondary"
                                      startIcon={<DeleteIcon/>}
                                      onClick={() => deleteAField(index)}
                                      style={{marginLeft: "1rem"}}
                                >
                                    حذف السجل
                                </Button>
                            </Grid>
                        </Fragment>
                  );
              })}


              <Snackbar
                    open={showAlert}
                    autoHideDuration={6000}
                    onClose={() => setShowAlert(null)}
              >
                  <Alert
                        onClose={() => setShowAlert(null)}
                        severity="warning"
                        elevation={6}
                        variant="filled"
                  >
                      عليك ادخال عام دراسي واحد على الأقل
                  </Alert>
              </Snackbar>

              <Button
                    variant="contained"
                    color="primary"
                    onClick={addNewField}
                    style={{marginTop: "1rem"}}
              >
                  إضافة سنة جديدة
              </Button>
          </>
    );
}
