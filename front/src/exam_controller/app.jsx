import React from "react";
import { Layout } from "antd";
const { Content, Footer, Header, Sider } = Layout;
import "./app.scss"

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout className="home">
        <Header className="header">header</Header>
        <Content className="body">content</Content>
      </Layout>
    );
  }
}

export default App;
