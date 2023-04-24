import React from "react";
import {
  Layout,
  Typography,
  List,
  Checkbox,
  Radio,
  Statistic,
  Image,
  Avatar,
  Button,
  Input,
  notification,
} from "antd";
import constant from "../constant";
const { Countdown } = Statistic;
const { Header, Footer, Sider, Content } = Layout;
import "./app.scss";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import request from "../request.js";
import axios from "axios";

const { Paragraph, Title } = Typography;

const fakeData = [
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe:
      "瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0,1]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "12322",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[1,2]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image: "[]",
  },
  {
    qu_id: "124",
    pa_id: "1234",
    qu_type: constant.question_type.fill,
    qu_answer: '["fuck","die"]',
    qu_describe: "asjdoiasj___doia___sjdas?",
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
  {
    qu_id: "125",
    pa_id: "1235",
    qu_type: constant.question_type.subject,
    qu_answer: "[]",
    qu_describe: "<div>fasdjaklsdjalskduck?</div>",
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
];

const numberMap = new Map();
numberMap.set(0, "A");
numberMap.set(1, "B");
numberMap.set(2, "C");
numberMap.set(3, "D");
numberMap.set(4, "E");
numberMap.set(5, "F");
numberMap.set(6, "G");

function RenderQuestionContent(props) {
  const { question, changeInputC, queue } = props;
  const answer = question.qu_answer;
  const choose = question.qu_choose;
  const image = question.qu_image;
  console.log(answer, choose, image);
  switch (question.qu_type) {
    case constant.question_type.choose:
      return (
        <Typography>
          <Title
            level={5}
          >{`${queue}. ${question.qu_describe} (${question.qu_score}分)`}</Title>
          {image.map((v, i) => {
            return <Image key={i} src={v}></Image>;
          })}
          <Paragraph>
            {answer.length > 1
              ? choose.map((v, i) => {
                  return (
                    <Checkbox
                      name={question.qu_id}
                      key={i}
                      checked={question.inputC[i]}
                      onChange={(e) => {
                        const arr = [...question.inputC];
                        arr[i] = e.target.checked;
                        changeInputC(arr);
                      }}
                    >
                      {v}
                    </Checkbox>
                  );
                })
              : choose.map((v, i) => {
                  return (
                    <Radio
                      name={question.qu_id}
                      key={i}
                      checked={question.inputC[i]}
                      onChange={(e) => {
                        const arr = new Array(question.inputC.length).fill(
                          false
                        );
                        arr[i] = e.target.checked;
                        changeInputC(arr);
                      }}
                    >
                      {v}
                    </Radio>
                  );
                })}
          </Paragraph>
        </Typography>
      );
    case constant.question_type.fill:
      return (
        <Typography>
          <Title
            level={5}
          >{`${queue}. ${question.qu_describe} (${question.qu_score}分)`}</Title>
          {image.map((v, i) => {
            return <Image key={i} src={v}></Image>;
          })}
          <Paragraph>
            {answer.map((v, i) => {
              return (
                <Input
                  addonBefore={i + 1}
                  value={question.inputC[i]}
                  onChange={(e) => {
                    const arr = [...question.inputC];
                    arr[i] = e.currentTarget.value;
                    changeInputC(arr);
                  }}
                ></Input>
              );
            })}
          </Paragraph>
        </Typography>
      );
    case constant.question_type.subject:
      return <div></div>;
  }
}

function Check() {
  //检测电脑设备是否已经安装了摄像头
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
    navigator.enumerateDevices = function (callback) {
      navigator.mediaDevices.enumerateDevices().then(callback);
    };
  }
  var MediaDevices = [];
  var isHTTPs = location.protocol === "https:";
  var canEnumerate = false;

  if (
    typeof MediaStreamTrack !== "undefined" &&
    "getSources" in MediaStreamTrack
  ) {
    canEnumerate = true;
  } else if (
    navigator.mediaDevices &&
    !!navigator.mediaDevices.enumerateDevices
  ) {
    canEnumerate = true;
  }

  var hasWebcam = false;

  var isWebcamAlreadyCaptured = false;

  function checkDeviceSupport(callback) {
    if (!canEnumerate) {
      return;
    }

    if (
      !navigator.enumerateDevices &&
      window.MediaStreamTrack &&
      window.MediaStreamTrack.getSources
    ) {
      navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
        window.MediaStreamTrack
      );
    }

    if (!navigator.enumerateDevices && navigator.enumerateDevices) {
      navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
    }

    if (!navigator.enumerateDevices) {
      if (callback) {
        callback();
      }
      return;
    }

    MediaDevices = [];
    navigator.enumerateDevices(function (devices) {
      devices.forEach(function (_device) {
        var device = {};
        for (var d in _device) {
          device[d] = _device[d];
        }

        if (device.kind === "audio") {
          device.kind = "audioinput";
        }

        if (device.kind === "video") {
          device.kind = "videoinput";
        }

        var skip;
        MediaDevices.forEach(function (d) {
          if (d.id === device.id && d.kind === device.kind) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }

        if (!device.deviceId) {
          device.deviceId = device.id;
        }

        if (!device.id) {
          device.id = device.deviceId;
        }

        if (!device.label) {
          device.label = "Please invoke getUserMedia once.";
          if (!isHTTPs) {
            device.label =
              "HTTPs is required to get label of this " +
              device.kind +
              " device.";
          }
        } else {
          if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
            isWebcamAlreadyCaptured = true;
          }
        }

        if (device.kind === "videoinput") {
          hasWebcam = true;
        }

        // there is no 'videoouput' in the spec.

        MediaDevices.push(device);
      });

      if (callback) {
        callback();
      }
    });
  }
  //end

  checkDeviceSupport(function () {
    if (hasWebcam == false) {
      console.log("没有摄像头！");
      return false;
    } else {
      if (isWebcamAlreadyCaptured == false) {
        console.log("捕获摄像头失败，请重新安装摄像头！");
        return false;
      }
    }
  });
}

function overFlowHandle(content) {
  if (content.length > 30) {
    return content.substring(0, 30) + "...";
  }
  return content;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      paperData: {},
      questionList: this.handleQuestionsData(fakeData),
      selectQuestion: -1,
    };

    this.changeInputC = this.changeInputC.bind(this);
  }

  async componentDidMount() {
    Check();
    window.onblur = () => {
      console.log("切了一次");
    };
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        console.log("切了一次");
      }
    });
    localStorage.setItem(
      "userinfo",
      JSON.stringify({
        st_id: 123,
        st_name: "MillNasis",
        st_sex: "M",
        st_avatar:
          "https://img-blog.csdnimg.cn/img_convert/4cef4c0a5c42d4ccae9ba327c550350b.png",
        st_age: 23,
        st_registerdate: "2023-02-07",
        st_password: null,
        st_card: "3192052051725",
      })
    );
    localStorage.setItem("pa_id", 123);
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo === null) {
      notification.error({ message: "未找到您的登陆信息，请重新登陆" });
      setTimeout(() => {
        location.href = "./login";
      }, 1500);
    }
    const pa_id = localStorage.getItem("pa_id");
    if (pa_id === null) {
      notification.error({ message: "未知的考卷id，请重试" });
      setTimeout(() => {
        location.href = "./student";
      }, 1500);
    }
    this.setState({
      userInfo: JSON.parse(userInfo),
    });

    request(
      axios.get("/exam-papers", { data: { pa_id, st_id: userInfo.st_id } }),
      (response) => {
        if (response.data.code === constant.code.success) {
          this.setState({
            paperData: response.data.data,
            questionList: handleQuestionsData(response.data.data.ep_question),
          });
        }
      },
      () => null
    );
  }

  handleQuestionsData(data) {
    return data.map((v) => {
      const answer = JSON.parse(v.qu_answer);
      const choose = JSON.parse(v.qu_choose);
      const image = JSON.parse(v.qu_image);
      let inputC;
      switch (v.qu_type) {
        case constant.question_type.choose:
          inputC = new Array(answer.length).fill(false);
          break;
        case constant.question_type.fill:
          inputC = new Array(answer.length).fill("");
          break;
        case constant.question_type.subject:
          break;

        default:
          break;
      }
      return {
        ...v,
        qu_answer: answer,
        qu_choose: choose,
        qu_image: image,
        finish: false,
        inputC,
      };
    });
  }

  changeInputC(obj) {
    this.setState({
      questionList: this.state.questionList.map((v, i) => {
        if (i !== this.state.selectQuestion) {
          return v;
        }
        return {
          ...v,
          inputC: obj,
          finish: true,
        };
      }),
    });
  }

  render() {
    const { selectQuestion, userInfo } = this.state;
    const selectItem = this.state.questionList[selectQuestion];
    return (
      <Layout className="home">
        <Header className="header">
          <div
            className="user-info"
            onClick={() => {
              document.documentElement.requestFullscreen();
            }}
          >
            <Avatar
              src={userInfo.st_avatar}
              size={"large"}
              className="ft-avatar"
            ></Avatar>
            <span>{userInfo.st_name}</span>
          </div>
          <div className="show-info">
            距离考试结束时间还有：
            <div className="count-down">
              <Countdown
                value={dayjs(Date.now() + 120 * 1000)}
                valueStyle={{ fontSize: "14px", color: "#fff", zIndex: "9999" }}
                format="D 天 H 时 m 分 s 秒"
              ></Countdown>
            </div>
          </div>
        </Header>
        <Layout className="body">
          <div className="sider">
            <List
              header={<h1>xxx考试，共x题</h1>}
              className="sider-question-list"
              dataSource={this.state.questionList}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    onClick={() => this.setState({ selectQuestion: index })}
                    className="question-list-item"
                    key={item.qu_id}
                    actions={[item.finish && <CheckOutlined></CheckOutlined>]}
                  >
                    <strong>{`${index + 1}. ${overFlowHandle(
                      item.qu_describe
                    )}`}</strong>
                    {`(${item.qu_score}分)`}
                  </List.Item>
                );
              }}
            ></List>
          </div>
          <Content className="content">
            <div className="content-body">
              {selectQuestion !== -1 && (
                <RenderQuestionContent
                  queue={selectQuestion}
                  question={selectItem}
                  changeInputC={this.changeInputC}
                ></RenderQuestionContent>
              )}
            </div>
            <div className="content-btn-control">
              <Button disabled={selectQuestion === -1 || selectQuestion === 0}>
                上一题
              </Button>
              <Button type="primary">交卷</Button>
              <Button
                disabled={
                  selectQuestion === -1 ||
                  selectQuestion === this.state.questionList.length - 1
                }
              >
                下一题
              </Button>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
