import { Button, Card, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

const { Title, Text, Paragraph } = Typography;

class Check extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { exam, opencamara } = this.props;
    const founddate = dayjs(exam.pa_founddate);
    const begintime = dayjs(exam.pa_begintime);
    const endtime = dayjs(
      begintime.toDate().getTime() + exam.pa_duringtime * 1000 * 60
    );
    const format = "YYYY年MM月DD日 HH时mm分";
    return (
      <div className="check">
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
                <span className="head">考生人数</span>
                {exam.ep_list.length}名考生
              </Text>
            </p>
          </div>
          <Button
            type="primary"
            onClick={() => {
              opencamara();
            }}
          >
            开始监考
          </Button>
        </Card>
      </div>
    );
  }
}

export default Check;
