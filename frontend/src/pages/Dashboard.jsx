import React, { useEffect } from "react";
import { Container } from "../components";
import { api, store } from "../lib";
import jwt_decode from "jwt-decode";

const Dashboard = () => {
  const loading = store.ui.useState((s) => s.loading);
  const user = store.data.useState((s) => s.user);

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
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          store.ui.update((s) => {
            s.loading = false;
          });
        });
    }
  }, [loading]);

  return (
    <Container>
      <h1>Welcome {user?.name}</h1>
    </Container>
  );
};

export default Dashboard;
