import React, { useState } from "react";
import { Layout } from "antd";

const { Header, Content, Footer, Sider } = Layout;

const Container = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

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
        Sider
      </Sider>
      <Layout>
        <Header className="header-container">Header</Header>
        <Content
          className={`content-container ${
            collapsed ? "content-container-collapsed" : ""
          }`}
        >
          {children}
        </Content>
        <Footer className="footer-container">
          <p>
            Learning Express - React &copy;2022 by{" "}
            <a href="https://github.com/wayangalihpratama">wgprtm</a>.
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Container;
