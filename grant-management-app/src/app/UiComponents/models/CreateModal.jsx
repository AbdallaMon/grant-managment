import React, {useState} from "react";
import {

    Box,
    Button,
    Fade,
    Modal,
} from "@mui/material";
import {useToastContext} from "@/app/providers/ToastLoadingProvider";
import {handleRequestSubmit} from "@/app/helpers/functions/handleSubmit";
import {simpleModalStyle} from "@/app/helpers/constants";
import {Form} from "@/app/UiComponents/formComponents/forms/Form";


const CreateModal = ({
                         setData,
                         label,
                         inputs,
                         handleBeforeSubmit,
                         href,
                         extraProps, handleSubmit, setTotal, BtnColor = "secondary", extraSubmitData
                     }) => {
    const [open, setOpen] = useState(false);
    const {setLoading} = useToastContext()


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const onSubmit = async (formData) => {
        if (extraProps.extraId) {
            href = `${href}?extraId=${extraProps.extraId}`
        }
        if (handleBeforeSubmit) {
            formData = await handleBeforeSubmit(formData)
        }
        if (extraSubmitData) {
            formData = {...formData, ...extraSubmitData}
        }
        const result = await handleRequestSubmit(formData, setLoading, `${href}`, false, "جاري الانشاء");
        if (result.status === 200) {
            if (handleSubmit) {
                handleSubmit(result.data);
            } else {
                if (setData) {
                    setData((prevData) => [...prevData, result.data]);
                }
                if (setTotal) {
                    setTotal((prev) => prev + 1)
                }
                handleClose();
            }
        }

    };

    return (
          <>
              <>
                  <Button variant="contained" color={BtnColor} onClick={handleOpen} sx={{
                      width: "100%", display: "flex", m: "auto"
                  }}
                  >
                      {label}
                  </Button>
              </>
              <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        z: 999,
                    }}
              >
                  <Fade in={open}>
                      <Box sx={{...simpleModalStyle}}>
                          <Form
                                onSubmit={onSubmit}
                                inputs={inputs}
                                {...extraProps}
                          >
                          </Form>
                      </Box>
                  </Fade>
              </Modal>
          </>
    );
};


export default CreateModal;

