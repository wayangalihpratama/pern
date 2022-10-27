import React, { useEffect } from "react";
import { Container } from "../components";
import { api, store } from "../lib";
import { Table, Tag, Card, Space, Button, Row, Col, Input, Select } from "antd";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

const Todo = () => {
  const todos = store.data.useState((s) => s.todos);

  const updateTodo = (id, obj) => {
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
    updateTodo(record.id, { onEdit: true });
  };

  const handleChangeTitle = (record, value) => {
    updateTodo(record.id, { title: value });
  };

  const handleChangeStatus = (record, value) => {
    updateTodo(record.id, { done: value });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (_, record) =>
        record.onEdit ? (
          <Input
            value={record.title}
            size="small"
            onChange={(e) => handleChangeTitle(record, e.target.value)}
          />
        ) : (
          record.title
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
        return record.done ? (
          <Tag color="green">Done</Tag>
        ) : (
          <Tag color="orange">Ongoing</Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="small"
            onClick={() => handleEdit(record)}
            disabled={record.onEdit}
          >
            Edit
          </Button>
          <Button size="small" danger disabled={record.onEdit}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
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

  const handleChangeDescription = (record, text) => {
    updateTodo(record.id, { description: text });
  };

  return (
    <Container>
      <Table
        columns={columns}
        dataSource={todos}
        expandable={{
          expandedRowRender: (record) => (
            <Card>
              {record.onEdit ? (
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <MDEditor
                      value={record.description}
                      onChange={(text) => handleChangeDescription(record, text)}
                      previewOptions={{
                        rehypePlugins: [[rehypeSanitize]],
                      }}
                    />
                  </Col>
                  <Col span={24}>
                    <Space size="small">
                      <Button type="primary" size="small">
                        Save
                      </Button>
                      <Button size="small">Cancel</Button>
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
    </Container>
  );
};

export default Todo;
