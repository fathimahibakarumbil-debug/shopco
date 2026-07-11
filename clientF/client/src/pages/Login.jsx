import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(data);
      localStorage.setItem("token", res.data.token);

      alert("Login Success");

      navigate("/home");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  const handleRegister = async () => {
    await registerUser(data);
    alert("Registered Successfully");
  };

  return (
    <Box sx={{ padding: 5, maxWidth: 400, margin: "auto" }}>
      <Typography variant="h4">Login</Typography>

      <TextField
        label="Username"
        onChange={(e) => setData({ ...data, username: e.target.value })}
      />

      <TextField
        label="Password"
        type="password"
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleLogin}
      >
        Login
      </Button>

      <Button fullWidth sx={{ mt: 1 }} onClick={handleRegister}>
        Register
      </Button>
    </Box>
  );
}
