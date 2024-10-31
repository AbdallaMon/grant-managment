import {Box, Button, Fade, Modal, Typography} from "@mui/material";
import {simpleModalStyle} from "@/app/helpers/constants";
import React, {useState} from "react";

export default function ConfirmWithActionModel({
                                                   children,
                                                   title,
                                                   isDelete,
                                                   handleConfirm,
                                                   removeAfterConfirm = true,
                                                   label, color
                                               }) {
    const [open, setOpen] = useState(false)

    async function handleAfterConfirm() {
        const confirm = await handleConfirm()
        if (!confirm || confirm.status !== 200) return
        if (removeAfterConfirm) setOpen(false)
    }

    if (!open) return (
          <Button
                variant="contained"
                color={color ? color : isDelete ? "error" : "secondary"}
                onClick={() => setOpen(true)}
                sx={{textTransform: 'none'}}
          >
              {label}
          </Button>
    )
    return (
          <Modal
                open={open}
                onClose={() => setOpen(false)}
                closeAfterTransition
          >
              <Fade in={open}>
                  <Box sx={{...simpleModalStyle}}>
                      <Typography variant="h6" component="h2" mb={2}>
                          {title}
                      </Typography>
                      {children}
                      <Box sx={{display: 'flex', justifyContent: 'flex-end', marginTop: '16px'}}>
                          <Button variant="contained" color={isDelete ? "error" : "secondary"}
                                  onClick={handleAfterConfirm}>
                              تاكيد
                          </Button>
                          <Button variant="contained" onClick={() => setOpen(false)} sx={{marginLeft: '8px'}}>
                              الغاء
                          </Button>
                      </Box>
                  </Box>

              </Fade>
          </Modal>
    )
}