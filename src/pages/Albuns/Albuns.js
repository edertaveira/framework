import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Layout,
  PageHeader,
  Table,
  Form,
  Space,
  notification,
  Popconfirm,
  message,
  Modal,
  Spin,
  Row,
  Col,
  Input,
} from "antd";
import { FaCheck, FaPlus, FaTimes, FaTrash, FaEdit } from "react-icons/fa";
import endpoint from "../../common/constants/endpoint";
import EditableCell from "../../components/EditableCell";

const Albuns = () => {
  const [form] = Form.useForm();
  const [formTable] = Form.useForm();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record) => record.id === editingKey;
  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      render: (text) => <span data-testid="rowid">{text}</span>,
    },
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
      editable: true,
    },
    {
      title: "",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button
              data-testid="editsave"
              loading={loadingEdit}
              type="link"
              icon={<FaCheck />}
              onClick={() => onEdit(record.id)}
              style={{ marginRight: 8 }}
            />
            <Button type="link" icon={<FaTimes />} onClick={() => setEditingKey("")} />
          </Space>
        ) : (
          <Space size="middle">
            <Button
              data-testid="edit"
              type="link"
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              icon={<FaEdit />}
            />
            <Popconfirm placement="left" title="Confirmar exclusão?" onConfirm={() => onDelete(record.id)}>
              <Button data-testid="trash" type="link" icon={<FaTrash />} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.inputType ? col.inputType : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const getList = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}/albums`);
      setList(await res.json());
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const onFinish = async (values) => {
    setLoadingAdd(true);
    try {
      await fetch(`${endpoint}/albums`, {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      notification.success({ message: "Álbum Criado!" });
      form.resetFields();
      setVisible(false);
    } catch (error) {
      notification.error({ message: "Erro ao tentar cadastrar. Tente novamente." });
    }
    setLoadingAdd(false);
  };

  const onEdit = async (id) => {
    setLoadingEdit(true);
    try {
      const values = await formTable.validateFields();
      fetch(`${endpoint}/albums/${id}`, {
        method: "PUT",
        body: JSON.stringify({ id, ...values }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      notification.success({ message: "Álbum atualizado!" });
      setEditingKey("");
    } catch (error) {
      notification.error({ message: "Erro ao tentar atualizar. Tente novamente." });
    }
    setLoadingEdit(false);
  };

  const onDelete = async (id) => {
    const closeMessage = message.loading({ content: "Deletando..." }, 0);
    try {
      fetch(`${endpoint}/albums/${id}`, {
        method: "DELETE",
      });
      notification.success({ message: "Álbum deletado!" });
    } catch (error) {
      notification.error({ message: "Erro ao tentar deletar. Tente novamente." });
    }
    closeMessage();
  };

  const edit = (record) => {
    formTable.setFieldsValue({ ...record });
    setEditingKey(record.id);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title="Álbuns"
        subTitle="Gerenciar Álbuns"
        extra={[
          <Button onClick={() => setVisible(true)} icon={<FaPlus />} key="1">
            Adicionar
          </Button>,
        ]}
      />
      <Layout.Content
        className="site-layout-background"
        style={{
          padding: 10,
          marginTop: 10,
          minHeight: 280,
        }}
      >
        <Form form={formTable} component={false}>
          <Table
            size="small"
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            columns={mergedColumns}
            dataSource={list}
            loading={loading}
            pagination={{
              onChange: () => setEditingKey(""),
            }}
            rowKey="id"
          />
        </Form>
      </Layout.Content>

      <Modal
        cancelText="Cancelar"
        okText="Salvar"
        onOk={async () => {
          await form.validateFields();
          form.submit();
        }}
        okButtonProps={{
          loading: loadingAdd,
        }}
        onCancel={() => setVisible(false)}
        title="Adicionar novo Álbum"
        visible={visible}
      >
        <Form form={form} layout="vertical" hideRequiredMark onFinish={onFinish}>
          <Spin spinning={loadingAdd}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="title" label="Nome" rules={[{ required: true, message: "Preencha o título!" }]}>
                  <Input placeholder="Digite o título" />
                </Form.Item>
              </Col>
            </Row>
            <Row></Row>
          </Spin>
        </Form>
      </Modal>
    </Layout>
  );
};

export default Albuns;
