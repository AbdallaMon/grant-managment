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
              <div className={"px-2 mb-1 mt-2"}>
                  <Button variant="contained" color={BtnColor} onClick={handleOpen}>
                      {label}
                  </Button>
              </div>
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
