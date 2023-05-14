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
  Modal,
  Popconfirm,
  notification,
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
import Check from "./check.jsx";

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
  if (ep.ep_state === constant.exam_paper_state.cheating) {
    return <Badge count="作弊" style={{ backgroundColor: "red" }}></Badge>;
  }
  if (ep.ep_begindate === null) {
    return <Badge count="未加入" color="black"></Badge>;
  } else {
    if (ep.ep_state === constant.exam_paper_state.ongoing) {
      return online ? (
        <Badge count="在线" style={{ backgroundColor: "green" }}></Badge>
      ) : (
        <Badge count="离线" style={{ backgroundColor: "orange" }}></Badge>
      );
    } else {
      return <Badge count="已交卷" style={{ backgroundColor: "blue" }}></Badge>;
    }
  }
}

const fakedata = {
  "pa_id": 22,
  "gr_id": 3,
  "pa_name": "考试测试",
  "pa_founddate": "2023-05-11T07:54:57.662+00:00",
  "pa_state": "END",
  "pa_begintime": "2023-05-11T15:00:00.825+00:00",
  "pa_duringtime": 120,
  "pa_order": "[46,47,48]",
  "ep_list": [
    {
      "ep_id": 49,
      "st_id": 5,
      "pa_id": 22,
      "ep_begindate": "2023-05-12T02:55:02.130+00:00",
      "ep_finishdate": "2023-05-12T02:56:16.361+00:00",
      "ep_state": "FINISHED",
      "ep_screenoff_count": 2,
      "st_name": "个人信息修改测试",
      "st_card": "123",
      "ep_score": null,
      "ep_question": null,
      "pa_order": null,
      "gr_id": 0,
      "pa_name": null,
      "pa_founddate": null,
      "pa_state": null,
      "pa_begintime": null,
      "pa_duringtime": 0
    },
    {
      "ep_id": 50,
      "st_id": 6,
      "pa_id": 22,
      "ep_begindate": null,
      "ep_finishdate": "2023-05-12T02:57:28.264+00:00",
      "ep_state": "FINISHED",
      "ep_screenoff_count": 0,
      "st_name": "学生测试2",
      "st_card": "123123",
      "ep_score": null,
      "ep_question": null,
      "pa_order": null,
      "gr_id": 0,
      "pa_name": null,
      "pa_founddate": null,
      "pa_state": null,
      "pa_begintime": null,
      "pa_duringtime": 0
    },
    {
      "ep_id": 51,
      "st_id": 7,
      "pa_id": 22,
      "ep_begindate": null,
      "ep_finishdate": "2023-05-12T02:57:28.554+00:00",
      "ep_state": "FINISHED",
      "ep_screenoff_count": 0,
      "st_name": "学生测试3",
      "st_card": "1233",
      "ep_score": null,
      "ep_question": null,
      "pa_order": null,
      "gr_id": 0,
      "pa_name": null,
      "pa_founddate": null,
      "pa_state": null,
      "pa_begintime": null,
      "pa_duringtime": 0
    },
    {
      "ep_id": 52,
      "st_id": 8,
      "pa_id": 22,
      "ep_begindate": "2023-05-12T02:56:30.727+00:00",
      "ep_finishdate": null,
      "ep_state": "CHEATING",
      "ep_screenoff_count": 2,
      "st_name": "学生测试4",
      "st_card": "1234",
      "ep_score": null,
      "ep_question": null,
      "pa_order": null,
      "gr_id": 0,
      "pa_name": null,
      "pa_founddate": null,
      "pa_state": null,
      "pa_begintime": null,
      "pa_duringtime": 0
    },
    {
      "ep_id": 53,
      "st_id": 9,
      "pa_id": 22,
      "ep_begindate": "2023-05-13T03:11:02.714+00:00",
      "ep_finishdate": "2023-05-12T02:57:29.023+00:00",
      "ep_state": "FINISHED",
      "ep_screenoff_count": 0,
      "st_name": "学生测试5",
      "st_card": "1235",
      "ep_score": null,
      "ep_question": null,
      "pa_order": null,
      "gr_id": 0,
      "pa_name": null,
      "pa_founddate": null,
      "pa_state": null,
      "pa_begintime": null,
      "pa_duringtime": 0
    }
  ]
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userInfo: {},
      pa_id: null,
      paperData: fakedata,
      epList: [],
      windowSize: "big",
      modalStId: -1,
      modalObj: {},
      msgList: [],
      check: false,
    };

    this.switchModalStId = this.switchModalStId.bind(this);
    this.unshiftMsg = this.unshiftMsg.bind(this);

    this.rtc = new MultiZeroRtc("/gs-guide");
    // 有人加入考试时的回调
    this.rtc.joinCallBack = (arg) => {
      const data = [];
      if (Array.isArray(arg)) {
        // 传入是数组的情况
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
        // 传入是单个id的情况
        arg = +arg;
        this.setState({
          epList: this.state.epList.map((v) => {
            if (v.st_id === arg) {
              data.push(v);
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
      this.unshiftMsg(data, "join", this.state.msgList);
    };
    // 有人离开考试时的回调
    this.rtc.exitCallBack = (rid) => {
      const data = [];
      rid = +rid;
      this.setState({
        epList: this.state.epList.map((v) => {
          if (v.st_id === rid) {
            data.push(v);
            return {
              ...v,
              online: false,
            };
          }
          return v;
        }),
      });
      if (data[0].ep_state === constant.exam_paper_state.correcting) {
        return;
      }
      this.unshiftMsg(data, "leave", this.state.msgList);
    };
    // 有学生切屏时的回调
    this.rtc.screenoffCallBack = (rid) => {
      const data = [];
      rid = +rid;
      this.setState({
        epList: this.state.epList.map((v) => {
          if (v.st_id === rid) {
            data.push(v);
            return {
              ...v,
              ep_screenoff_count: v.ep_screenoff_count + 1,
            };
          }
          return v;
        }),
      });
      this.unshiftMsg(data, "screenoff", this.state.msgList);
    };
    this.rtc.handinCallback = (rid) => {
      const data = [];
      rid = +rid;
      this.setState({
        epList: this.state.epList.map((v) => {
          if (v.st_id === rid) {
            data.push(v);
            return {
              ...v,
              ep_state: constant.exam_paper_state.correcting,
            };
          }
          return v;
        }),
      });
      this.unshiftMsg(data, "handin", this.state.msgList);
    };
  }

  unshiftMsg(data, action, arr) {
    data.forEach((v) => {
      switch (action) {
        case "join":
          arr = [
            {
              st_id: v.st_id,
              st_name: v.st_name,
              msg: "加入了考试",
              action,
              date: new Date(),
            },
            ...arr,
          ];
          break;
        case "screenoff":
          arr = [
            {
              st_id: v.st_id,
              st_name: v.st_name,
              msg: "切屏了一次",
              action,
              date: new Date(),
            },
            ...arr,
          ];
          break;
        case "leave":
          arr = [
            {
              st_id: v.st_id,
              st_name: v.st_name,
              msg: "离开了考试",
              action,
              date: new Date(),
            },
            ...arr,
          ];
          break;
        case "handin":
          arr = [
            {
              st_id: v.st_id,
              st_name: v.st_name,
              msg: "交卷了",
              action,
              date: new Date(),
            },
            ...arr,
          ];
          break;
        case "cheat":
          arr = [
            {
              st_id: v.st_id,
              st_name: v.st_name,
              msg: "被您判定为作弊",
              action,
            },
            ...arr,
          ];

        default:
          break;
      }
    });
    localStorage.setItem("msglist", JSON.stringify(arr));
    this.setState({ msgList: arr });
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
    const msgList = JSON.parse(localStorage.getItem("msglist"));
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
      msgList: msgList ? msgList : [],
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
      () => {}
    );

    console.log(parseUserInfo, pa_id);
  }

  switchModalStId(ep) {
    const { st_id } = ep;
    this.setState({ modalStId: st_id, modalObj: ep }, () => {
      if (st_id !== -1) {
        const remoteStream = this.rtc.remoteStreamMap.get(st_id + "");
        if (remoteStream) {
          const videoE = document.querySelector("#camera-window-big");
          videoE.srcObject = remoteStream;
        }
        console.log(st_id, remoteStream, this.rtc.remoteStreamMap);
      }
    });
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
          {this.state.check && (
            <div className="show-info">
              距离考试结束时间还有：
              <div className="count-down">
                <Countdown
                  onFinish={() => {
                    notification.info({ message: "考试已结束，即将跳转" });
                    setTimeout(() => {
                      location.href = "./teacher";
                    }, 500);
                  }}
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
          )}
        </Header>
        {this.state.check ? (
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
              <List
                className="list"
                dataSource={this.state.msgList}
                renderItem={(item, i) => {
                  return (
                    <List.Item
                      key={i}
                      onClick={() => {
                        const ep = this.state.epList.find((v) => {
                          return v.st_id === item.st_id;
                        });
                        this.switchModalStId(ep);
                      }}
                    >
                      学生 <strong>{item.st_name}</strong>{" "}
                      <strong className={"list-action " + item.action}>
                        {item.msg}
                      </strong>
                      <br />
                      {dayjs(item.date).format("HH时mm分ss秒").toString()}
                    </List.Item>
                  );
                }}
              ></List>
            </div>
            <Content className="content">
              <Modal
                open={this.state.modalStId !== -1}
                width={"50vw"}
                onCancel={() => {
                  this.setState({
                    modalStId: -1,
                  });
                }}
                footer={[
                  <Popconfirm
                    title="判定该考试作弊"
                    description="你确定吗，该考试会被直接强制交卷"
                    onConfirm={() => {
                      this.rtc.sendSetCheat(
                        this.state.modalObj.ep_id,
                        this.state.modalStId
                      );
                      const data = [];
                      this.setState({
                        epList: this.state.epList.map((v) => {
                          if (v.ep_id === this.state.modalObj.ep_id) {
                            data.push(v);
                            return {
                              ...v,
                              ep_state: constant.exam_paper_state.cheating,
                            };
                          }
                          return v;
                        }),
                      });
                      this.unshiftMsg(data, "cheat", this.state.msgList);
                    }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger>判定作弊</Button>
                  </Popconfirm>,
                  <Button
                    key={"closeBtn"}
                    onClick={() => {
                      this.setState({
                        modalStId: -1,
                      });
                    }}
                  >
                    关闭
                  </Button>,
                ]}
              >
                <p>
                  学生 <strong>{this.state.modalObj.st_name}</strong> 切屏次数：
                  {this.state.modalObj.ep_screenoff_count}
                </p>
                <video
                  id={"camera-window-big"}
                  autoPlay
                  playsInline
                  style={{
                    width: "90%",
                  }}
                ></video>
              </Modal>
              {this.state.epList.map((ep, i) => {
                return (
                  <Card
                    onClick={() => {
                      this.switchModalStId(ep);
                    }}
                    className={"control-window " + this.state.windowSize}
                    key={i}
                    bodyStyle={{ padding: "0" }}
                    cover={<MyCamera vid={ep.st_id}></MyCamera>}
                  >
                    <span className="name">{ep.st_name}</span>
                    <p>
                      <ExamStudentState
                        key={ep.ep_id}
                        ep={ep}
                      ></ExamStudentState>
                      <span>切屏次数：{ep.ep_screenoff_count}</span>
                    </p>
                  </Card>
                );
              })}
            </Content>
          </Layout>
        ) : (
          <Check
            exam={this.state.paperData}
            opencamara={() => {
              this.setState({ check: true }, () => {
                this.rtc.createWebsocket(this.state.pa_id);
              });
            }}
          ></Check>
        )}
      </Layout>
    );
  }
}

export default App;
