import React, {useState} from 'react';
import {Box, Button, Fade, Modal} from '@mui/material';
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {simpleModalStyle} from "@/app/helpers/constants";
import {Form} from "@/app/UiComponents/formComponents/forms/Form";

const EditModal = ({
                       editButtonText,
                       handleClose,
                       item,
                       inputs,
                       setData,
                       href,
                       checkChanges = false,
                       handleBeforeSubmit
                   }) => {
    const {setLoading} = useToastContext()
    const [open, setOpen] = useState(false)

    const handleEditOpen = () => {
        setOpen(true);
    };
    const onSubmit = async (formData) => {
        let dataToSubmit = formData;
        if (checkChanges) {
            dataToSubmit = {};
            for (let key in formData) {
                if (formData[key] !== item[key]) {
                    dataToSubmit[key] = formData[key];
                }
            }
        }
        if (handleBeforeSubmit) dataToSubmit = await handleBeforeSubmit(formData)

        const result = await handleRequestSubmit(dataToSubmit, setLoading, `${href}/${item.id}`, false, "جاري التعديل", null, "PUT");
        if (result.status === 200) {
            if (setData) {
                setData((prevData) => prevData.map((dataItem) => dataItem.id === result.data.id ? result.data : dataItem));
            }
            if (handleClose) {
                handleClose();
            }
            setOpen(false)
        }
    };
    const prefilledInputs = inputs.map(input => ({
        ...input,
        data: {
            ...input.data,
            defaultValue: item[input.data.id] ?? input.data.defaultValue,
        }
    }));
    if (!open) return (
          <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditOpen(item)}
                sx={{textTransform: 'none'}}
          >
              {editButtonText}
          </Button>
    )
    return (
          <>

              <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    closeAfterTransition
              >
                  <Fade in={open}>
                      <Box sx={{...simpleModalStyle}}>
                          <Form
                                onSubmit={onSubmit}
                                inputs={prefilledInputs.map(input => ({
                                    ...input,
                                    data: {
                                        ...input.data,
                                        defaultValue: input.data.parentId ? item[input.data.parentId]?.id : item[input.data.id]
                                    }
                                }))}
                                formTitle={`تعديل ${item.title || item.name || item.id}`}
                                btnText="حفظ التغيرات"
                          >
                          </Form>

                      </Box>
                  </Fade>
              </Modal>

          </>
    );
};


export default EditModal;
