import { Modal, Box, Typography, Button } from "@mui/material";
import { modalStyle } from "./modalStyle";

const CheckModal = ({entityname, handleDelete, open, setOpen}) => {

    return (
        <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
            <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Czy na pewno usunąć {entityname} ?
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2}}>
                    <Button 
                        onClick={() => {
                            handleDelete()
                            setOpen(false)
                        }}
                        variant="contained"
                        color="error">
                            Usuń
                    </Button>
                </Typography>
            </Box>
        </Modal>
    )
  }

export default CheckModal