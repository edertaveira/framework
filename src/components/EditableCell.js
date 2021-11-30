import React from "react";
import { Form, Input, InputNumber, Switch } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  let inputNode = null;

  switch (inputType) {
    case "number":
      inputNode = <InputNumber />;
      break;
    case "text":
      inputNode = <Input />;
      break;
    case "switch":
      inputNode = <Switch />;
      break;
    case "textarea":
      inputNode = <Input.TextArea />;
      break;
    default:
      inputNode = <Input />;
      break;
  }
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          valuePropName={inputType === "switch" ? "checked" : "value"}
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[{ required: true, message: `Por favor preencha ${title}!` }]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

export default EditableCell;
