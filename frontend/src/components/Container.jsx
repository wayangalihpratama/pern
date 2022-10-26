import React, { useState } from "react";
import { Layout, Spin, Row, Col, Menu, Dropdown, Space } from "antd";
import Navigation from "./Navigation";
import { store, api } from "../lib";
import isEmpty from "lodash/isEmpty";
import { BiLogOutCircle } from "react-icons/bi";
import { RiSettings2Line } from "react-icons/ri";
import { useNavigate, Link } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const Loading = () => (
  <Row align="middle" justify="center" className="loading-container">
    <Spin />
  </Row>
);

const Profile = () => {
  const user = store.data.useState((s) => s.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    api
      .delete("/logout")
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const items = [
    {
      label: "Setting",
      key: "setting",
      icon: <RiSettings2Line className="profile-icon" />,
    },
    {
      label: <Link onClick={handleLogout}>Logout</Link>,
      key: "logout",
      icon: <BiLogOutCircle className="profile-icon" />,
    },
  ];

  return (
    <Dropdown overlay={<Menu items={items} />} style={{ marginTop: "-20px" }}>
      <a href="#" onClick={(e) => e.preventDefault()}>
        <Space style={{ padding: 0 }} align="center">
          <div className="profile">{user.name}</div>
        </Space>
      </a>
    </Dropdown>
  );
};

const Container = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const loading = store.ui.useState((s) => s.loading);
  const user = store.data.useState((s) => s.user);

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
          <Row gutter={[24, 24]} align="middle" justify="space-between">
            <Col>
              <div className="title">P.E.R.N.</div>
            </Col>
            <Col>{!isEmpty(user) && <Profile />}</Col>
          </Row>
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
