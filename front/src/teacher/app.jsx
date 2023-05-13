import React from "react";
import { Avatar, Breadcrumb, Layout, Menu, notification } from "antd";
import "./app.scss";
import axios from "axios";

import { actions } from "./reducers/root";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import UserSetting from "./components/userSetting/userSetting.jsx";
import GradeControl from "./components/gradeControl/gradeControl.jsx";
import ExamControl from "./components/examControl/examControl.jsx";
import PaperControl from "./components/PaperControl/paperControl.jsx";
import CorrectPaper from "./components/correctPaper/correctPaper.jsx";
const { set_user_info } = actions;

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
      <h1 className="welcome-big">欢迎您，今天没有考试</h1>
    </div>
  );
}

async function logout() {
  localStorage.removeItem("userinfo");
  await axios.delete("/session");
  location.href = "/login";
}

function RenderContent(props) {
  const { menukey, menuselect, paperId } = props;
  let e = null;
  switch (menukey) {
    case "paper-control":
      e = (
        <PaperControl
          key={paperId}
          paperId={paperId}
          menuselect={menuselect}
        ></PaperControl>
      );
      break;
    case "exam-control":
      e = <ExamControl menuselect={menuselect}></ExamControl>;
      break;
    case "grade-control":
      e = <GradeControl></GradeControl>;
      break;
    case "user-setting":
      e = <UserSetting></UserSetting>;
      break;
    case "logout":
      logout();
      e = <div></div>;
      break;
    case "welcome":
      e = <Welcome></Welcome>;
      break;
    case "correct":
      e = (
        <CorrectPaper
          key={paperId}
          paperId={paperId}
          menuselect={menuselect}
        ></CorrectPaper>
      );
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
      paperId: -1,
    };
  }

  componentDidMount() {
    // localStorage.setItem(
    //   "userinfo",
    //   JSON.stringify({
    //     te_id: 1622960532008493000,
    //     te_name: "MillNasis",
    //     te_sex: "M",
    //     te_avatar:
    //       "https://img-blog.csdnimg.cn/img_convert/4cef4c0a5c42d4ccae9ba327c550350b.png",
    //     te_age: 23,
    //     te_registerdate: "2023-02-07",
    //     te_password: null,
    //     te_card: "3192052051725",
    //   })
    // );
    const userInfo = localStorage.getItem("userinfo");
    console.log(userInfo);
    if (userInfo === null) {
      notification.error({ message: "未找到您的登陆信息，请重新登陆" });
      setTimeout(() => {
        location.href = "./login";
      }, 1500);
    }
    this.props.set_user_info(JSON.parse(userInfo));
  }

  render() {
    const { userInfo } = this.props.global;
    console.log(this.props);
    return (
      <Layout className="layout">
        <Header>
          <div
            className="user-info"
            onClick={() => this.setState({ menuSelect: ["user-setting"] })}
          >
            <Avatar
              src={userInfo.te_avatar}
              size={"large"}
              className="ft-avatar"
            ></Avatar>
            <a>{userInfo.te_name}</a>
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
          <RenderContent
            menukey={this.state.menuSelect[0]}
            paperId={this.state.paperId}
            menuselect={(key, paperId = -1) =>
              this.setState({ menuSelect: [key], paperId })
            }
          ></RenderContent>
        </Content>
        <Footer className="footer">Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return { global: state.global };
}

function mapDispatchToProps(dispatch) {
  return {
    set_user_info: bindActionCreators(set_user_info, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
