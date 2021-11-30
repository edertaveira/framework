import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const PageLoading = ({ isLoading, error }) => {
  if (isLoading) {
    const style = {
      textAlign: "center",
      marginBottom: "20px",
      padding: "60px 60px",
      margin: "20px 0"
    };
    return (
      <div style={style}>
        <Spin indicator={<LoadingOutlined />} />
      </div>
    );
  } else if (error) {
    return <div>Erro ao carregar esta página. Contacte-nos.</div>;
  }

  return null;
};

export default PageLoading;
