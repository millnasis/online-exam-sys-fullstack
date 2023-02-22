import React from "react";
import { Avatar, Breadcrumb, Layout, Menu } from "antd";
import "./app.scss";
import ExamControl from "./components/examControl/examControl.jsx";
import GradeControl from "./components/gradeControl/gradeControl.jsx";
import UserSetting from "./components/userSetting/userSetting.jsx";

const { Header, Content, Footer } = Layout;

const menuItem = [
  {
    key: "exam-control",
    label: "考试管理",
  },
  {
    key: "grade-control",
    label: "班级管理",
  },
  {
    key: "start-exam",
    label: "开始考试",
    disabled: true,
  },
  {
    key: "user-setting",
    label: "个人信息",
  },
  {
    key: "logout",
    label: "退出登陆",
  },
];

function Welcome(props) {
  return (
    <div className="welcome">
      <h1 className="welcome-big">欢迎您</h1>
    </div>
  );
}

function RenderContent(props) {
  const { menukey } = props;
  let e = null;
  switch (menukey) {
    case "exam-control":
      e = <ExamControl></ExamControl>;
      break;
    case "grade-control":
      e = <GradeControl></GradeControl>;
      break;
    case "start-exam":
      e = <div></div>;
      break;
    case "user-setting":
      e = <UserSetting></UserSetting>;
      break;
    case "logout":
      e = <div></div>;
      break;
    case "welcome":
      e = <Welcome></Welcome>;
      break;

    default:
      e = <div></div>;
      break;
  }
  return e;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuSelect: ["welcome"],
    };
  }

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="user-info">
            <Avatar
              src={
                "https://img1.baidu.com/it/u=2079992994,1830113805&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"
              }
              size={"large"}
              className="avatar"
            ></Avatar>
            <a>用户名</a>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            className="menu"
            selectedKeys={this.state.menuSelect}
            onClick={(info) => {
              this.setState({ menuSelect: [info.key] });
            }}
            items={menuItem}
          />
        </Header>
        <Content className="content">
          <RenderContent menukey={this.state.menuSelect[0]}></RenderContent>
        </Content>
        <Footer className="footer">Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

export default App;
