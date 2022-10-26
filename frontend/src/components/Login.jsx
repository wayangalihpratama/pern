import React from "react";
import { Row, Card, Form, Input, Button } from "antd";
import { api } from "../lib";

const Login = () => {
  const [form] = Form.useForm();

  const handleLogin = (values) => {
    const { email, password } = values;
    api
      .post("/login", { email, password })
      .then((res) => {
        const accessToken = res?.data?.accessToken;
        if (accessToken) {
          api.setToken(accessToken);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Row align="middle" justify="center" className="login-container">
      <Card className="login-wrapper">
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true },
              { type: "email", message: "Please input a valid E-mail address" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password" required>
            <Input.Password />
          </Form.Item>
          <Button type="primary" onClick={() => form.submit()} block>
            Login
          </Button>
          <p>
            Or <a href="/register">register now!</a>
          </p>
        </Form>
      </Card>
    </Row>
  );
};

export default Login;
