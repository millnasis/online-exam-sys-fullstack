import React from "react";
import { Avatar, Breadcrumb, Layout, Menu, notification } from "antd";
import "./app.scss";
import ExamControl from "./components/examControl/examControl.jsx";
import GradeControl from "./components/gradeControl/gradeControl.jsx";
import UserSetting from "./components/userSetting/userSetting.jsx";
import axios from "axios";

import { actions } from "./reducers/root";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CheckPaper from "./components/checkPaper/checkPaper.jsx";
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

async function logout() {
  localStorage.removeItem("userinfo");
  await axios.delete("/session");
  location.href = "/login";
}

function RenderContent(props) {
  const { menukey, paperId, menuselect } = props;
  let e = null;
  switch (menukey) {
    case "exam-control":
      e = <ExamControl menuselect={menuselect}></ExamControl>;
      break;
    case "grade-control":
      e = <GradeControl></GradeControl>;
      break;
    case "check-paper":
      e = <CheckPaper paperId={paperId} menuselect={menuselect}></CheckPaper>;
      break;
    case "user-setting":
      e = <UserSetting></UserSetting>;
      break;
    case "logout":
      logout();
      e = <div></div>;
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
      menuSelect: ["exam-control"],
      paperId: -1,
    };
  }

  componentDidMount() {
    // localStorage.setItem(
    //   "userinfo",
    //   JSON.stringify({
    //     st_id: 1622960532008493000,
    //     st_name: "MillNasis",
    //     st_sex: "M",
    //     st_avatar:
    //       "https://img-blog.csdnimg.cn/img_convert/4cef4c0a5c42d4ccae9ba327c550350b.png",
    //     st_age: 23,
    //     st_registerdate: "2023-02-07",
    //     st_password: null,
    //     st_card: "3192052051725",
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
              src={userInfo.st_avatar}
              size={"large"}
              className="ft-avatar"
            ></Avatar>
            <a>{userInfo.st_name}</a>
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
            menuselect={(key, paperId = -1) => {
              this.setState({ menuSelect: [key], paperId });
            }}
          ></RenderContent>
        </Content>
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
