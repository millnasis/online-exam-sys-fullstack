import React from "react";
import { Card, Divider } from "antd";
import "./examControl.scss";
import constant from "../../../constant";

function Exam(props) {
  const { paperState } = props;
  switch (paperState) {
    case constant.paper_state.waiting:
      return (
        <Card className="exam-card waiting" {...props}>
          <strong className="state-font">未开始</strong>
          <strong style={{ float: "right" }}>请等待老师安排考试</strong>
          <Divider></Divider>
          创建时间：2023年2月21日13:32:27
        </Card>
      );
    case constant.paper_state.preparing:
      return <Card className="exam-card preparing" {...props}></Card>;

    case constant.paper_state.starting:
      return <Card className="exam-card starting" {...props}></Card>;

    case constant.paper_state.end:
      return <Card className="exam-card end" {...props}></Card>;

    default:
      return <Card></Card>;
  }
}

class ExamControl extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="exam-control">
        <Exam title={"高等数学"} paperState={constant.paper_state.end}></Exam>
        <Exam
          title={"高等数学"}
          paperState={constant.paper_state.preparing}
        ></Exam>
        <Exam
          title={"高等数学"}
          paperState={constant.paper_state.starting}
        ></Exam>
        <Exam
          title={"高等数学"}
          paperState={constant.paper_state.waiting}
        ></Exam>
      </div>
    );
  }
}

export default ExamControl;
