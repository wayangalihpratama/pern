import React from "react";
import { Row, Card, Form, Input, Button, notification } from "antd";
import { api } from "../lib";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = (values) => {
    const { name, email, password, confirm_password } = values;
    api
      .post("/register", { name, email, password, confirm_password })
      .then(() => {
        notification.success({
          message: "Registration complete",
          description: "Please login to your account",
        });
        navigate("/");
      })
      .catch((error) => {
        const { data } = error.response;
        notification.error({
          message: "Registration failed",
          description: data.msg,
        });
      });
  };

  return (
    <Row align="middle" justify="center" className="login-container">
      <Card className="login-wrapper">
        <Form form={form} layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Name" name="name" required>
            <Input />
          </Form.Item>
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
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" onClick={() => form.submit()} block>
            Register
          </Button>
          <p>
            Already have an account, <a href="/">login now!</a>
          </p>
        </Form>
      </Card>
    </Row>
  );
};

export default Register;
