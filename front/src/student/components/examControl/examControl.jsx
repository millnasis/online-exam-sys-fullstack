import React, { useState } from "react";
import {
  Card,
  Col,
  Divider,
  Statistic,
  Input,
  Typography,
  Modal,
  Row,
  Select,
  Button,
  notification,
} from "antd";
const { Countdown } = Statistic;
import "./examControl.scss";
import constant from "../../../constant";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import request from "../../../request.js";
import axios from "axios";
import { connect } from "react-redux";
import dayjs from "dayjs";
import Welcome from "./welcome.jsx";
const { Text } = Typography;
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const paperStateMap = new Map();
paperStateMap.set(constant.paper_state.correcting, "批改中");
paperStateMap.set(constant.paper_state.end, "已结束");
paperStateMap.set(constant.paper_state.preparing, "未发布");
paperStateMap.set(constant.paper_state.starting, "进行中");
paperStateMap.set(constant.paper_state.waiting, "等待开始");

function Exam(props) {
  const { paper, menuselect, changestate, openModal } = props;
  const paperstate = paper.pa_state;
  const begintime = dayjs(paper.pa_begintime)
    .format("YYYY年MM月DD日HH时mm分ss秒")
    .toString();
  const begindeadline = dayjs(paper.pa_begintime);
  const deadline = dayjs(
    begindeadline.toDate().getTime() + paper.pa_duringtime * 1000 * 60
  );
  const endtime = deadline.format("YYYY年MM月DD日HH时mm分ss秒").toString();
  switch (paperstate) {
    case constant.paper_state.waiting:
      return (
        <Card className="exam-card waiting" {...props} title={paper.pa_name}>
          <span
            className="more-btn"
            onClick={() => {
              openModal(paper.pa_id);
            }}
          >
            详细信息
          </span>
          <strong className="state-font">等待考试开始</strong>
          <strong className="des-font">
            <Countdown
              onFinish={() => {
                changestate(paper.pa_id, constant.paper_state.starting);
              }}
              valueStyle={{ fontSize: "14px", color: "darkcyan" }}
              value={begindeadline}
              format="D 天 H 时 m 分 s 秒"
            />
            后开始考试
          </strong>
          <Divider></Divider>
          考试开始时间：{begintime}
        </Card>
      );
    case constant.paper_state.preparing:
      return (
        <Card className="exam-card preparing" {...props} title={paper.pa_name}>
          <span
            className="more-btn"
            onClick={() => {
              openModal(paper.pa_id);
            }}
          >
            详细信息
          </span>
          <strong className="state-font">未开始</strong>
          <strong className="des-font">尚未完成出题</strong>
          <Divider></Divider>
          暂定开始时间：
          {begintime}
        </Card>
      );

    case constant.paper_state.starting:
      return (
        <Card className="exam-card starting" {...props} title={paper.pa_name}>
          <span
            className="more-btn"
            onClick={() => {
              openModal(paper.pa_id);
            }}
          >
            详细信息
          </span>
          <strong
            className="des-font"
            onClick={() => {
              localStorage.setItem("pa_id", paper.pa_id);
              location.href = "./exam-client";
            }}
          >
            点击加入
          </strong>
          <strong className="state-font">考试正在进行中</strong>
          <br />
          <strong>
            {
              <Countdown
                valueStyle={{ fontSize: "14px", color: "darkred" }}
                value={deadline}
                format="D 天 H 时 m 分 s 秒"
              ></Countdown>
            }
            后交卷
          </strong>
          <Divider></Divider>
          结束时间：{endtime}
        </Card>
      );

    case constant.paper_state.correcting:
      return (
        <Card className="exam-card correcting" {...props} title={paper.pa_name}>
          <span
            className="more-btn"
            onClick={() => {
              openModal(paper.pa_id);
            }}
          >
            详细信息
          </span>
          <strong className="state-font">等待考卷批改</strong>
          <Divider></Divider>
          结束时间:{endtime}
        </Card>
      );

    case constant.paper_state.end:
      return (
        <Card className="exam-card end" {...props} title={paper.pa_name}>
          <span
            className="more-btn"
            onClick={() => {
              openModal(paper.pa_id);
            }}
          >
            详细信息
          </span>
          <strong className="state-font">考试已结束</strong>
          <strong
            className="des-font"
            onClick={() => {
              menuselect("check-paper", paper.pa_id);
            }}
          >
            点击查看成绩
          </strong>
          <Divider></Divider>
          结束时间：{endtime}
        </Card>
      );

    default:
      return <Card>x_x出错啦</Card>;
  }
}

const fakeData = [
  {
    pa_id: "123",
    gr_id: "123",
    pa_name: "高等数学",
    pa_founddate: new Date(),
    pa_state: constant.paper_state.waiting,
    pa_begintime: new Date(),
    pa_duringtime: 60 * 60 * 2,
    pa_order: "123",
    gr_info: "123",
    gr_name: "123班",
    te_id: "123",
    gr_founddate: new Date(),
  },
  {
    pa_id: "124",
    gr_id: "234",
    pa_name: "低等数学",
    pa_founddate: new Date(),
    pa_state: constant.paper_state.preparing,
    pa_begintime: new Date(),
    pa_duringtime: 60 * 60 * 2,
    pa_order: "123",
    gr_info: "123",
    gr_name: "234班",
    te_id: "123",
    gr_founddate: new Date(),
  },
  {
    pa_id: "125",
    gr_id: "123",
    pa_name: "什么几把",
    pa_founddate: new Date(),
    pa_state: constant.paper_state.starting,
    pa_begintime: new Date(),
    pa_duringtime: 60 * 60 * 2,
    pa_order: "123",
    gr_info: "123",
    gr_name: "123班",
    te_id: "123",
    gr_founddate: new Date(),
  },
  {
    pa_id: "126",
    gr_id: "223",
    pa_name: "大学语文",
    pa_founddate: new Date(),
    pa_state: constant.paper_state.end,
    pa_begintime: new Date(),
    pa_duringtime: 60 * 60 * 2,
    pa_order: "123",
    gr_info: "123",
    gr_name: "223班",
    te_id: "123",
    gr_founddate: new Date(),
  },
  {
    pa_id: "1233",
    gr_id: "224323",
    pa_name: "大学语文",
    pa_founddate: new Date(),
    pa_state: constant.paper_state.correcting,
    pa_begintime: new Date(),
    pa_duringtime: 60 * 60 * 2,
    pa_order: "123",
    gr_info: "123",
    gr_name: "223班",
    te_id: "123",
    gr_founddate: new Date(),
  },
];

/**
 *
 * @param {array} data
 */
function handleGradeOptions(data) {
  const map = new Map();
  data.forEach((v) => {
    const { gr_id, gr_name } = v;
    if (!map.has(gr_id)) {
      map.set(gr_id, gr_name);
    }
  });
  const ret = [{ value: "all", label: "全部班级" }];
  map.forEach((v, k) => {
    ret.push({ label: v, value: k });
  });
  return ret;
}

class ExamControl extends React.Component {
  constructor(props) {
    super(props);

    this.originData = fakeData;
    this.timeout = null;
    this.clearState = {
      search: "",
      grade: "all",
      pa_state: "all",
    };
    this.state = {
      filterData: fakeData,
      search: "",
      grade: "all",
      pa_state: "all",
      modalVisable: false,
      modalObj: { pa_order: "[]" },
      welcome: true,
    };
  }

  getExamInfo() {
    const { userInfo } = this.props.global;
    request(
      axios.get("/papers/student/" + userInfo.st_id),
      (response) => {
        this.originData = response.data.data
          .map((v) => {
            return { ...v, pa_founddate: dayjs(v.pa_founddate) };
          })
          .sort(
            (a, b) =>
              b.pa_founddate.toDate().getTime() -
              a.pa_founddate.toDate().getTime()
          );
        this.setState({
          filterData: this.originData,
          search: "",
          grade: "all",
          pa_state: "all",
        });
      },
      () => null
    );
  }

  componentDidUpdate(prev) {
    if (
      this.props.global.userInfo.st_id &&
      this.props.global.userInfo.st_id !== prev.global.userInfo.st_id
    ) {
      this.getExamInfo();
    }
  }

  componentDidMount() {
    if (this.props.global.userInfo.st_id) {
      this.getExamInfo();
    }
  }

  render() {
    const exam = this.state.modalObj;
    const founddate = dayjs(exam.pa_founddate);
    const begintime = dayjs(exam.pa_begintime);
    const endtime = dayjs(
      begintime.toDate().getTime() + exam.pa_duringtime * 1000 * 60
    );
    const format = "YYYY年MM月DD日 HH时mm分";
    return (
      <div className="exam-control">
        <Button
          className="switch-welcome-btn"
          type="text"
          onClick={() => {
            this.setState({
              welcome: !this.state.welcome,
              filterData: this.state.welcome
                ? this.state.filterData
                : this.originData,
            });
          }}
        >
          {this.state.welcome ? (
            <>
              搜索考试<ArrowRightOutlined></ArrowRightOutlined>
            </>
          ) : (
            <>
              <ArrowLeftOutlined></ArrowLeftOutlined>返回主页
            </>
          )}
        </Button>
        <Modal
          open={this.state.modalVisable}
          onCancel={() => {
            this.setState({ modalVisable: false });
          }}
          onOk={() => {
            this.setState({ modalVisable: false });
          }}
          className="paper-info-modal"
        >
          <Card
            title={<span style={{ fontSize: "2em" }}>{exam.pa_name}</span>}
            className="check-paper-info"
            bodyStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="paper-info">
              <p>
                <Text>
                  <span className="head">当前考试状态：</span>
                  {paperStateMap.get(exam.pa_state)}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">考试创建时间</span>
                  {founddate.format(format).toString()}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">考试开始时间</span>
                  {begintime.format(format).toString()}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">考试结束时间</span>
                  {endtime.format(format).toString()}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">考试持续</span>
                  {exam.pa_duringtime}分钟
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">监考老师</span>
                  {exam.te_name}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">所属班级</span>
                  {exam.gr_name}
                </Text>
              </p>
              <p>
                <Text>
                  <span className="head">题目数量</span>
                  {JSON.parse(exam.pa_order).length}题
                </Text>
              </p>
            </div>
          </Card>
        </Modal>
        {this.state.welcome ? (
          <Welcome
            exam={this.state.filterData}
            onFinish={(pa_id, pa_state) => {
              this.originData = this.originData.map((v) => {
                if (v.pa_id !== pa_id) {
                  return v;
                }
                return {
                  ...v,
                  pa_state,
                };
              });
              this.setState({
                filterData: this.originData,
              });
            }}
            switchfunc={(pa_state = "all") => {
              this.setState({
                ...this.clearState,
                filterData: this.originData.filter((v) => {
                  return v.pa_state === pa_state;
                }),
                pa_state,
                welcome: false,
              });
            }}
          ></Welcome>
        ) : (
          <>
            <Row gutter={16} style={{ width: "100%" }}>
              <Col span={16}>
                <Input.Search
                  prefix={"搜索考试"}
                  placeholder={"输入科目名字搜索"}
                  value={this.state.search}
                  onChange={(e) => {
                    this.setState({
                      ...this.clearState,
                      search: e.target.value,
                    });
                    if (this.timeout !== null) {
                      clearTimeout(this.timeout);
                    }
                    this.timeout = setTimeout(() => {
                      this.setState({
                        ...this.clearState,
                        search: e.target.value,
                        filterData: this.originData.filter(
                          (el) => el.pa_name.match(this.state.search) !== null
                        ),
                      });
                    }, 600);
                  }}
                ></Input.Search>
              </Col>
              <Col span={3}>
                <Select
                  onSelect={(value) => {
                    if (value === "all") {
                      this.setState({
                        ...this.clearState,
                        filterData: this.originData,
                        grade: value,
                      });
                      return;
                    }
                    this.setState({
                      ...this.clearState,
                      filterData: this.originData.filter((v) => {
                        return v.gr_id === value;
                      }),
                      grade: value,
                    });
                  }}
                  style={{ width: "100%" }}
                  options={handleGradeOptions(this.originData)}
                  value={this.state.grade}
                ></Select>
              </Col>
              <Col span={3}>
                <Select
                  style={{ width: "100%" }}
                  value={this.state.pa_state}
                  onSelect={(value) => {
                    if (value === "all") {
                      this.setState({
                        ...this.clearState,
                        filterData: this.originData,
                        pa_state: value,
                      });
                      return;
                    }
                    this.setState({
                      ...this.clearState,
                      filterData: this.originData.filter((v) => {
                        return v.pa_state === value;
                      }),
                      pa_state: value,
                    });
                  }}
                  options={[
                    {
                      value: "all",
                      label: "全部考试",
                    },
                    {
                      value: constant.paper_state.preparing,
                      label: "未开始",
                    },
                    {
                      value: constant.paper_state.waiting,
                      label: "等待中",
                    },
                    {
                      value: constant.paper_state.starting,
                      label: "进行中",
                    },
                    {
                      value: constant.paper_state.correcting,
                      label: "批改中",
                    },
                    {
                      value: constant.paper_state.end,
                      label: "已结束",
                    },
                  ]}
                ></Select>
              </Col>
            </Row>
            <TransitionGroup className={"transition-warp"}>
              {this.state.filterData.map((v) => {
                return (
                  <CSSTransition
                    key={v.pa_id}
                    classNames="component-fade"
                    addEndListener={(node, done) => {
                      node.addEventListener("transitionend", done, false);
                    }}
                  >
                    <Exam
                      paper={v}
                      openModal={(pa_id) => {
                        request(
                          axios.get("/papers/join/" + pa_id),
                          (response) => {
                            if (response.data.code === constant.code.success) {
                              this.setState({
                                modalVisable: true,
                                modalObj: response.data.data,
                              });
                            }
                          },
                          () => {}
                        );
                      }}
                      changestate={(pa_id, pa_state) => {
                        this.originData = this.originData.map((v) => {
                          if (v.pa_id !== pa_id) {
                            return v;
                          }
                          return {
                            ...v,
                            pa_state,
                          };
                        });
                        this.setState({
                          filterData: this.originData,
                        });
                      }}
                      menuselect={this.props.menuselect}
                    ></Exam>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </>
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

export default connect(mapStateToProps, null)(ExamControl);
