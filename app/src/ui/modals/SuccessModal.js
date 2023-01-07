import { Modal, Box, Typography } from "@mui/material";
import { useState } from "react";
import { modalStyle } from "./modalStyle";

const ErrorModal = ({error}) => {
    const [open, setOpen] = useState(false)
    
    return (
        <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {error.name}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2}}>
                    {error.message}; try refreshing
                </Typography>
            </Box>
        </Modal>
    )
  }

export default ErrorModal