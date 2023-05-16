import React from "react";
import { Calendar, Typography, Statistic, Card, Button } from "antd";
import constant from "../../../constant";
import dayjs from "dayjs";
const { Title, Text, Paragraph } = Typography;
const { Countdown } = Statistic;

class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const waiting = [],
      ongoing = [],
      preparing = [],
      correcting = [],
      finished = [];
    const { exam, switchfunc } = this.props;
    exam.forEach((e) => {
      switch (e.pa_state) {
        case constant.paper_state.correcting:
          if (correcting.length <= 4) {
            correcting.push(e);
          }
          break;
        case constant.paper_state.end:
          if (finished.length <= 4) {
            finished.push(e);
          }
          break;
        case constant.paper_state.preparing:
          if (preparing.length <= 4) {
            preparing.push(e);
          }
          break;
        case constant.paper_state.starting:
          if (ongoing.length <= 4) {
            ongoing.push(e);
          }
          break;
        case constant.paper_state.waiting:
          if (waiting.length <= 4) {
            waiting.push(e);
          }
          break;

        default:
          break;
      }
    });

    return (
      <div className="welcome">
        <div className="up">
          <div className="main">
            <Card className="main-body">
              {(() => {
                if (ongoing.length > 0) {
                  const deadline = dayjs(
                    dayjs(ongoing[0].pa_begintime).toDate().getTime() +
                      ongoing[0].pa_duringtime * 1000 * 60
                  );
                  return (
                    <Title level={1} type="danger" className="ongoing-title">
                      考试{" "}
                      <span className="exam-name">{ongoing[0].pa_name}</span>{" "}
                      正在进行，
                      <Countdown
                        style={{
                          display: "inline-block",
                        }}
                        valueStyle={{
                          fontSize: "38px",
                          color: "#FF4D4F",
                        }}
                        value={deadline}
                        format="D 天 H 时 m 分 s 秒"
                      ></Countdown>
                      后结束，<a>点击加入考试</a>
                    </Title>
                  );
                } else if (waiting.length > 0) {
                  return (
                    <ul className="waiting-ul">
                      {waiting.map((v) => {
                        const deadline = dayjs(dayjs(v.pa_begintime));
                        return (
                          <li
                            key={v.pa_id}
                            onClick={() => {
                              switchfunc(v.pa_state);
                            }}
                          >
                            <Title level={3} className="waiting-li">
                              考试{" "}
                              <span className="exam-name">{v.pa_name}</span>{" "}
                              将在
                              <Countdown
                                style={{
                                  display: "inline-block",
                                }}
                                valueStyle={{
                                  fontSize: "24px",
                                  color: "#008B8B",
                                }}
                                value={deadline}
                                format="D 天 H 时 m 分 s 秒"
                              ></Countdown>
                              后开始考试
                            </Title>
                          </li>
                        );
                      })}
                    </ul>
                  );
                } else {
                  return (
                    <Title level={1} className="ongoing-title">
                      欢迎您，目前没有即将进行的考试
                    </Title>
                  );
                }
              })()}
            </Card>
          </div>
          <div className="calendar">
            <Calendar fullscreen={false}></Calendar>
          </div>
        </div>
        <div className="down">
          <div className="preparing">
            <Card className="preparing-body" title={"未完成出题"}>
              {preparing.length > 0 ? (
                preparing.map((v) => {
                  let order = JSON.parse(v.pa_order);
                  order = Array.isArray(order) ? order : [];
                  return (
                    <Title
                      level={4}
                      onClick={() => {
                        switchfunc(v.pa_state);
                      }}
                    >
                      考试 <span className="exam-name">{v.pa_name}</span>{" "}
                      尚未完成出题，目前已有{order.length}道题目
                    </Title>
                  );
                })
              ) : (
                <Title level={4}>暂无考试</Title>
              )}
            </Card>
          </div>
          <div className="correcting">
            <Card className="correcting-body" title={"未完成批改"}>
              {correcting.length > 0 ? (
                correcting.map((v) => {
                  const deadline = dayjs(
                    dayjs(v.pa_begintime).toDate().getTime() +
                      v.pa_duringtime * 1000 * 60
                  )
                    .format("YYYY年MM月DD日HH时mm分")
                    .toString();
                  return (
                    <Title
                      level={4}
                      className="correcting-li"
                      onClick={() => {
                        switchfunc(v.pa_state);
                      }}
                    >
                      考试 <span className="exam-name">{v.pa_name}</span> 已在{" "}
                      {deadline}结束，尚未完成批改
                    </Title>
                  );
                })
              ) : (
                <Title level={4}>暂无考试</Title>
              )}
            </Card>
          </div>
          <div className="finished">
            <Card className="finished-body" title={"已结束的考试"}>
              {finished.length > 0 ? (
                finished.map((v) => {
                  return (
                    <Title
                      level={4}
                      className="finished-li"
                      onClick={() => {
                        switchfunc(v.pa_state);
                      }}
                    >
                      考试 <span className="exam-name">{v.pa_name}</span> 已结束
                    </Title>
                  );
                })
              ) : (
                <Title level={4}>暂无考试</Title>
              )}
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
