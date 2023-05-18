import { Button, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useNavigate } from "react-router"

export const AdminActions = () => {

    const navigate = useNavigate()

    const handleInsertDataButton = () => {
        navigate("/admin-actions/insert-data");
    }

    const handleChangeRoleButton = () => {
        navigate("/admin-actions/users");
    }
 
    return (<Container maxWidth="xs" sx={{marginTop:"5%"}}>
        <Typography variant="h4" marginBottom={"10%"}>What do you want to do?</Typography>
        <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{marginBottom: "4%", height: "6vh"}}
            onClick={handleInsertDataButton}
        >
            Insert Random Data
        </Button>
        <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{marginBottom: "4%", height: "6vh"}}
            onClick={handleChangeRoleButton}
        >
            Change User Role
        </Button>

    </Container>)
}