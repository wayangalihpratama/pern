import React, { useEffect } from "react";
import { Container } from "../components";
import { store } from "../lib";
import { Typography } from "antd";

const Dashboard = () => {
  const loading = store.ui.useState((s) => s.loading);
  const user = store.data.useState((s) => s.user);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        store.ui.update((s) => {
          s.loading = false;
        });
      }, 500);
    }
  }, [loading]);

  return (
    <Container>
      <Typography.Title>Welcome {user?.name}</Typography.Title>
    </Container>
  );
};

export default Dashboard;
