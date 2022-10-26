import React, { useState } from "react";
import { Layout, Spin, Row } from "antd";
import Navigation from "./Navigation";
import { store } from "../lib";

const { Header, Content, Footer, Sider } = Layout;

const Loading = () => (
  <Row align="middle" justify="center" className="loading-container">
    <Spin />
  </Row>
);

const Container = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const loading = store.ui.useState((s) => s.loading);

  return (
    <Layout hasSider>
      <Sider
        className="sider-container"
        theme="light"
        width={300}
        collapsedWidth={100}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
      >
        <Navigation />
      </Sider>
      <Layout>
        <Header className="header-container">
          <h1>P.E.R.N.</h1>
        </Header>
        <Content
          className={`content-container ${
            collapsed ? "content-container-collapsed" : ""
          }`}
        >
          {loading ? <Loading /> : children}
        </Content>
        <Footer className="footer-container">
          <Row align="middle" justify="end">
            <p>
              Learning Express - React &copy;2022 by{" "}
              <a href="https://github.com/wayangalihpratama">wgprtm</a>.
            </p>
          </Row>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Container;
