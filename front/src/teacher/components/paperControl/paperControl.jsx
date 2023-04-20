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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

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
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
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

const disabledDate = (current) => {
  return current && current < dayjs().endOf("day");
};

function Question(props) {
  const { question, queue } = props;

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
    case "cho":
      answerObj = new Array(chooseC.length).fill(false).map((v, i) => {
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
                  action={""}
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
      case "fil": {
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
                  action={""}
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

      case "sub":
        return (
          <>
            <Title level={3}>
              {`${queue}. 主观题 (${score}分)`}
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
        <Button danger className="deleteBtn">
          删除
        </Button>
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

const DragTable = (props) => {
  const { data, hookData } = props;
  const [dataSource, setDataSource] = useState(
    data.map((v) => {
      return {
        ...v,
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

class PaperControl extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterData: [],
      editTime: false,
      editOrder: false,
      paperData: {},
    };

    this.orderData = null;

    this.hookData = this.hookData.bind(this);
  }

  componentDidMount() {
    const { paperId } = this.props;
    if (paperId === -1) {
      return;
    }
    request(
      axios.get(`/papers/${paperId}`),
      (response) => {
        this.setState({ paperData: response.data.data });
      },
      () => null
    );
    request(
      axios.get(`/questions/paper/${paperId}`),
      (response) => {
        this.setState({ filterData: response.data.data });
      },
      () => null
    );
  }

  hookData(data) {
    this.orderData = data;
  }

  render() {
    const { paperData } = this.state;
    return (
      <div className="paper-control">
        <Typography>
          <Title>为{paperData.pa_name}考试出题</Title>
          <Divider></Divider>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              {this.state.editOrder ? (
                <Button
                  type="primary"
                  onClick={() => {
                    console.log(this.orderData);
                    this.setState({ editOrder: false });
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
              <Button type="primary" style={{ marginRight: "10px" }}>
                发布考试
              </Button>
              <Button danger>删除考试</Button>
            </Col>
            <Col span={18}>
              {this.state.editTime ? (
                <Button
                  type="primary"
                  onClick={() => {
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
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                value={dayjs(paperData.pa_begintime)}
                disabledDate={disabledDate}
                showTime={true}
                disabled={!this.state.editTime}
              ></DatePicker>
              &nbsp;&nbsp;&nbsp; 持续时长：
              <InputNumber
                value={paperData.pa_duringtime}
                controls={false}
                addonAfter="分钟"
                disabled={!this.state.editTime}
              ></InputNumber>
            </Col>
          </Row>
          {!this.state.editOrder ? (
            this.state.filterData.map((v, i) => {
              return (
                <Question key={v.qu_id} question={v} queue={i + 1}></Question>
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
