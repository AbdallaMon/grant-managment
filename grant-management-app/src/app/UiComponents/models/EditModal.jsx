import React from 'react';
import {Box, Fade, Modal} from '@mui/material';
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {simpleModalStyle} from "@/app/helpers/constants";
import {Form} from "@/app/UiComponents/formComponents/forms/Form";

const EditModal = ({open, handleClose, item, inputs, setData, href, checkChanges = false}) => {
    const {setLoading} = useToastContext()


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
        const result = await handleRequestSubmit(dataToSubmit, setLoading, `${href}/${item.id}`, false, "Updating...", null, "PUT");
        if (result.status === 200) {
            setData((prevData) => prevData.map((dataItem) => dataItem.id === result.data.id ? result.data : dataItem));
            handleClose();
        }
    };
    const prefilledInputs = inputs.map(input => ({
        ...input,
        data: {
            ...input.data,
            defaultValue: item[input.data.id] ?? input.data.defaultValue,
        }
    }));

    return (
          <>

              <Modal
                    open={open}
                    onClose={handleClose}
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
                                        // options: options[input.data.id],
                                        defaultValue: input.data.parentId ? item[input.data.parentId]?.id : item[input.data.id]
                                    }


                                }))}
                                formTitle={`Edit ${item.title || item.name || item.id}`}
                                btnText="Save Changes"
                          >
                          </Form>

                      </Box>
                  </Fade>
              </Modal>

          </>
    );
};


export default EditModal;
