import React from "react";
import {
  Layout,
  Avatar,
  Statistic,
  Input,
  InputNumber,
  Card,
  Row,
  Col,
  Select,
  List,
  Badge,
  Button,
} from "antd";
const { Countdown } = Statistic;
const { Content, Footer, Header, Sider } = Layout;
import "./app.scss";
import MultiZeroRtc from "./MultiZeroRtc";
import request from "../request.js";
import { CameraOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import axios from "axios";
import constant from "../constant";

function MyCamera(props) {
  const { vid } = props;
  return (
    <div className="my-camera">
      <video
        id={"camera-window" + vid}
        autoPlay
        playsInline
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
        }}
      ></video>
      <CameraOutlined></CameraOutlined>
    </div>
  );
}

function ExamStudentState(props) {
  const { ep } = props;
  const { online } = ep;
  if (ep.ep_begindate === null) {
    return <Badge count="未加入" color="black"></Badge>;
  } else {
    if (ep.ep_state === constant.exam_paper_state.ongoing) {
      return online ? (
        <Badge count="在线" style={{ backgroundColor: "green" }}></Badge>
      ) : (
        <Badge count="离线" style={{ backgroundColor: "orange" }}></Badge>
      );
    } else if (ep.ep_state === constant.exam_paper_state.cheating) {
      return <Badge count="作弊" style={{ backgroundColor: "red" }}></Badge>;
    } else {
      return <Badge count="已交卷" style={{ backgroundColor: "blue" }}></Badge>;
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      pa_id: null,
      paperData: {
        pa_begintime: new Date(),
        pa_duringtime: 120,
      },
      epList: [],
      windowSize: "small",
    };

    this.rtc = new MultiZeroRtc(
      "/gs-guide",
      (arg) => {
        if (Array.isArray(arg)) {
          arg = arg.map((v) => +v);
          this.setState({
            epList: this.state.epList.map((v) => {
              if (arg.findIndex((f) => f === v.st_id) !== -1) {
                return {
                  ...v,
                  ep_begindate: new Date(),
                  online: true,
                };
              }
              return v;
            }),
          });
        } else {
          arg = +arg;
          this.setState({
            epList: this.state.epList.map((v) => {
              if (v.st_id === arg) {
                return {
                  ...v,
                  ep_begindate: new Date(),
                  online: true,
                };
              }
              return v;
            }),
          });
        }
      },
      (rid) => {
        rid = +rid;
        this.setState({
          epList: this.state.epList.map((v) => {
            if (v.st_id === rid) {
              return {
                ...v,
                online: false,
              };
            }
            return v;
          }),
        });
      }
    );
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
    // localStorage.setItem("pa_id", 123);
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo === null) {
      notification.error({ message: "未找到您的登陆信息，请重新登陆" });
      setTimeout(() => {
        location.href = "./login";
      }, 1500);
    }
    const pa_id = localStorage.getItem("pa_id");
    const parseUserInfo = JSON.parse(userInfo);
    this.rtc.setlocalUserId(parseUserInfo.te_id);
    if (pa_id === null) {
      notification.error({ message: "未知的考卷id，请重试" });
      setTimeout(() => {
        location.href = "./teacher";
      }, 1500);
    }
    this.setState({
      userInfo: parseUserInfo,
      pa_id,
    });

    request(
      axios.get("/papers/exam/" + pa_id),
      (response) => {
        console.log(response);
        this.setState({
          paperData: response.data.data,
          epList: response.data.data.ep_list.map((v) => {
            return { ...v, online: false };
          }),
        });
      },
      () => {
        this.rtc.createWebsocket(pa_id);
      }
    );

    console.log(parseUserInfo, pa_id);
  }

  render() {
    const { userInfo, paperData } = this.state;
    const begindeadline = dayjs(paperData.pa_begintime);
    const deadline = dayjs(
      begindeadline.toDate().getTime() + paperData.pa_duringtime * 1000 * 60
    );
    return (
      <Layout className="home">
        <Header className="header">
          <div className="user-info">
            <Avatar
              src={userInfo.te_avatar}
              size={"large"}
              className="ft-avatar"
            ></Avatar>
            <span>{userInfo.te_name}</span>
          </div>
          <div className="show-info">
            距离考试结束时间还有：
            <div className="count-down">
              <Countdown
                value={deadline}
                valueStyle={{
                  fontSize: "14px",
                  color: "#fff",
                  zIndex: "9999",
                }}
                format="D 天 H 时 m 分 s 秒"
              ></Countdown>
            </div>
          </div>
        </Header>
        <Layout className="body">
          <div className="sider">
            <div className="select">
              <Select
                value={this.state.windowSize}
                style={{ width: "90%" }}
                onChange={(v) => {
                  this.setState({ windowSize: v });
                }}
                options={[
                  { value: "big", label: "大窗口" },
                  { value: "mid", label: "中窗口" },
                  { value: "small", label: "小窗口" },
                ]}
              />
            </div>
            <List className="list"></List>
          </div>
          <Content className="content">
            {this.state.epList.map((ep, i) => {
              return (
                <Card
                  className={"control-window " + this.state.windowSize}
                  key={i}
                  bodyStyle={{ padding: "0" }}
                  cover={<MyCamera vid={ep.st_id}></MyCamera>}
                >
                  <span className="name">{ep.st_name}</span>
                  <p>
                    <ExamStudentState key={ep.ep_id} ep={ep}></ExamStudentState>
                    <span>切屏次数：{ep.ep_screenoff_count}</span>
                  </p>
                </Card>
              );
            })}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;