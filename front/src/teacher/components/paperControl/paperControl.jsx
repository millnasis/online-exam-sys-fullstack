import React, { useState } from "react";
import "./paperControl.scss";
import request from "../../../request";
import axios from "axios";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Divider,
  Image,
  Input,
  InputNumber,
  Radio,
  Row,
  Typography,
} from "antd";

import { PlusOutlined } from "@ant-design/icons";

const { Paragraph, Title } = Typography;

const fakeData = [
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: "cho",
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image: "[]",
  },
  {
    qu_id: "12322",
    pa_id: "123",
    qu_type: "cho",
    qu_answer: "[1,2]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image: "[]",
  },
  {
    qu_id: "124",
    pa_id: "1234",
    qu_type: "fil",
    qu_answer: '["fuck","die"]',
    qu_describe: "asjdoiasj___doia___sjdas?",
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
  {
    qu_id: "125",
    pa_id: "1235",
    qu_type: "sub",
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

function Question(props) {
  const { question, queue } = props;

  const [edit, setEdit] = useState(false);

  const answer = JSON.parse(question.qu_answer);
  const choose = JSON.parse(question.qu_choose);
  const image = JSON.parse(question.qu_image);

  const [describe, setDescribe] = useState(question.qu_describe);
  let answerObj;
  switch (question.qu_type) {
    case "cho":
      answerObj = new Array(choose.length).fill(false).map((v, i) => {
        return answer.findIndex((f) => f === i) !== -1;
      });
      break;
    case "fil":
      answerObj = answer;
      break;
    case "sub":
      answerObj = null;
      break;

    default:
      break;
  }
  const [answerC, setAnswerC] = useState(answerObj);
  function renderFunc(question) {
    switch (question.qu_type) {
      case "cho": {
        return (
          <>
            <Title level={3}>{`${queue}. ${describe}`}</Title>
            {edit || (
              <>
                正确答案：
                {answerC
                  .map((v, i) => {
                    return v ? i : -1;
                  })
                  .filter((v) => v != -1)
                  .map((v) => numberMap.get(v) + " ")}
              </>
            )}
            <br />
            {image.map((v) => {
              return <Image src={v}></Image>;
            })}
            {answer.length > 1
              ? choose.map((v, i) => {
                  return (
                    <Checkbox
                      key={v + i}
                      value={i}
                      checked={answerC[i]}
                      disabled={!edit}
                      onChange={(e) => {
                        const arr = [...answerC];
                        arr[i] = e.target.checked;
                        setAnswerC(arr);
                      }}
                    >
                      {numberMap.get(i) + ". " + v}
                    </Checkbox>
                  );
                })
              : choose.map((v, i) => {
                  return (
                    <Radio
                      key={v + i}
                      onChange={(e) => {
                        const arr = new Array(answerC.length).fill(false);
                        arr[i] = true;
                        setAnswerC(arr);
                      }}
                      value={i}
                      checked={answerC[i]}
                      disabled={!edit}
                    >
                      {numberMap.get(i) + ". " + v}
                    </Radio>
                  );
                })}
          </>
        );
      }
      case "fil": {
        return (
          <>
            <Title level={3}>{`${queue}. ${describe}`}</Title>
            {edit || (
              <>
                正确答案：
                {answerC.map((v, i) => {
                  return i + 1 + ". " + v + " ";
                })}
              </>
            )}
            <br />
            {image.map((v) => {
              return <Image src={v}></Image>;
            })}
            {answerC.map((v, i) => {
              return (
                <Input
                  key={i}
                  value={answerC[i]}
                  onChange={(e) => {
                    const arr = [...answerC];
                    arr[i] = e.currentTarget.value;
                    setAnswerC(arr);
                  }}
                  style={{ width: "100%" }}
                  addonBefore={i + 1}
                  disabled={!edit}
                ></Input>
              );
            })}
          </>
        );
      }

      case "sub":
        return (
          <>
            <Title level={3}>
              {queue + ". 主观题"}
              <br />
            </Title>
            <div
              dangerouslySetInnerHTML={{ __html: question.qu_describe }}
            ></div>
          </>
        );

      default:
        return <div></div>;
    }
  }
  return (
    <>
      <Divider></Divider>
      <Paragraph className="question-para">
        {edit ? (
          <Button
            type="primary"
            className="saveBtn"
            onClick={() => setEdit(false)}
          >
            保存
          </Button>
        ) : (
          <Button className="editBtn" onClick={() => setEdit(true)}>
            修改
          </Button>
        )}
        {renderFunc(question)}
      </Paragraph>
    </>
  );
}

class PaperControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterData: [],
    };
  }

  componentDidMount() {
    this.setState({ filterData: fakeData });
    console.log(this.props);
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    request(
      axios.get(`/papers/${paperId}`),
      (response) => {
        console.log(response);
      },
      () => null
    );
  }

  render() {
    return (
      <div className="paper-control">
        <Typography>
          <Title>为xxx考试出题</Title>
          <Divider></Divider>
          <Row gutter={[16, 16]}>
            <Col span={4}>
              <Button type="primary" style={{ marginRight: "10px" }}>
                发布考试
              </Button>
              <Button danger>删除考试</Button>
            </Col>
            <Col span={12}>
              <Button>修改</Button>
              &nbsp; 开始时间：
              <DatePicker showTime={true} disabled></DatePicker>
              &nbsp;&nbsp;&nbsp; 持续时长：
              <InputNumber
                controls={false}
                addonAfter="分钟"
                disabled
              ></InputNumber>
            </Col>
          </Row>
          {this.state.filterData.map((v, i) => {
            return (
              <Question key={v.qu_id} question={v} queue={i + 1}></Question>
            );
          })}
          <Divider></Divider>
          <div className="addBtn-warp">
            <Button type="dashed" className="addBtn" onClick={() => {}}>
              <PlusOutlined></PlusOutlined>
            </Button>
          </div>
        </Typography>
      </div>
    );
  }
}

export default PaperControl;
