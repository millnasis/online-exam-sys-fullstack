import React from "react";
import "./checkPaper.scss";
import {
  Divider,
  Typography,
  Image,
  Radio,
  Input,
  Checkbox,
  Skeleton,
} from "antd";
import request from "../../../request";
import axios from "axios";
import { connect } from "react-redux";
import constant from "../../../constant";
import EditorWarp from "../../../EditorWarp.jsx";

const { Text, Paragraph, Title } = Typography;

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

const fakeData = {
  ep_id: 49,
  st_id: 5,
  pa_id: 22,
  ep_begindate: "2023-05-12T02:55:02.130+00:00",
  ep_finishdate: "2023-05-12T02:56:16.361+00:00",
  ep_state: "FINISHED",
  ep_screenoff_count: 2,
  st_name: null,
  st_card: null,
  ep_score: 60,
  ep_question: [
    {
      eq_id: 88,
      ep_id: 49,
      qu_id: 46,
      eq_answer: "[1,2]",
      eq_score: 10,
      qu_choose: '["arr[6]","arr.pop()","arr.shift()","arr.unshift()"]',
      qu_describe:
        "已知const arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G']，下面可以获取数组最后一项的表达式有",
      qu_score: 10,
      qu_answer: "[1,2]",
      qu_image: "[]",
      qu_type: "CHO",
    },
    {
      eq_id: 89,
      ep_id: 49,
      qu_id: 47,
      eq_answer: '["填空题"]',
      eq_score: 10,
      qu_choose: "[]",
      qu_describe: "填空题测试____填入答案",
      qu_score: 10,
      qu_answer: '["填空题"]',
      qu_image: "[]",
      qu_type: "FIL",
    },
    {
      eq_id: 90,
      ep_id: 49,
      qu_id: 48,
      eq_answer:
        '"<pre><code class=\\"language-javascript\\">function hello(){\\n    console.log(\\"hello world!!\\")\\n}</code></pre><p><br></p>"',
      eq_score: 40,
      qu_choose: "[1]",
      qu_describe:
        '<p><strong>【颜色分类】</strong></p><p><strong>问题描述: 给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排 列。 </strong></p><p><strong>此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。 </strong></p><p><span style="font-size: 15px;">输入描述:&nbsp;</span></p><blockquote>输入：数组nums </blockquote><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 16px;">输出描述: </span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">输出：数组nums </span></blockquote><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 16px;">输入样例: </span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">2 0 2 1 1 0 </span></blockquote><p><span style="color: rgb(51, 51, 51); background-color: rgb(255, 255, 255); font-size: 16px;">输出样例:</span></p><blockquote><span style="color: rgb(0, 0, 0); background-color: rgb(245, 245, 245); font-size: 13px;">[0,0,1,1,2,2]</span></blockquote>',
      qu_score: 40,
      qu_answer:
        '["<pre><code class=\\"language-javascript\\">constn = +readline();\\nconstmap = newMap();\\nfor(let index = 0; index &lt; n; index++){\\nconststr = readline().trim().toLowerCase();\\nif(map.has(str)){\\nmap.set(str,map.get(str) + 1);\\n} else{\\nmap.set(str,1);\\n}\\n}\\nconstmaxArr = [];\\nlet max = 0;\\nmap.forEach((value,key)=&gt;{\\nif(value &gt; max){\\nmax = value;\\nmaxArr.length = 0;\\nmaxArr.push(key);\\n} elseif(value === max){\\nmaxArr.push(key);\\n}\\n})\\nif(maxArr.length === 1){\\nconsole.log(maxArr[0] + \\" \\"+ max);\\n} else{\\nlet record = maxArr[0];\\nfor(let i = 1;i&lt;maxArr.length; i++){\\nif(maxArr[i] &lt; record){\\nrecord = maxArr[i];\\n}\\n}\\nconsole.log(record + \\" \\"+ max);\\n}</code></pre><p><br></p>"]',
      qu_image: "[]",
      qu_type: "SUB",
    },
  ],
  pa_order: "[46,47,48]",
  gr_id: 3,
  pa_name: "考试测试",
  pa_founddate: "2023-05-11T07:54:57.662+00:00",
  pa_state: "END",
  pa_begintime: "2023-05-11T15:00:00.825+00:00",
  pa_duringtime: 120,
};

function handleRenderQuestionsData(data, paperData) {
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

function RenderScore(props) {
  const { score, total, style } = props;
  const precent = score / total;
  if (precent >= 0.7) {
    return (
      <Text style={style}>
        得分：
        <Text type="success" style={style}>
          {score}
        </Text>
      </Text>
    );
  } else if (precent >= 0.3) {
    return (
      <Text style={style}>
        得分：
        <Text type="warning" style={style}>
          {score}
        </Text>
      </Text>
    );
  } else {
    return (
      <Text style={style}>
        得分：
        <Text type="danger" style={style}>
          {score}
        </Text>
      </Text>
    );
  }
}

function RenderQuestionContent(props) {
  const { question, queue } = props;
  const answer = question.qu_answer;
  const choose = question.qu_choose;
  const image = question.qu_image;
  console.log(answer, choose, image);
  switch (question.qu_type) {
    case constant.question_type.choose:
      return (
        <Typography>
          <Title level={5}>
            {`${queue}. ${question.qu_describe} (${question.qu_score}分)   `}
            <RenderScore
              score={question.eq_score}
              total={question.qu_score}
            ></RenderScore>
          </Title>
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
                      disabled
                      checked={question.inputC[i]}
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
                      disabled
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
          <Title level={5}>
            {`${queue}. ${question.qu_describe} (${question.qu_score}分)   `}
            <RenderScore
              score={question.eq_score}
              total={question.qu_score}
            ></RenderScore>
          </Title>
          {image.map((v, i) => {
            return <Image key={i} src={v}></Image>;
          })}
          <Paragraph>
            {answer.map((v, i) => {
              return (
                <Input
                  addonBefore={i + 1}
                  value={question.inputC[i]}
                  disabled
                ></Input>
              );
            })}
          </Paragraph>
        </Typography>
      );
    case constant.question_type.subject:
      return (
        <Typography>
          <Title level={5}>
            {`${queue}. 主观题 (${question.qu_score}分)   `}
            <RenderScore
              score={question.eq_score}
              total={question.qu_score}
            ></RenderScore>
          </Title>
          <Paragraph>
            <div
              dangerouslySetInnerHTML={{ __html: question.qu_describe }}
            ></div>
          </Paragraph>
          <Title level={5}>参考答案</Title>
          <Paragraph>
            <div dangerouslySetInnerHTML={{ __html: question.qu_answer }}></div>
          </Paragraph>
          <Title level={5}>您的答案</Title>
          <Paragraph>
            <div dangerouslySetInnerHTML={{ __html: question.inputC }}></div>
          </Paragraph>
        </Typography>
      );
  }
}

class CheckPaper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      paperData: fakeData,
      fetching: false,
    };
  }

  componentDidMount() {
    this.getExamPaperData();
  }

  getExamPaperData() {
    const pa_id = this.props.paperId;
    const { userInfo } = this.props.global;
    const { st_id } = userInfo;
    if (pa_id === -1) {
      return;
    }
    this.setState({ fetching: true });
    request(
      axios.get("/exam-papers", { params: { pa_id, st_id } }),
      (response) => {
        if (response.data.code === constant.code.success) {
          this.setState({ paperData: response.data.data });
        }
      },
      () => {
        this.setState({ fetching: false });
      }
    );
  }

  render() {
    const { paperData } = this.state;
    const { userInfo } = this.props.global;
    const [cho, fil, sub] = handleQuestionData(
      paperData.ep_question,
      paperData.pa_order
    );
    const ep_question = handleRenderQuestionsData(
      paperData.ep_question,
      paperData
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
    const subScore = sub.reduce((pre, cur) => pre + cur.eq_score, 0);
    return (
      <div className="check-paper">
        {this.state.fetching ? (
          <Skeleton></Skeleton>
        ) : (
          <Typography className="body">
            <Title>
              考试{" "}
              <span style={{ textDecoration: "underline" }}>
                {paperData.pa_name}
              </span>
              {"   总分：" + paperData.ep_score + "   "}
              <RenderScore
                score={choScore + filScore + subScore}
                total={paperData.ep_score}
                style={{ fontSize: "inherit" }}
              ></RenderScore>
              <br></br>
              <Text type="secondary">
                学号：{userInfo.st_card} 名称：{userInfo.st_name}{" "}
                {paperData.ep_state === constant.exam_paper_state.cheating && (
                  <Text type="danger">已作弊</Text>
                )}
              </Text>
            </Title>
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
                    ["您的答案", "eq_answer"],
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
            <Divider orientation="left">试卷总体</Divider>
            <Paragraph>
              <table border={"1"} cellPadding={5} cellSpacing={0}>
                <tbody>
                  <tr>
                    {[
                      "选择题得分",
                      "填空题得分",
                      "主观题得分",
                      "您的总分",
                      "卷面总分",
                    ].map((v) => {
                      return (
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#eee",
                          }}
                        >
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    {[
                      choScore,
                      filScore,
                      subScore,
                      choScore + filScore + subScore,
                      paperData.ep_score,
                    ].map((v) => (
                      <td>{v}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </Paragraph>
            <Divider orientation="left">试卷内容</Divider>
            {ep_question.map((v, i) => {
              return (
                <RenderQuestionContent
                  question={v}
                  queue={i + 1}
                ></RenderQuestionContent>
              );
            })}
          </Typography>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
  };
}

export default connect(mapStateToProps, null)(CheckPaper);
