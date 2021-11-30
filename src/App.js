import React, { Suspense } from "react";
import { Provider } from "react-redux";
import PageLoading from "./components/PageLoading";
import Sidebar from "./components/Sidebar";
import { Layout } from "antd";
import configureStore from "./storage/configureStore";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Container from "./components/Container";

import "./App.scss";
import { isMobile } from "react-device-detect";
const renderComponent = (AsyncFunc) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Container AsyncFunc={AsyncFunc} />
    </Layout>
  );
};

const Todo = React.lazy(() => import("./pages/Todo"));
const Albuns = React.lazy(() => import("./pages/Albuns"));
const Postagens = React.lazy(() => import("./pages/Postagens"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));

const { store, persistor } = configureStore();

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<PageLoading />}>
          <Router>
            <Route exact path={"/"} render={() => renderComponent(Dashboard)} />
            <Route exact path={"/todo"} component={() => renderComponent(Todo)} />
            <Route exact path={"/albuns"} component={() => renderComponent(Albuns)} />
            <Route exact path={"/postagens"} component={() => renderComponent(Postagens)} />
          </Router>
        </Suspense>
      </PersistGate>
    </Provider>
  );
}

export default App;
