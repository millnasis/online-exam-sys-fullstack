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
  Popconfirm,
} from "antd";
import constant from "../constant";
const { Countdown } = Statistic;
const { Header, Footer, Sider, Content } = Layout;
import "./app.scss";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import request from "../request.js";
import axios from "axios";
import Check from "./check.jsx";
import MultiZeroRtc from "./MultiZeroRtc";
import EditorWarp from "../EditorWarp.jsx";

const { Paragraph, Title } = Typography;

const fakeData = [
  {
    qu_id: "123",
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
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
    eq_answer: null,
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
  {
    qu_id: "125",
    eq_answer: null,
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
      return (
        <Typography>
          <Title level={5}>{`${queue}. 主观题 (${question.qu_score}分)`}</Title>
          <Paragraph>
            <div
              dangerouslySetInnerHTML={{ __html: question.qu_describe }}
            ></div>
          </Paragraph>
          <Paragraph>
            <EditorWarp
              quid={question.qu_id}
              value={question.inputC}
              onChange={(v) => {
                changeInputC(v);
              }}
            ></EditorWarp>
          </Paragraph>
        </Typography>
      );
  }
}

function overFlowHandle(content) {
  if (content.length > 30) {
    return content.substring(0, 30) + "...";
  }
  return content;
}

function cancelScreenoffCheck(func) {
  // 网页聚焦切屏检测
  window.onblur = null;
  // 窗口可视切屏检测
  document.removeEventListener("visibilitychange", func);
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check: false,
      userInfo: {},
      paperData: {
        pa_name: "xxx",
        pa_order: "[]",
      },
      questionList: [],
      selectQuestion: -1,
      pa_id: null,
    };

    this.rtc = new MultiZeroRtc("/gs-guide");
    this.rtc.joinCallBack = () => {};
    this.rtc.exitCallBack = () => {};
    this.rtc.cheatCallBack = () => {
      this.setState(
        {
          paperData: {
            ...this.state.paperData,
            ep_state: constant.exam_paper_state.cheating,
          },
        },
        () => {
          notification.error({ message: "您已被老师判定作弊，即将结束答题" });
          setTimeout(() => {
            location.href = "./student";
          }, 1500);
        }
      );
    };

    this.visibilitychangeFunc = null;

    this.changeInputC = this.changeInputC.bind(this);
    this.switchSelectQuestion = this.switchSelectQuestion.bind(this);
    this.startExam = this.startExam.bind(this);
  }

  startExam() {
    request(
      axios.get("/exam-papers", {
        params: { pa_id: this.state.pa_id, st_id: this.state.userInfo.st_id },
      }),
      (response) => {
        if (response.data.code === constant.code.success) {
          console.log(response.data.data);
          if (
            response.data.data.ep_state !== constant.exam_paper_state.ongoing
          ) {
            notification.warning({ message: "试卷已不可作答，即将跳转" });
            setTimeout(() => {
              location.href = "./student";
            }, 1500);
          } else {
            this.setState(
              {
                paperData: response.data.data,
                questionList: this.handleQuestionsData(
                  response.data.data.ep_question,
                  response.data.data
                ),
                check: true,
              },
              () => {
                // 发送join信令
                this.rtc.dojoin();
                // 网页聚焦切屏检测
                window.onblur = () => {
                  this.rtc.sendSetScreenoff(
                    this.state.paperData.ep_id,
                    this.state.paperData.pa_id
                  );

                  this.setState({
                    paperData: {
                      ...this.state.paperData,
                      ep_screenoff_count:
                        this.state.paperData.ep_screenoff_count + 1,
                    },
                  });
                };
                // 窗口可视切屏检测
                const visibilitychangeFunc = () => {
                  if (document.visibilityState === "hidden") {
                    this.rtc.sendSetScreenoff(
                      this.state.paperData.ep_id,
                      this.state.paperData.pa_id
                    );

                    this.setState({
                      paperData: {
                        ...this.state.paperData,
                        ep_screenoff_count:
                          this.state.paperData.ep_screenoff_count + 1,
                      },
                    });
                  }
                };
                this.visibilitychangeFunc = visibilitychangeFunc;
                document.addEventListener(
                  "visibilitychange",
                  visibilitychangeFunc
                );
              }
            );
          }
        }
      },
      () => null
    );
  }

  async componentDidMount() {
    this.rtc.createWebsocket();

    // localStorage.setItem(
    //   "userinfo",
    //   JSON.stringify({
    //     st_id: 123,
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
    this.rtc.setlocalUserId(parseUserInfo.st_id);
    if (pa_id === null) {
      notification.error({ message: "未知的考卷id，请重试" });
      setTimeout(() => {
        location.href = "./student";
      }, 1500);
    }
    this.setState({
      userInfo: parseUserInfo,
      pa_id,
    });

    console.log(parseUserInfo, pa_id);
  }

  handleQuestionsData(data, paperData) {
    console.log(data);
    const order = JSON.parse(paperData.pa_order);
    const orderMap = new Map(order.map((v, i) => [i, v]));
    const dataMap = new Map(data.map((v) => [v.qu_id, v]));
    const arr = new Array(data.length).fill(0).map((v, i) => {
      return dataMap.get(orderMap.get(i));
    });
    return arr.map((v) => {
      const answer = JSON.parse(v.qu_answer);
      const choose = JSON.parse(v.qu_choose);
      const image = JSON.parse(v.qu_image);
      const eq_answer = v.eq_answer === null ? null : JSON.parse(v.eq_answer);
      let inputC;
      switch (v.qu_type) {
        case constant.question_type.choose:
          inputC =
            eq_answer === null
              ? new Array(choose.length).fill(false)
              : new Array(choose.length).fill(false).map((v, i) => {
                  return eq_answer.findIndex((f) => f === i) !== -1;
                });
          break;
        case constant.question_type.fill:
          inputC =
            eq_answer === null ? new Array(answer.length).fill("") : eq_answer;
          break;
        case constant.question_type.subject:
          inputC = eq_answer;
          break;

        default:
          break;
      }
      return {
        ...v,
        qu_answer: answer,
        qu_choose: choose,
        qu_image: image,
        finish: eq_answer !== null,
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

  switchSelectQuestion(index) {
    // 将当前已答完的题目序号保存下来并获取
    const preI = this.state.selectQuestion;
    const question = this.state.questionList[preI];
    // 如果已经作答并且序号不是-1则执行
    if (preI !== -1 && question.finish) {
      let answerN =
        question.qu_type === constant.question_type.choose
          ? question.inputC
              .map((v, i) => {
                if (v) {
                  return i;
                } else {
                  return -1;
                }
              })
              .filter((v) => v !== -1)
          : question.inputC;
      const eq_answer = JSON.stringify(answerN);
      const obj = {
        ...question,
        qu_answer: JSON.stringify(question.qu_answer),
        qu_choose: JSON.stringify(question.qu_choose),
        qu_image: JSON.stringify(question.qu_image),
        eq_answer,
      };
      request(
        axios.post("/exam-questions", obj),
        () => null,
        () => null
      );
    }
    this.setState({ selectQuestion: index });
  }

  render() {
    const { selectQuestion, userInfo, paperData } = this.state;
    const order = JSON.parse(paperData.pa_order);
    const selectItem = this.state.questionList[selectQuestion];
    const begindeadline = dayjs(paperData.pa_begintime);
    const deadline = dayjs(
      begindeadline.toDate().getTime() + paperData.pa_duringtime * 1000 * 60
    );
    return (
      <Layout className="home">
        <Header className="header">
          <div className="user-info">
            <Avatar
              src={userInfo.st_avatar}
              size={"large"}
              className="ft-avatar"
            ></Avatar>
            <span>{userInfo.st_name}</span>
          </div>
          {this.state.check && (
            <div className="show-info">
              距离考试结束时间还有：
              <div className="count-down">
                <Countdown
                  onFinish={() => {
                    this.switchSelectQuestion(-1);
                    cancelScreenoffCheck(this.visibilitychangeFunc);
                    notification.info({ message: "考试已结束，即将跳转" });
                    setTimeout(() => {
                      location.href = "./student";
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

          <div className="camera-window-header">
            <video
              id="camera-window-header"
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
          </div>

          {this.state.check && (
            <div className="screenoff-count">
              切屏次数：{paperData.ep_screenoff_count}
            </div>
          )}
          {this.state.check && (
            <div className="exam-state">
              当前考试状态：
              {paperData.ep_state === constant.exam_paper_state.cheating ? (
                <span style={{ color: "red" }}>作弊</span>
              ) : (
                <span style={{ color: "darkgreen" }}>正常考试</span>
              )}
            </div>
          )}
        </Header>
        <Layout className="body">
          {this.state.check ? (
            <>
              <div className="sider">
                <List
                  header={
                    <h1>
                      {paperData.pa_name} 考试，共{order.length}题
                    </h1>
                  }
                  className="sider-question-list"
                  dataSource={this.state.questionList}
                  renderItem={(item, index) => {
                    return (
                      <List.Item
                        onClick={() => this.switchSelectQuestion(index)}
                        className="question-list-item"
                        key={item.qu_id}
                        actions={[
                          item.finish && <CheckOutlined></CheckOutlined>,
                        ]}
                      >
                        {item.qu_type === constant.question_type.subject ? (
                          <strong>{`${index + 1}. 主观题`}</strong>
                        ) : (
                          <>
                            <strong>{`${index + 1}. ${overFlowHandle(
                              item.qu_describe
                            )}`}</strong>
                          </>
                        )}
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
                      queue={selectQuestion + 1}
                      question={selectItem}
                      changeInputC={this.changeInputC}
                    ></RenderQuestionContent>
                  )}
                </div>
                <div className="content-btn-control">
                  <Button
                    onClick={() =>
                      this.switchSelectQuestion(this.state.selectQuestion - 1)
                    }
                    disabled={selectQuestion === -1 || selectQuestion === 0}
                  >
                    上一题
                  </Button>
                  <Popconfirm
                    title="提前交转"
                    description="确定要交卷吗，交卷后不可再作答"
                    onConfirm={() => {
                      this.switchSelectQuestion(-1);
                      request(
                        axios.post("/exam-papers/handin", {
                          ...this.state.paperData,
                        }),
                        (response) => {
                          if (response.data.code === constant.code.success) {
                            cancelScreenoffCheck(this.visibilitychangeFunc);
                            notification.success({
                              message: "交卷成功，即将跳转",
                            });
                            setTimeout(() => {
                              location.href = "./student";
                            }, 1500);
                          }
                        },
                        () => {}
                      );
                    }}
                  >
                    <Button type="primary">交卷</Button>
                  </Popconfirm>
                  <Button
                    disabled={
                      selectQuestion === -1 ||
                      selectQuestion === this.state.questionList.length - 1
                    }
                    onClick={() =>
                      this.switchSelectQuestion(this.state.selectQuestion + 1)
                    }
                  >
                    下一题
                  </Button>
                </div>
              </Content>
            </>
          ) : (
            <Check
              opencamera={() => {
                this.rtc.initLocalStream(this.state.pa_id);
              }}
              setlocalvideo={this.rtc.setLocalVideo}
              startexam={this.startExam}
              reopenlocalstream={this.rtc.reopenLocalStream}
            ></Check>
          )}
        </Layout>
      </Layout>
    );
  }
}

export default App;
