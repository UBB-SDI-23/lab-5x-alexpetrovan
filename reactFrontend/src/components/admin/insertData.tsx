import { Button, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { Container } from "@mui/system"
import axios from "axios"
import React, { useState } from "react"
import { BACKEND_API_URL } from "../../constants"
import { useNavigate } from "react-router"

export const InsertData = () => {
    const [model, setModel] = useState<string>("")
    const navigate = useNavigate();

    const makeRequest = async () => {
        try{
            await axios.get(`${BACKEND_API_URL}/insert/${model}/`);

        } catch (error) {
            throw new Error("Activation failed"); // Handle the error appropiately
        }
    }

    const handleModelChange = (event: SelectChangeEvent) => {
        setModel(event.target.value);
    }

    const handleBack = () => {
        navigate("/admin-actions");
    }

    return <Container maxWidth="xs" sx={{ marginTop: "5%" }}>
        
        <Typography variant="h4" component="h1" align="center" marginBottom={"5%"}> Choose what data would you like to add </Typography>
        <form>
            <InputLabel id="select-input-label">Model</InputLabel>
            <Select
                labelId="select-model-label"
                id="select-model"
                value={model}
                onChange={handleModelChange}
                fullWidth
            >
                <MenuItem value="production">Production</MenuItem>
                <MenuItem value="actor">Actor</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
            </Select>
        </form>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{marginTop: "5%",height: "6vh"}}
          onClick={makeRequest}
        >
          Add data
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{marginTop: "5%",height: "6vh"}}
          onClick={handleBack}
        >
        Back
        </Button>
    </Container>
}