import { useState } from "react";
import { loginUser, registerUser } from "../services/api";

import { Box, TextField, Button, Typography, Paper } from "@mui/material";

import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        //  LOGIN
        const res = await loginUser({
          username: data.username,
          password: data.password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        alert("Login Successful ✅");
        navigate("/home");
      } else {
        // REGISTER
        const res = await registerUser({
          username: data.username,
          email: data.email,
          password: data.password,
        });

        // TOKEN SAVE
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);

        alert("Registered Successfully ✅");

        navigate("/home");

        setData({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (err) {
      console.log(err);

      if (err.response?.data?.error) {
        alert(err.response.data.error);
      } else {
        alert("Invalid credentials or Server Error ❌");
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 5,
          width: 350,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {isLogin ? "Login" : "Register"}
        </Typography>

        {/* USERNAME */}
        <TextField
          label="Username"
          fullWidth
          value={data.username}
          sx={{ mt: 3 }}
          onChange={(e) =>
            setData({
              ...data,
              username: e.target.value,
            })
          }
        />

        {/* EMAIL */}
        {!isLogin && (
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={data.email}
            sx={{ mt: 2 }}
            onChange={(e) =>
              setData({
                ...data,
                email: e.target.value,
              })
            }
          />
        )}

        {/* PASSWORD */}
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={data.password}
          sx={{ mt: 2 }}
          onChange={(e) =>
            setData({
              ...data,
              password: e.target.value,
            })
          }
        />

        {/* BUTTON */}
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Register"}
        </Button>

        {/* TOGGLE */}
        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
          }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Typography>
      </Paper>
    </Box>
  );
}
