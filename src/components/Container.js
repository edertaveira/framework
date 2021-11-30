import React from "react";
import { Layout } from "antd";
import { useSelector } from "react-redux";
import { isMobile } from "react-device-detect";

const Container = (props) => {
  const { AsyncFunc } = props;
  const { collapsed } = useSelector((state) => state.common);
  return (
    <Layout className="site-layout" style={isMobile ? {} : { marginLeft: collapsed ? 80 : 200 }}>
      {isMobile && (
        <Layout.Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
          <img alt="logo" src="https://www.frameworkdigital.com.br/img/logo-frwk.svg" className="logoDesktop" />
        </Layout.Header>
      )}
      <Layout.Content style={{ margin: "24px 0 0", overflow: "initial", marginTop: isMobile ? 80 : 12 }}>
        <AsyncFunc />
      </Layout.Content>
    </Layout>
  );
};
export default Container;
