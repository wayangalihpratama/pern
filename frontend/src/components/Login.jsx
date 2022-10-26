import React from "react";
import { Row, Card, Form, Input, Button } from "antd";
import { api, store } from "../lib";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const { email, password } = values;
    api
      .post("/login", { email, password })
      .then((res) => {
        const { id, name, email, accessToken } = res.data;
        api.setToken(accessToken);
        store.data.update((s) => {
          s.user = { id, name, email };
        });
        navigate("/dashboard");
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
