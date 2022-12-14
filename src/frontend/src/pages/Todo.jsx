import React, { useEffect, useState, useCallback } from "react";
import { Container } from "../components";
import { api, store } from "../lib";
import {
  Table,
  Tag,
  Card,
  Space,
  Button,
  Row,
  Col,
  Input,
  Select,
  notification,
  Form,
  Popconfirm,
  Typography,
} from "antd";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

const Todo = () => {
  const [todoForm] = Form.useForm();
  const todos = store.data.useState((s) => s.todos);
  const [prevTodos, setPrevTodos] = useState([]);
  const [onAdd, setOnAdd] = useState(false);

  const updateTodo = (id, obj) => {
    // set prev todo
    const prevValue = todos.find((td) => td.id === id);
    const check = prevTodos.find((td) => td.id === id);
    if (!check) {
      setPrevTodos([...prevTodos, prevValue]);
    }
    store.data.update((s) => {
      s.todos = s.todos.map((td) => {
        if (td.id === id) {
          return {
            ...td,
            ...obj,
          };
        }
        return td;
      });
    });
  };

  const handleEdit = (record) => {
    setOnAdd(false);
    updateTodo(record.id, { onEdit: true });
  };

  const handleChangeTitle = (record, value) => {
    updateTodo(record.id, { title: value });
  };

  const handleChangeStatus = (record, value) => {
    updateTodo(record.id, { done: value });
  };

  const handleDelete = (record) => {
    api
      .delete(`/todo/${record.id}`)
      .then(() => {
        notification.success({
          message: "Delete Success",
          description: `Task ${record.title} deleted.`,
        });
        loadTodo();
      })
      .catch(() => {
        notification.error({
          message: "Delete Failed",
          description: `Can't delete task ${record.title}. Please try again later.`,
        });
      });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, record) =>
        record.onEdit ? (
          <Input
            key={`title-input-${record.id}`}
            value={record.title}
            size="small"
            onChange={(e) => handleChangeTitle(record, e.target.value)}
          />
        ) : (
          <div key={`title-${record.id}`}>{record.title}</div>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "done",
      render: (_, record) => {
        if (record.onEdit) {
          return (
            <Select
              key={`status-select-${record.id}`}
              size="small"
              value={record.done}
              options={[
                { label: "Done", value: true },
                { label: "Ongoing", value: false },
              ]}
              onChange={(val) => handleChangeStatus(record, val)}
              style={{ width: "125px" }}
            />
          );
        }
        return (
          <div key={`status-${record.id}`}>
            {record.done ? (
              <Tag color="green">Done</Tag>
            ) : (
              <Tag color="orange">Ongoing</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle" key={`action-${record.id}`}>
          <Button
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.onEdit || record.done}
          >
            Edit
          </Button>
          <Popconfirm
            disabled={record.onEdit}
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger disabled={record.onEdit}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const loadTodo = useCallback(() => {
    api
      .get("/todos")
      .then((res) => {
        store.data.update((s) => {
          s.todos = res.data.map((td) => ({ ...td, onEdit: false }));
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
  }, []);

  useEffect(() => {
    loadTodo();
  }, [loadTodo]);

  const handleChangeDescription = (record, text) => {
    updateTodo(record.id, { description: text });
  };

  const handleSave = (record, isNew = false) => {
    if (isNew) {
      api
        .post("/todo", { ...record, done: false })
        .then((res) => {
          notification.success({
            message: "Save Success",
            description: res.data.msg,
          });
          loadTodo();
          setOnAdd(false);
          todoForm.resetFields();
        })
        .catch((error) => {
          const { data } = error.response;
          notification.error({
            message: "Update Failed",
            description: data.msg,
          });
        });
      return;
    }
    api
      .put("/todo", record)
      .then((res) => {
        notification.success({
          message: "Update Success",
          description: res.data.msg,
        });
        updateTodo(record.id, { onEdit: false });
      })
      .catch((error) => {
        const { data } = error.response;
        notification.error({
          message: "Update Failed",
          description: data.msg,
        });
      });
  };

  const handleCancel = (record) => {
    const prevValue = prevTodos.find((td) => td.id === record.id);
    updateTodo(record.id, { ...prevValue, onEdit: false });
  };

  const handleAdd = () => {
    setOnAdd(!onAdd);
  };

  return (
    <Container>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title>Todo List</Typography.Title>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={handleAdd}>
            Add
          </Button>
          {onAdd && (
            <Card>
              <Form
                form={todoForm}
                layout="vertical"
                onFinish={(values) => handleSave(values, true)}
              >
                <Form.Item label="Title" name="title" required>
                  <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                  <MDEditor
                    previewOptions={{
                      rehypePlugins: [[rehypeSanitize]],
                    }}
                  />
                </Form.Item>
                <Space>
                  <Button
                    onClick={() => todoForm.submit()}
                    type="primary"
                    ghost
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setOnAdd(false);
                      todoForm.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form>
            </Card>
          )}
        </Col>
        <Col span={24}>
          <Table
            rowKey={(rec) => `row-${rec.id}`}
            columns={columns}
            dataSource={todos}
            expandable={{
              expandedRowRender: (record) => (
                <Card key={`todo-description-${record.id}`}>
                  {record.onEdit ? (
                    <Row gutter={[12, 12]}>
                      <Col span={24}>
                        <MDEditor
                          value={record.description}
                          onChange={(text) =>
                            handleChangeDescription(record, text)
                          }
                          previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                          }}
                        />
                      </Col>
                      <Col span={24}>
                        <Space size="small">
                          <Button
                            type="primary"
                            size="small"
                            onClick={() => handleSave(record)}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleCancel(record)}
                          >
                            Cancel
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  ) : (
                    <MDEditor.Markdown source={record.description} />
                  )}
                </Card>
              ),
              rowExpandable: (record) => record?.description,
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Todo;
