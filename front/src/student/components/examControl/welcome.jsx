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
    const { onFinish } = this.props;
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
                      <span
                        className="exam-name"
                        onClick={() => {
                          switchfunc(ongoing[0].pa_state);
                        }}
                      >
                        {ongoing[0].pa_name}
                      </span>{" "}
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
                        onFinish={() =>
                          onFinish(
                            ongoing[0].pa_id,
                            constant.paper_state.correcting
                          )
                        }
                      ></Countdown>
                      后结束，
                      <a
                        onClick={() => {
                          localStorage.setItem("pa_id", ongoing[0].pa_id);
                          location.href = "./exam-client";
                        }}
                      >
                        点击加入考试
                      </a>
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
                                onFinish={() =>
                                  onFinish(
                                    v.pa_id,
                                    constant.paper_state.starting
                                  )
                                }
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
            <Card className="preparing-body" title={"未发布的考试"}>
              {preparing.length > 0 ? (
                preparing.map((v) => {
                  const begintime = dayjs(v.pa_begintime)
                    .format("YYYY年MM月DD日HH时mm分")
                    .toString();
                  return (
                    <Title
                      level={4}
                      onClick={() => {
                        switchfunc(v.pa_state);
                      }}
                    >
                      考试 <span className="exam-name">{v.pa_name}</span> 预计在{" "}
                      {begintime}开始
                    </Title>
                  );
                })
              ) : (
                <Title level={4}>暂无考试</Title>
              )}
            </Card>
          </div>
          <div className="correcting">
            <Card className="correcting-body" title={"试卷批改中"}>
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
                      {deadline}结束，等待老师完成批卷
                    </Title>
                  );
                })
              ) : (
                <Title level={4}>暂无考试</Title>
              )}
            </Card>
          </div>
          <div className="finished">
            <Card className="finished-body" title={"已出分的考试"}>
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
                      考试 <span className="exam-name">{v.pa_name}</span>{" "}
                      已出分，点击查看
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
