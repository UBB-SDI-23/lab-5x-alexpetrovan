import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import axios from "axios";
import SelectInput, { SelectChangeEvent } from "@mui/material/Select/SelectInput";

export const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [gender, setGender] = useState("male");
    const [marital, setMarital] = useState("single");
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState("");
    const [isActivated, setActivated] = useState(false);

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    const handleRepeatPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRepeatPassword(event.target.value);
    }

    const handleGenderChange = (event: SelectChangeEvent) => {
        setGender(event.target.value);
    }

    const handleMaritalChange = (event: SelectChangeEvent) => {
        setMarital(event.target.value);
    }

    const handleRegister = async () => {

        // Register logic request
        try {
            const response = await axios.post(`${BACKEND_API_URL}/Register/`, {
                user: {
                    username: username,
                    password: password,
                },
                bio: "Blank", // Set a default empty value
                location: "Blank", // Set a default empty value
                gender: gender,
                marital: marital,
                activation_code: "",
                activation_expiry_date: null,
                active: false,
            });

            setConfirmationCode(response.data.activation_code);

            setPopupOpen(true);

        } catch (error) {
            throw new Error("Register failed"); // Handle the error appropriately
        }

    };

    const handleActivateAccount = async () => {

        try{
            const response = await axios.get(`${BACKEND_API_URL}/Register/Confirm/${confirmationCode}`);

            if (response.data.success){
                setPopupOpen(false);

                setActivated(true);
            }

        } catch (error) {
            throw new Error("Activation failed"); // Handle the error appropiately
        }

    }

    const handleClosePopup = () => {
        setPopupOpen(false);
    }

    const handleActivatedPopup = () => {
        setActivated(false);

        navigate("/login");
    }

    const isUsernameValid = username.length > 3;

    const isPasswordValid = password.length > 7;

    const isRepeatPasswordValid = password === repeatPassword && isPasswordValid;

    const isRegisterButtonEnabled = isRepeatPasswordValid && isUsernameValid;

    return (
        <Container maxWidth="xs" sx={{marginTop: "5%"}}>
            <Typography variant="h4" component="h1" align="center" marginBottom={"5%"}> Register </Typography>
            <form>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    error={!isUsernameValid}
                    helperText={!isUsernameValid && "Username must be at least 4 char long"}
                    value={username}
                    onChange={handleUsernameChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    error={!isPasswordValid}
                    helperText={!isPasswordValid && "Password must be at least 8 char long"}
                    onChange={handlePasswordChange}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="repeatPassword"
                    label="Repeat Password"
                    type="password"
                    value={repeatPassword}
                    error={!isRepeatPasswordValid}
                    helperText={!isRepeatPasswordValid && "The passwords are not the same or do not have a valid length"}
                    onChange={handleRepeatPasswordChange}
                />
                <Container sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: '25%',
                    width: '25%',

                }}
                >
                </Container>
                <div>
                    <InputLabel id="select-gender-label">Gender</InputLabel>
                    <Select
                        labelId="select-gender-label"
                        id="select-gender"
                        value={gender}
                        onChange={handleGenderChange}
                        label="Gender"
                        fullWidth
                    >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                    </div>
                <div>
                    <InputLabel id="select-marital-label">Marital</InputLabel>
                    <Select
                        labelId="select-marital-label"
                        id="select-marital"
                        value={marital}
                        onChange={handleMaritalChange}
                        label="Marital"
                        fullWidth
                    >
                        <MenuItem value="single">Single</MenuItem>
                        <MenuItem value="married">Married</MenuItem>
                    </Select>
                    </div>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={!isRegisterButtonEnabled}
                    onClick={handleRegister}
                    fullWidth
                    sx={{height: "6vh", marginTop: "4%"}}
                >
                    Register
                </Button>
            </form>
            
            <Dialog open={isPopupOpen} onClose={handleClosePopup}>
                <DialogTitle align="center">Registration Successful</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" align="center">This is your confirmation code:</Typography>
                    <Typography variant="h5" align="center">{confirmationCode}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleActivateAccount} color="primary">
                        Activate
                    </Button>
                    <Button onClick={handleClosePopup} color="primary">
                        Close
                    </Button>

                </DialogActions>
            </Dialog>

            <Dialog open={isActivated} onClose={handleActivatedPopup}>
                <DialogTitle align="center">Activation Successful</DialogTitle>
                <DialogActions>

                    <Button onClick={handleActivatedPopup} color="primary">
                        Ok
                    </Button>

                </DialogActions>
            </Dialog>

        </Container>
    );
};