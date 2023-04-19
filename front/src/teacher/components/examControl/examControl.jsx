import React, { useState } from "react";
import { Card, Col, Divider, Dropdown, Input, Modal, Row, Select } from "antd";
import "./examControl.scss";
import constant from "../../../constant";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import request from "../../../request.js";
import axios from "axios";
import { connect } from "react-redux";

function Exam(props) {
  const { paper, menuselect } = props;
  const paperstate = paper.pa_state;
  const [open, setOpen] = useState(false);
  switch (paperstate) {
    case constant.paper_state.waiting:
      return (
        <Card
          className="exam-card waiting"
          {...props}
          actions={[
            <a
              onClick={() => {
                menuselect("paper-control", paper.pa_id);
              }}
            >
              修改
            </a>,
          ]}
        >
          <strong className="state-font">等待考试开始</strong>
          <strong className="des-font">21天9小时后开始考试</strong>
          <Divider></Divider>
          考试开始时间：2023年2月22日10:58:20
        </Card>
      );
    case constant.paper_state.preparing:
      return (
        <Card
          className="exam-card preparing"
          {...props}
          actions={[
            <a
              onClick={() => {
                menuselect("paper-control", paper.pa_id);
              }}
            >
              修改
            </a>,
          ]}
        >
          <strong className="state-font">未开始</strong>
          <strong className="des-font">尚未完成出题</strong>
          <Divider></Divider>
          暂定开始时间：----：--：-- --：--：--
        </Card>
      );

    case constant.paper_state.starting:
      return (
        <Card className="exam-card starting" {...props}>
          <strong className="des-font">点击加入</strong>
          <strong className="state-font">考试正在进行中</strong>
          <br />
          <strong>2小时35分钟46秒后交卷</strong>
          <Divider></Divider>
          结束时间：2023年2月22日11:02:01
        </Card>
      );

    case constant.paper_state.end:
      return (
        <Card className="exam-card end" {...props}>
          <strong className="state-font">考试已结束</strong>
          <strong
            className="des-font"
            onClick={() => {
              setOpen(true);
            }}
          >
            点击查看成绩
          </strong>
          <Modal
            title={"查询成绩"}
            open={open}
            onCancel={() => {
              setOpen(false);
            }}
            onOk={() => {
              setOpen(false);
            }}
          ></Modal>
          <Divider></Divider>
          结束时间：2023年2月22日11:02:01
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
    };
  }

  getExamInfo() {
    const { userInfo } = this.props.global;
    request(
      axios.get("/papers/student/" + userInfo.st_id),
      (response) => {
        this.originData = response.data.data;
        this.setState({
          filterData: response.data.data,
          search: "",
          grade: "all",
          pa_state: "all",
        });
      },
      () => null
    );
  }

  componentDidMount() {
    this.getExamInfo();
    console.log(this.state);
  }

  render() {
    return (
      <div className="exam-control">
        <Row gutter={16} style={{ width: "100%" }}>
          <Col span={16}>
            <Input.Search
              prefix={"搜索考试"}
              placeholder={"输入科目名字搜索"}
              value={this.state.search}
              onChange={(e) => {
                this.setState({ ...this.clearState, search: e.target.value });
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
                <Exam paper={v} menuselect={this.props.menuselect}></Exam>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
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
