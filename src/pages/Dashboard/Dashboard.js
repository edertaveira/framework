import React, { useState, useEffect } from "react";
import { Button, Card, Descriptions, Divider, Layout } from "antd";
import { Pie } from "react-chartjs-2";
import endpoint from "../../common/constants/endpoint";
import { useHistory } from "react-router";

const Dashboard = () => {
  const [todochart, setTodoChart] = useState({});
  const [list, setList] = useState([]);
  const [loadingTodoChart, setLoadingTodoChart] = useState(false);
  const history = useHistory();

  const mountTodoChart = (data) => {
    const pending = data.filter((item) => !item.completed);
    const done = data.filter((item) => item.completed);
    setTodoChart({
      labels: ["Pendentes", "Concluídos"],
      datasets: [
        {
          label: "#",
          data: [pending.length, done.length],
          backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };

  const getList = async () => {
    setLoadingTodoChart(true);
    try {
      const res = await fetch(`${endpoint}/todos`);
      const data = await res.json();
      setList(data);
      mountTodoChart(data);
    } catch (error) {
      console.log(error);
    }
    setLoadingTodoChart(false);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Layout.Content
        className="site-layout-background"
        style={{
          padding: 10,
          marginTop: 10,
          minHeight: 280,
        }}
      >
        <Card
          title="Tarefas"
          extra={
            <Button
              type="link"
              onClick={() => {
                history.push("/todo");
              }}
            >
              Ver Tarefas
            </Button>
          }
          loading={loadingTodoChart}
        >
          <Descriptions>
            <Descriptions.Item label="Total">{list.length}</Descriptions.Item>
            <Descriptions.Item label="Pendente">{list.filter((item) => !item.completed).length}</Descriptions.Item>
            <Descriptions.Item label="Conclulída">{list.filter((item) => item.completed).length}</Descriptions.Item>
          </Descriptions>
          <Divider />
          <Pie data={todochart} />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

export default Dashboard;
