import React, { useState } from "react";
import { Typography, TextField, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth";

const LoginPage: React.FC = () => {
  const { login } = useAuth(); 
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    // Perform login logic here
    try {
        // Assuming the response contains the token
        await login(username, password);
        navigate("/");
      } catch (error) {
        // Handle error (e.g., display error message)
        console.log(error);
      }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" align="center">
        Login
      </Typography>
      <form>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
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
          onChange={handlePasswordChange}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{marginBottom:"1%"}}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleRegister}
        >
          Register
        </Button>
      </form>
    </Container>
  );
};

export default LoginPage;