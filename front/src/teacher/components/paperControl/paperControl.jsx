import React, { useState } from "react";
import "./paperControl.scss";
import request from "../../../request";
import { DndContext } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  Table,
  Row,
  Typography,
  Upload,
  Modal,
  Radio,
  Popconfirm,
  notification,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import constant from "../../../constant";
import EditorWarp from "../../../EditorWarp.jsx";

const { Paragraph, Title } = Typography;

const fakeData = [
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

const disabledDate = (current) => {
  return current && current < dayjs().endOf("day");
};

// 变量转数据
function transformStateToData({
  describe,
  answer,
  score,
  choose,
  image,
  type,
}) {
  let answerN =
    type === constant.question_type.choose
      ? answer
          .map((v, i) => {
            if (v) {
              return i;
            } else {
              return -1;
            }
          })
          .filter((v) => v !== -1)
      : answer;

  return {
    qu_image: JSON.stringify(
      image.map((v) => {
        if ("response" in v) {
          return v.response.data;
        } else {
          return v.url;
        }
      })
    ),
    qu_choose: JSON.stringify(choose),
    qu_answer: JSON.stringify(answerN),
    qu_score: score,
    qu_describe: describe,
  };
}

// 数据转变量
function Question(props) {
  const { question, queue, getQuestion } = props;

  const [edit, setEdit] = useState(false);

  const answer = JSON.parse(question.qu_answer);
  const choose = JSON.parse(question.qu_choose);
  const image = JSON.parse(question.qu_image);

  const [chooseC, setChooseC] = useState(choose);
  const [imageC, setImageC] = useState(
    image.map((v, i) => {
      return {
        uid: i,
        name: "image" + i,
        status: "done",
        url: v,
      };
    })
  );

  const [describe, setDescribe] = useState(question.qu_describe);
  const [score, setScore] = useState(question.qu_score);
  let answerObj;
  switch (question.qu_type) {
    case constant.question_type.choose:
      answerObj = new Array(chooseC.length).fill(false).map((v, i) => {
        return answer.findIndex((f) => f === i) !== -1;
      });
      break;
    case constant.question_type.fill:
      answerObj = answer;
      break;
    case constant.question_type.subject:
      answerObj = null;
      break;

    default:
      break;
  }
  const [answerC, setAnswerC] = useState(answerObj);
  function renderFunc(question) {
    switch (question.qu_type) {
      case constant.question_type.choose: {
        return (
          <>
            {edit ? (
              <>
                <Input.TextArea
                  value={describe}
                  onChange={(e) => setDescribe(e.currentTarget.value)}
                  style={{ width: "80%" }}
                ></Input.TextArea>
                <br />
                <Input
                  addonBefore={"分值"}
                  style={{ width: "80%" }}
                  value={score}
                  onChange={(e) => setScore(e.currentTarget.value)}
                ></Input>
              </>
            ) : (
              <Title level={3}>{`${queue}. ${describe} (${score}分)`}</Title>
            )}
            {edit && (
              <>
                <Divider orientation="left">配图</Divider>
                <Upload
                  name="img"
                  action={"/upload/questions/" + question.qu_id}
                  listType="picture-card"
                  fileList={imageC}
                  onChange={({ fileList: newFileList }) =>
                    setImageC(newFileList)
                  }
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </>
            )}
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
            {edit ||
              image.map((v) => {
                return <Image src={v}></Image>;
              })}
            <br />
            {edit && <Divider orientation="left">选项</Divider>}
            {chooseC.map((v, i) => {
              return (
                <Checkbox
                  key={i}
                  value={i}
                  checked={answerC[i]}
                  disabled={!edit}
                  onChange={(e) => {
                    const arr = [...answerC];
                    arr[i] = e.target.checked;
                    setAnswerC(arr);
                  }}
                >
                  {numberMap.get(i) + ". "}
                  {edit ? (
                    <Input
                      value={chooseC[i]}
                      onChange={(e) => {
                        const arr = [...chooseC];
                        arr[i] = e.currentTarget.value;
                        setChooseC(arr);
                      }}
                      addonAfter={
                        <a
                          onClick={() => {
                            const arr = [...chooseC];
                            arr.splice(i, 1);
                            setChooseC(arr);
                            setAnswerC(
                              new Array(arr.length).fill(false).map((v, i) => {
                                return answer.findIndex((f) => f === i) !== -1;
                              })
                            );
                          }}
                        >
                          删除
                        </a>
                      }
                    ></Input>
                  ) : (
                    v
                  )}
                </Checkbox>
              );
            })}
            {edit && (
              <Button
                type="dashed"
                onClick={() => {
                  const arr = [...chooseC, ""];
                  setChooseC(arr);
                }}
              >
                <PlusOutlined></PlusOutlined>
              </Button>
            )}
          </>
        );
      }
      case constant.question_type.fill: {
        return (
          <>
            {edit ? (
              <>
                <Input.TextArea
                  value={describe}
                  onChange={(e) => setDescribe(e.currentTarget.value)}
                  style={{ width: "80%" }}
                ></Input.TextArea>
                <br />
                <Input
                  addonBefore={"分值"}
                  style={{ width: "80%" }}
                  value={score}
                  onChange={(e) => setScore(e.currentTarget.value)}
                ></Input>
              </>
            ) : (
              <Title level={3}>{`${queue}. ${describe} (${score}分)`}</Title>
            )}
            {edit && (
              <>
                <Divider orientation="left">配图</Divider>
                <Upload
                  name="img"
                  action={"/upload/questions/" + question.qu_id}
                  listType="picture-card"
                  fileList={imageC}
                  onChange={({ fileList: newFileList }) =>
                    setImageC(newFileList)
                  }
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </>
            )}
            {edit || (
              <>
                正确答案：
                {answerC.map((v, i) => {
                  return i + 1 + ". " + v + " ";
                })}
              </>
            )}
            <br />

            {edit ||
              image.map((v) => {
                return <Image src={v}></Image>;
              })}
            <br />
            {edit && <Divider orientation="left">答案</Divider>}
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
                  addonAfter={
                    edit && (
                      <a
                        onClick={() => {
                          const arr = [...answerC];
                          arr.splice(i, 1);
                          setAnswerC(arr);
                        }}
                      >
                        删除
                      </a>
                    )
                  }
                  style={{ width: "100%" }}
                  addonBefore={i + 1}
                  disabled={!edit}
                ></Input>
              );
            })}
            {edit && (
              <p style={{ textAlign: "center" }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    const arr = [...answerC, ""];
                    setAnswerC(arr);
                  }}
                >
                  <PlusOutlined></PlusOutlined>
                </Button>
              </p>
            )}
          </>
        );
      }

      case constant.question_type.subject:
        return (
          <>
            {!edit ? (
              <Title level={3}>
                {`${queue}. 主观题 (${score}分)`}
                <br />
              </Title>
            ) : (
              <>
                <Title level={3}>
                  {`${queue}. 主观题`}
                  <br />
                </Title>
                <Input
                  addonBefore={"分值"}
                  style={{ width: "80%" }}
                  value={score}
                  onChange={(e) => setScore(e.currentTarget.value)}
                ></Input>
              </>
            )}

            {edit || (
              <div
                dangerouslySetInnerHTML={{ __html: question.qu_describe }}
              ></div>
            )}
            {edit && (
              <EditorWarp
                value={question.qu_describe}
                onChange={(v) => setDescribe(v)}
                quid={question.qu_id}
              ></EditorWarp>
            )}
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
            onClick={() => {
              const obj = transformStateToData({
                describe,
                answer: answerC,
                choose: chooseC,
                image: imageC,
                score,
                type: question.qu_type,
              });
              request(
                axios.post("/questions/", {
                  ...question,
                  ...obj,
                }),
                (response) => {
                  getQuestion();
                },
                () => {
                  setEdit(false);
                }
              );
            }}
          >
            保存
          </Button>
        ) : (
          <Button
            className="editBtn"
            onClick={() => {
              setEdit(true);
            }}
          >
            修改
          </Button>
        )}
        {edit ? (
          <Button
            className="deleteBtn"
            onClick={() => {
              setEdit(false);
            }}
          >
            取消
          </Button>
        ) : (
          <Popconfirm
            title="删除题目"
            description="确定删除吗"
            onConfirm={() => {
              request(
                axios.delete("/questions/" + question.qu_id),
                (response) => {
                  getQuestion(true);
                },
                () => {}
              );
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button danger className="deleteBtn">
              删除
            </Button>
          </Popconfirm>
        )}
        {renderFunc(question)}
      </Paragraph>
    </>
  );
}
const columns = [
  {
    title: "题目",
    dataIndex: "qu_describe",
  },
  {
    title: "类型",
    dataIndex: "qu_type",
  },
  {
    title: "分值",
    dataIndex: "qu_score",
  },
  {
    title: "答案",
    dataIndex: "qu_answer",
  },
];

const RowD = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      }
    ),
    transition,
    cursor: "move",
    ...(isDragging
      ? {
          position: "relative",
          zIndex: 9999,
        }
      : {}),
  };
  return (
    <tr
      {...props}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    />
  );
};

const quTypeMao = new Map();
quTypeMao.set(constant.question_type.choose, "选择题");
quTypeMao.set(constant.question_type.choose, "填空题");
quTypeMao.set(constant.question_type.choose, "主观题");

const DragTable = (props) => {
  const { data, hookData } = props;
  const [dataSource, setDataSource] = useState(
    data.map((v) => {
      return {
        ...v,
        qu_type: quTypeMao.get(v.qu_type),
        key: v.qu_id,
      };
    })
  );
  hookData(dataSource);
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setDataSource((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };
  return (
    <DndContext onDragEnd={onDragEnd}>
      <SortableContext
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <Table
          components={{
            body: {
              row: RowD,
            },
          }}
          rowKey="key"
          columns={columns}
          dataSource={dataSource}
        />
      </SortableContext>
    </DndContext>
  );
};

function getPaperState(state) {
  switch (state) {
    case constant.paper_state.preparing:
      return "未完成出题";
    case constant.paper_state.waiting:
      return "等待考试开始";

    default:
      break;
  }
}

class PaperControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterData: fakeData,
      editTime: false,
      editOrder: false,
      paperData: {},
      modalOpen: false,
      fetching: false,
      newQuestionType: constant.question_type.choose,
    };

    this.orderData = null;

    this.hookData = this.hookData.bind(this);
    this.getQuestion = this.getQuestion.bind(this);
    this.reOrderData = this.reOrderData.bind(this);
  }

  async componentDidMount() {
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    await request(
      axios.get(`/papers/${paperId}`),
      (response) => {
        this.setState({ paperData: response.data.data });
      },
      () => null
    );
    this.getQuestion();
  }

  async getQuestion(getOrder = false) {
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    if (getOrder) {
      await request(
        axios.get(`/papers/${paperId}`),
        (response) => {
          this.setState({ paperData: response.data.data });
        },
        () => null
      );
    }
    request(
      axios.get(`/questions/paper/${paperId}`),
      (response) => {
        const order = JSON.parse(this.state.paperData.pa_order);
        const orderMap = new Map(order.map((v, i) => [i, v]));
        const dataMap = new Map(response.data.data.map((v) => [v.qu_id, v]));
        const arr = new Array(response.data.data.length).fill(0);
        this.setState({
          filterData: arr.map((v, i) => {
            return dataMap.get(orderMap.get(i));
          }),
        });
      },
      () => null
    );
  }

  hookData(data) {
    this.orderData = data;
  }

  reOrderData(order) {
    const orderMap = new Map(order.map((v, i) => [i, v]));
    const dataMap = new Map(this.state.filterData.map((v) => [v.qu_id, v]));
    const arr = new Array(this.state.filterData.length).fill(0);
    this.setState({
      filterData: arr.map((v, i) => {
        return dataMap.get(orderMap.get(i));
      }),
    });
  }

  render() {
    const { menuselect } = this.props;
    const { paperData } = this.state;
    return (
      <div className="paper-control">
        <Modal
          title="新建题目"
          open={this.state.modalOpen}
          onCancel={() => this.setState({ modalOpen: false })}
          footer={[
            <Button
              key={"cancelBtn"}
              onClick={() => this.setState({ modalOpen: false })}
            >
              取消
            </Button>,
            <Button
              type="primary"
              loading={this.state.fetching}
              onClick={() => {
                const R = this;
                this.setState({ fetching: true });
                request(
                  axios.put("/questions", {
                    pa_id: paperData.pa_id,
                    qu_type: this.state.newQuestionType,
                  }),
                  async (response) => {
                    if (response.data.code === constant.code.success) {
                      await this.getQuestion(true);
                    }
                  },
                  () => {
                    R.setState({
                      modalOpen: false,
                      fetching: false,
                      newQuestionType: constant.question_type.choose,
                    });
                  }
                );
              }}
            >
              确定
            </Button>,
          ]}
        >
          <Divider></Divider>
          <p>选择题目类型</p>
          <Radio.Group
            value={this.state.newQuestionType}
            onChange={(e) => this.setState({ newQuestionType: e.target.value })}
          >
            <Radio.Button value={constant.question_type.choose}>
              选择题
            </Radio.Button>
            <Radio.Button value={constant.question_type.fill}>
              填空题
            </Radio.Button>
            <Radio.Button value={constant.question_type.subject}>
              主观题
            </Radio.Button>
          </Radio.Group>
        </Modal>
        <Typography>
          <Title>为{paperData.pa_name}考试出题</Title>
          <Title level={4}>当前状态：{getPaperState(paperData.pa_state)}</Title>
          <Divider></Divider>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {this.state.editOrder ? (
                <Button
                  style={{ marginRight: "10px" }}
                  type="primary"
                  onClick={() => {
                    const order = this.orderData.map((v) => {
                      return v.qu_id;
                    });
                    console.log(order);
                    request(
                      axios.post("/papers", {
                        ...this.state.paperData,
                        pa_order: JSON.stringify(order),
                      }),
                      (response) => {
                        this.getQuestion(true);
                        this.setState({ editOrder: false });
                      },
                      () => null
                    );
                  }}
                >
                  保存题序
                </Button>
              ) : (
                <Button
                  style={{ marginRight: "10px" }}
                  onClick={() => this.setState({ editOrder: true })}
                >
                  修改题序
                </Button>
              )}
              <Popconfirm
                title="开启考试"
                description="确定开启吗"
                onConfirm={() => {
                  request(
                    axios.post("/papers/waiting/" + this.state.paperData.pa_id),
                    (response) => {
                      notification.success({ message: "发布成功，即将跳转" });
                      setTimeout(() => {
                        menuselect("exam-control");
                      }, 1500);
                    },
                    () => {}
                  );
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="primary" style={{ marginRight: "10px" }}>
                  发布考试
                </Button>
              </Popconfirm>
              <Popconfirm
                title="删除考试"
                description="确定删除吗"
                onConfirm={() => {
                  request(
                    axios.delete("/papers/" + this.state.paperData.pa_id),
                    (response) => {
                      notification.success({ message: "删除成功，即将跳转" });
                      setTimeout(() => {
                        menuselect("exam-control");
                      }, 1500);
                    },
                    () => {}
                  );
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>删除考试</Button>
              </Popconfirm>
            </Col>
            <Col span={18}>
              {this.state.editTime ? (
                <Button
                  type="primary"
                  onClick={() => {
                    request(
                      axios.post("/papers", {
                        ...this.state.paperData,
                      }),
                      (response) => null,
                      () => null
                    );
                    this.setState({ editTime: false });
                  }}
                >
                  保存
                </Button>
              ) : (
                <Button onClick={() => this.setState({ editTime: true })}>
                  修改
                </Button>
              )}
              &nbsp; 开始时间：
              {"pa_begintime" in this.state.paperData && (
                <DatePicker
                  format="YYYY-MM-DD HH:mm:ss"
                  value={dayjs(paperData.pa_begintime)}
                  onChange={(v) => {
                    this.setState({
                      paperData: {
                        ...paperData,
                        pa_begintime: v.toDate(),
                      },
                    });
                  }}
                  disabledDate={disabledDate}
                  showTime={true}
                  disabled={!this.state.editTime}
                ></DatePicker>
              )}
              &nbsp;&nbsp;&nbsp; 持续时长：
              <InputNumber
                value={paperData.pa_duringtime}
                onChange={(v) => {
                  this.setState({
                    paperData: {
                      ...paperData,
                      pa_duringtime: v,
                    },
                  });
                }}
                controls={false}
                addonAfter="分钟"
                disabled={!this.state.editTime}
              ></InputNumber>
            </Col>
          </Row>
          {!this.state.editOrder ? (
            this.state.filterData.map((v, i) => {
              return (
                <Question
                  key={v.qu_id}
                  question={v}
                  queue={i + 1}
                  getQuestion={this.getQuestion}
                ></Question>
              );
            })
          ) : (
            <DragTable
              data={[...this.state.filterData]}
              hookData={this.hookData}
            ></DragTable>
          )}
          <Divider></Divider>
          <div className="addBtn-warp">
            <Button
              type="dashed"
              className="addBtn"
              onClick={() => {
                this.setState({ modalOpen: true });
              }}
            >
              <PlusOutlined></PlusOutlined>
            </Button>
          </div>
        </Typography>
      </div>
    );
  }
}

export default PaperControl;
