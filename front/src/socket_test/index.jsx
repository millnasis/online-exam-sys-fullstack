import React from "react";
import ReactDom from "react-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import ZeroRtc from "./ZeroRtc";
import { Button, Input, InputNumber, Typography } from "antd";
import MultiZeroRtc from "./MultiZeroRtc";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      date: "",
      status: "",
      roomId: null,
    };

    this.rtc = null;
  }

  // componentDidMount() {
  //   const R = this;
  //   var socket = new SockJS("/gs-guide");
  //   const stompClient = Stomp.over(socket);
  //   stompClient.connect({}, function (frame) {
  //     stompClient.subscribe("/ws-resp/greet", function (greeting) {
  //       const data = JSON.parse(greeting.body);
  //       R.setState({ msg: data.content, date: data.date });
  //     });
  //     stompClient.send("/signal/hello", {}, JSON.stringify({ name: "kkk" }));
  //     R.setState({ status: "已连接" + frame });
  //   });
  // }
  componentDidMount() {
    // this.rtc = new ZeroRtc("/gs-guide");
    // this.rtc.createWebsocket();
    this.rtc = new MultiZeroRtc("/gs-guide");
    this.rtc.createWebsocket();
  }

  componentWillUnmount() {
    this.rtc.doLeave();
    this.rtc.hangup();
  }

  render() {
    return (
      <div>
        {/* <h1>
          消息：<span id="data">{this.state.msg}</span>
        </h1>
        <h1>
          更新时间：<span id="current_time">{this.state.date}</span>
        </h1>
        <h1>
          状态：<span id="status">{this.state.status}</span>
        </h1> */}
        <Typography>
          <Typography.Paragraph>
            <Typography.Title>WEBRTC DEMO!!!</Typography.Title>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <InputNumber
              controls={false}
              value={this.state.roomId}
              onChange={(v) => {
                this.setState({ roomId: v });
              }}
            ></InputNumber>
            <Button
              type="primary"
              onClick={() => {
                if (!this.state.roomId) {
                  return;
                }
                this.rtc.initLocalStream(this.state.roomId);
              }}
            >
              加入
            </Button>
            <Button
              onClick={() => {
                this.rtc.doLeave();
                this.rtc.hangup();
              }}
            >
              离开
            </Button>
          </Typography.Paragraph>
          <Typography.Paragraph>
            <video id="localVideo" autoPlay muted playsInline>
              本地窗口
            </video>
            <video id="remoteVideo" autoPlay playsInline>
              远端窗口
            </video>
          </Typography.Paragraph>
        </Typography>
      </div>
    );
  }
}
ReactDom.render(
  <div>
    <Home></Home>
  </div>,
  document.querySelector("#root")
);
