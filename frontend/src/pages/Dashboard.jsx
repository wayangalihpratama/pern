import React, { useEffect } from "react";
import { Container } from "../components";
import { store } from "../lib";

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
      <h1>Welcome {user?.name}</h1>
    </Container>
  );
};

export default Dashboard;
