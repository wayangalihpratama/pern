import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Login, Register } from "./components";
import { Dashboard } from "./pages";
import { api, store } from "./lib";
import jwt_decode from "jwt-decode";

function App() {
  const loading = store.ui.useState((s) => s.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      api
        .get("/refresh_token")
        .then((res) => {
          const { accessToken } = res.data;
          api.setToken(accessToken);
          const user = jwt_decode(accessToken);
          store.data.update((s) => {
            s.user = user;
          });
          navigate("/dashboard");
        })
        .catch((error) => {
          console.error(error);
          navigate("/");
        })
        .finally(() => {
          store.ui.update((s) => {
            s.loading = false;
          });
        });
    }
  }, [navigate, loading]);

  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
