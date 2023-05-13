import {
  Affix,
  Alert,
  Badge,
  Button,
  Collapse,
  Divider,
  InputNumber,
  Progress,
  Typography,
  DatePicker,
  Skeleton,
  Popconfirm,
  notification,
} from "antd";
import React from "react";
import request from "../../../request";
import axios from "axios";
import constant from "../../../constant";
import { green } from "@ant-design/colors";
import "./correctPaper.scss";
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const fakeData = {
  pa_id: 21,
  gr_id: 3,
  pa_name: "fuck",
  pa_founddate: "2023-05-09T03:01:34.395+00:00",
  pa_state: "END",
  pa_begintime: "2023-05-09T18:03:03.287+00:00",
  pa_duringtime: 120,
  pa_order: "[34,45,38,39,32,46]",
  ep_list: [
    {
      ep_id: 34,
      st_id: 5,
      pa_id: 21,
      ep_begindate: "2023-05-09T08:18:26.585+00:00",
      ep_finishdate: "2023-05-09T08:21:39.480+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 1,
      st_name: "个人信息修改测试",
      st_card: "123",
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 35,
      st_id: 6,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.497+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: "学生测试2",
      st_card: "123123",
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 36,
      st_id: 7,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.568+00:00",
      ep_state: "CHEATING",
      ep_screenoff_count: 0,
      st_name: "学生测试3",
      st_card: "1233",
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 37,
      st_id: 8,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.668+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: "学生测试4",
      st_card: "1234",
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
    {
      ep_id: 38,
      st_id: 9,
      pa_id: 21,
      ep_begindate: null,
      ep_finishdate: "2023-05-09T08:36:13.800+00:00",
      ep_state: "CORRECTING",
      ep_screenoff_count: 0,
      st_name: "学生测试5",
      st_card: "1235",
      ep_score: null,
      ep_question: null,
      pa_order: null,
      gr_id: 0,
      pa_name: null,
      pa_founddate: null,
      pa_state: null,
      pa_begintime: null,
      pa_duringtime: 0,
    },
  ],
};

const fakeQuestionData = [
  {
    eq_id: 53,
    ep_id: 34,
    qu_id: 45,
    eq_answer:
      '"<pre><code class=\\"language-javascript\\">function dofunc(str){\\n    console.log(\\"ans\\" + str);\\n}\\n\\ndofunc(\\"hello\\");</code></pre><p><br></p>"',
    eq_score: 0,
    qu_choose: "[]",
    qu_describe:
      '<h1><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 24px;">【罗马数字转整数】</span></h1><p><span style="font-size: 19px;"><strong>问题描述: 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M, 分别对应数字：1，5， 10， 50，100，500，1000。例如， 罗马数字 2 写做 II ，即 为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做 XXVII, 即为 XX + V + II 。 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于 大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>输入描述：</strong></span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">输入：字符串s </span></blockquote><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 19px;"><strong>输出描述: </strong></span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">输出：字符串ans </span></blockquote><p><span style="font-size: 19px;"><strong>输入样例:&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>M&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>输出样例:&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>1000</strong></span></p>',
    qu_score: 50,
    qu_answer: "null",
    qu_image: "[]",
    qu_type: "SUB",
  },
  {
    eq_id: 55,
    ep_id: 377,
    qu_id: 46,
    eq_answer:
      '"<pre><code class=\\"language-javascript\\">function dofunc(str){\\n    console.log(\\"ans\\" + str);\\n}\\n\\ndofunc(\\"hello\\");</code></pre><p><br></p>"',
    eq_score: 0,
    qu_choose: "[]",
    qu_describe:
      '<h1><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 24px;">【罗马数字转整数】</span></h1><p><span style="font-size: 19px;"><strong>问题描述: 罗马数字包含以下七种字符: I， V， X， L，C，D 和 M, 分别对应数字：1，5， 10， 50，100，500，1000。例如， 罗马数字 2 写做 II ，即 为两个并列的 1。12 写做 XII ，即为 X + II 。 27 写做 XXVII, 即为 XX + V + II 。 通常情况下，罗马数字中小的数字在大的数字的右边。但也存在特例，例如 4 不写做 IIII，而是 IV。数字 1 在数字 5 的左边，所表示的数等于 大数 5 减小数 1 得到的数值 4 。同样地，数字 9 表示为 IX。这个特殊的规则只适用于以下六种情况：&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>I 可以放在 V (5) 和 X (10) 的左边，来表示 4 和 9。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>X 可以放在 L (50) 和 C (100) 的左边，来表示 40 和 90。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>C 可以放在 D (500) 和 M (1000) 的左边，来表示 400 和 900。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>给定一个罗马数字，将其转换成整数。输入确保在 1 到 3999 的范围内。&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>输入描述：</strong></span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">输入：字符串s </span></blockquote><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 19px;"><strong>输出描述: </strong></span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">输出：字符串ans </span></blockquote><p><span style="font-size: 19px;"><strong>输入样例:&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>M&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>输出样例:&nbsp;</strong></span></p><p><span style="font-size: 19px;"><strong>1000</strong></span></p>',
    qu_score: 50,
    qu_answer: "null",
    qu_image: "[]",
    qu_type: "SUB",
  },
  {
    eq_id: 51,
    ep_id: 33,
    qu_id: 38,
    eq_answer: "[0]",
    eq_score: 0,
    qu_choose: '["[2,3]和[2,3]","[2,3]和[2]"]',
    qu_describe: "输入题目描述以下代码输出",
    qu_score: 10,
    qu_answer: "[1]",
    qu_image: '["/img/questions/38/c1de06fa6bf64c629dc9032f10f4b0bd.jpg"]',
    qu_type: "CHO",
  },
  {
    eq_id: 52,
    ep_id: 33,
    qu_id: 39,
    eq_answer: '["87.5%"]',
    eq_score: 10,
    qu_choose: "[]",
    qu_describe:
      "假定某次上线，1小时内出bug的概率为50%，那么3小时内出bug的概率是？",
    qu_score: 10,
    qu_answer: '["87.5%"]',
    qu_image: "[]",
    qu_type: "FIL",
  },
  {
    eq_id: 29,
    ep_id: 17,
    qu_id: 32,
    eq_answer: "[1]",
    eq_score: 10,
    qu_choose: '["测试1","测试2","测试3"]',
    qu_describe: "选择题测试",
    qu_score: 10,
    qu_answer: "[1]",
    qu_image: '["/img/questions/32/5ea609a007fe40c6aeb998379fc6a653.jpeg"]',
    qu_type: "CHO",
  },
  {
    eq_id: 30,
    ep_id: 17,
    qu_id: 34,
    eq_answer: '["哈哈","填空题测试2"]',
    eq_score: 5,
    qu_choose: "[]",
    qu_describe: "填空题测试",
    qu_score: 10,
    qu_answer: '["填空题测试1","填空题测试2"]',
    qu_image: "[]",
    qu_type: "FIL",
  },
];

/**
 *
 * @param {Array} questions
 * @param {String} order
 */
function handleQuestionData(questions, order) {
  order = JSON.parse(order).map((v) => +v);
  const cho = [];
  const fil = [];
  const sub = [];
  order.forEach((o, i) => {
    const qu = questions.find((v) => v.qu_id === o);
    if (!qu) {
      return;
    }
    qu.order = i + 1;
    switch (qu.qu_type) {
      case constant.question_type.choose:
        cho.push(qu);
        break;
      case constant.question_type.fill:
        fil.push(qu);
        break;
      case constant.question_type.subject:
        sub.push(qu);
        break;
    }
  });
  return [cho, fil, sub];
}

const map = new Map();
map.set(0, "A");
map.set(1, "B");
map.set(2, "C");
map.set(3, "D");
map.set(4, "E");
map.set(5, "F");
/**
 *
 * @param {Array} choose
 * @param {String} type
 */
function handleChooseAnswer(choose, type) {
  let output = "";
  choose = JSON.parse(choose);
  if (Array.isArray(choose)) {
    choose.forEach((v) => {
      if (type === constant.question_type.choose) {
        output += map.get(+v) + " ";
      } else {
        output += v + ",";
      }
    });
  }
  return output;
}

class CorrectPaper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paperData: fakeData,
      examPaperData: {},
      examPaperQuestionData: fakeQuestionData,
      currentExPaperId: -1,
      fetching: false,
    };

    this.timeout = null;

    this.correctQuestion = this.correctQuestion.bind(this);
  }

  async switchExPaper(id = -1) {
    if (id !== -1) {
      this.setState({
        fetching: true,
        examPaperData: this.state.paperData.ep_list.find((v) => v.ep_id === id),
      });
      await request(
        axios.get("/exam-questions/" + id),
        (response) => {
          if (response.data.code === constant.code.success) {
            this.setState({ examPaperQuestionData: response.data.data });
          }
        },
        () => {
          this.setState({ currentExPaperId: id, fetching: false });
        }
      );
    } else {
      this.setState({ currentExPaperId: id, fetching: false });
    }
  }

  async getPaperData() {
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    await request(
      axios.get("/papers/ep/" + paperId),
      (response) => {
        if (response.data.code === constant.code.success) {
          this.setState({ paperData: response.data.data });
        }
      },
      () => {}
    );
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    await this.getPaperData();
    if (this.state.paperData.ep_list.length > 0) {
      await this.switchExPaper(
        this.state.paperData.ep_list.find(
          (v) => v.ep_state === constant.exam_paper_state.correcting
        ).ep_id
      );
    }
  }

  async correctQuestion(sign, v, value, sub) {
    if (value > v.qu_score) {
      value = v.qu_score;
    }
    if (value < 0) {
      value = 0;
    }
    if (sign.length === 0) {
      sign.push(1);
    }
    const eq = { ...v, eq_score: value, qu_choose: JSON.stringify(sign) };
    this.setState({
      examPaperQuestionData: this.state.examPaperQuestionData.map((q) => {
        if (q.ep_id !== v.ep_id) {
          return q;
        }
        return eq;
      }),
    });
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    let finish = true;
    sub.forEach((s) => {
      const Ssign = JSON.parse(s.qu_choose);
      if (s.eq_id !== v.eq_id && Ssign.length === 0) {
        finish = false;
      }
    });
    if (finish) {
      this.setState({
        paperData: {
          ...this.state.paperData,
          ep_list: this.state.paperData.ep_list.map((epa) => {
            if (epa.ep_id === v.ep_id) {
              return { ...epa, ep_state: constant.exam_paper_state.finished };
            }
            return epa;
          }),
        },
      });
    }
    this.timeout = setTimeout(() => {
      request(
        axios.post("/exam-questions/correct", { eq, finish }),
        () => {},
        () => {}
      );
    }, 1000);
  }

  render() {
    const { menuselect } = this.props;
    const { paperData, examPaperData, examPaperQuestionData } = this.state;
    let unfinishPaper = 0,
      totalPaper = paperData.ep_list.length;
    paperData.ep_list.forEach((v) => {
      if (v.ep_state === constant.exam_paper_state.correcting) {
        unfinishPaper++;
      }
    });
    const progressPercent = ((totalPaper - unfinishPaper) / totalPaper) * 100;
    const [cho, fil, sub] = handleQuestionData(
      examPaperQuestionData,
      paperData.pa_order
    );
    const choScore = cho.reduce((pre, cur) => {
      return pre + cur.eq_score;
    }, 0);
    const choTotal = cho.reduce((pre, cur) => {
      return pre + cur.qu_score;
    }, 0);
    const filScore = fil.reduce((pre, cur) => {
      return pre + cur.eq_score;
    }, 0);
    const filTotal = fil.reduce((pre, cur) => {
      return pre + cur.qu_score;
    }, 0);
    return (
      <div className="correct-paper">
        <Collapse>
          <Panel
            header={`共${totalPaper}份试卷 ${unfinishPaper}份未完成批改`}
            className="panel"
          >
            <div style={{ width: "100%" }} className="panel-item-warp">
              {paperData.ep_list.map((v, i) => {
                return (
                  <Badge
                    offset={[-10, 30]}
                    style={{
                      backgroundColor:
                        v.ep_state === constant.exam_paper_state.cheating
                          ? "red"
                          : "green",
                    }}
                    count={
                      v.ep_state === constant.exam_paper_state.cheating
                        ? "x"
                        : v.ep_state === constant.exam_paper_state.finished
                        ? "√"
                        : 0
                    }
                  >
                    <Button
                      className="btn"
                      onClick={() => {
                        this.switchExPaper(v.ep_id);
                      }}
                    >
                      {i + 1}
                    </Button>
                  </Badge>
                );
              })}
            </div>
          </Panel>
        </Collapse>
        {this.state.fetching ? (
          <Skeleton></Skeleton>
        ) : (
          <Typography className="body">
            <Title>
              批改试卷{" "}
              <span style={{ textDecoration: "underline" }}>
                {paperData.pa_name}
              </span>
              <Popconfirm
                title="结束批改试卷"
                description="确定要结束吗，结束后试卷不可再修改"
                onConfirm={() => {
                  request(
                    axios.post("/papers/finish/" + paperData.pa_id),
                    (response) => {
                      if (response.data.code === constant.code.success) {
                        notification.success({ message: "结束成功，即将跳转" });
                        setTimeout(() => {
                          menuselect("welcome");
                        }, 500);
                      }
                    },
                    () => {}
                  );
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="primary"
                  disabled={unfinishPaper > 0}
                  style={{ marginLeft: "20px" }}
                >
                  结束批改
                </Button>
              </Popconfirm>
              <br />
              <Text type="secondary">
                {/* 应该改为st_card */}
                学号：{examPaperData.st_id} 名称：{examPaperData.st_name}{" "}
                {examPaperData.ep_state ===
                  constant.exam_paper_state.cheating && (
                  <Text type="danger">已作弊</Text>
                )}
              </Text>
            </Title>
            <Affix offsetTop={10} className="affix">
              <div>
                <strong>未批改的主观题</strong>
                <br />
                <div>
                  {sub.map((v) => {
                    const sign = JSON.parse(v.qu_choose);
                    return (
                      <Badge
                        offset={[-10, 30]}
                        style={{ backgroundColor: "green", zIndex: 1000 }}
                        count={
                          examPaperData.ep_state ===
                          constant.exam_paper_state.cheating
                            ? 0
                            : sign.length > 0
                            ? "√"
                            : 0
                        }
                      >
                        <Button
                          onClick={() => {
                            document
                              .querySelector("#sub" + v.order)
                              .scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          {v.order}
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </Affix>
            <Divider orientation="left">选择题</Divider>
            <Text type="secondary">
              总分：<Text type="warning">{choTotal}</Text>&nbsp; 得分：
              <Text type="success">{choScore}</Text>&nbsp; 扣分：
              <Text type="danger">{choTotal - choScore}</Text>&nbsp;
            </Text>
            <Paragraph>
              <table border={"1"} cellPadding={5} cellSpacing={0}>
                <tbody>
                  {[
                    ["题号", "order"],
                    ["正确答案", "qu_answer"],
                    ["学生答案", "eq_answer"],
                    ["得分", "eq_score"],
                  ].map((v, i) => (
                    <tr>
                      <td
                        style={{ fontWeight: "bold", backgroundColor: "#eee" }}
                      >
                        {v[0]}
                      </td>
                      {cho.map((c) => (
                        <td>
                          {i === 1 || i === 2
                            ? handleChooseAnswer(
                                c[v[1]],
                                constant.question_type.choose
                              )
                            : c[v[1]]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paragraph>
            <Divider orientation="left">填空题</Divider>
            <Text type="secondary">
              总分：<Text type="warning">{filTotal}</Text>&nbsp; 得分：
              <Text type="success">{filScore}</Text>&nbsp; 扣分：
              <Text type="danger">{filTotal - filScore}</Text>&nbsp;
            </Text>
            <Paragraph>
              <table border={"1"} cellPadding={5} cellSpacing={0}>
                <tbody>
                  {[
                    ["题号", "order"],
                    ["正确答案", "qu_answer"],
                    ["学生答案", "eq_answer"],
                    ["得分", "eq_score"],
                  ].map((v, i) => (
                    <tr>
                      <td
                        style={{ fontWeight: "bold", backgroundColor: "#eee" }}
                      >
                        {v[0]}
                      </td>
                      {fil.map((c) => (
                        <td>
                          {i === 1 || i === 2
                            ? handleChooseAnswer(
                                c[v[1]],
                                constant.question_type.fill
                              )
                            : c[v[1]]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paragraph>
            <Divider orientation="left">主观题</Divider>
            {sub.map((v, i) => {
              const sign = JSON.parse(v.qu_choose);
              let qu_answer = JSON.parse(v.qu_answer);
              let eq_answer = JSON.parse(v.eq_answer);
              qu_answer = Array.isArray(qu_answer) ? qu_answer[0] : qu_answer;
              return (
                <Badge.Ribbon
                  text={sign.length > 0 ? "已阅" : "未阅"}
                  color={sign.length > 0 ? "green" : "red"}
                >
                  <Paragraph key={i}>
                    <Title level={4} id={"sub" + v.order}>
                      主观题{i + 1}（题号：{v.order}）
                    </Title>
                    <div
                      dangerouslySetInnerHTML={{ __html: v.qu_describe }}
                    ></div>
                    <Alert
                      type="info"
                      message={
                        <>
                          <Title level={4}>标准答案</Title>
                          <div
                            dangerouslySetInnerHTML={{ __html: qu_answer }}
                          ></div>
                        </>
                      }
                    ></Alert>
                    <Alert
                      type="success"
                      message={
                        <>
                          <Title level={4}>学生答案</Title>
                          <div
                            dangerouslySetInnerHTML={{ __html: eq_answer }}
                          ></div>
                        </>
                      }
                    ></Alert>
                    {examPaperData.ep_state ===
                      constant.exam_paper_state.cheating || (
                      <Alert
                        type="warning"
                        message={
                          <>
                            <Title level={4}>打分</Title>
                            <Title level={5}>
                              总分：{v.qu_score} 得分：
                              <InputNumber
                                value={v.eq_score}
                                min={0}
                                max={v.qu_score}
                                defaultValue={0}
                                style={{ marginRight: "20px" }}
                                onChange={(value) => {
                                  this.correctQuestion(sign, v, value, sub);
                                }}
                              ></InputNumber>
                              <Button.Group>
                                <Button
                                  onClick={() => {
                                    this.correctQuestion(sign, v, 0, sub);
                                  }}
                                >
                                  0%
                                </Button>
                                <Button
                                  onClick={() => {
                                    this.correctQuestion(
                                      sign,
                                      v,
                                      Math.floor(v.qu_score / 3),
                                      sub
                                    );
                                  }}
                                >
                                  33%
                                </Button>
                                <Button
                                  onClick={() => {
                                    this.correctQuestion(
                                      sign,
                                      v,
                                      Math.floor(v.qu_score / 2),
                                      sub
                                    );
                                  }}
                                >
                                  50%
                                </Button>
                                <Button
                                  onClick={() => {
                                    this.correctQuestion(
                                      sign,
                                      v,
                                      Math.floor((v.qu_score * 3) / 5),
                                      sub
                                    );
                                  }}
                                >
                                  66%
                                </Button>
                                <Button
                                  onClick={() => {
                                    this.correctQuestion(
                                      sign,
                                      v,
                                      v.qu_score,
                                      sub
                                    );
                                  }}
                                >
                                  100%
                                </Button>
                              </Button.Group>
                            </Title>
                          </>
                        }
                      ></Alert>
                    )}
                  </Paragraph>
                </Badge.Ribbon>
              );
            })}
            <Divider orientation="left">批改进度</Divider>
            <p>
              完成{totalPaper - unfinishPaper}/{totalPaper}份 &nbsp;&nbsp;&nbsp;
              <Progress
                percent={progressPercent}
                steps={totalPaper}
                strokeColor={green[6]}
              />
              <Button
                type="primary"
                onClick={() => {
                  const ep = this.state.paperData.ep_list.find(
                    (v) => v.ep_state === constant.exam_paper_state.correcting
                  );
                  let epid =
                    typeof ep === "object"
                      ? ep.ep_id
                      : this.state.paperData.ep_list[0].ep_id;

                  this.switchExPaper(epid);
                  window.scrollTo(0, 0);
                }}
              >
                下一份未批改试卷
              </Button>
            </p>
          </Typography>
        )}
      </div>
    );
  }
}

export default CorrectPaper;
