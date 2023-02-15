import React from "react";
import ReactDom from "react-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      msg: "",
      date: "",
      status: "",
    };
  }

  componentDidMount() {
    const R = this;
    var socket = new SockJS("/gs-guide");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      stompClient.subscribe("/ws-resp/greet", function (greeting) {
        const data = JSON.parse(greeting.body);
        R.setState({ msg: data.content, date: data.date });
      });
      stompClient.send("/signal/hello", {}, JSON.stringify({ name: "kkk" }));
      R.setState({ status: "已连接" + frame });
    });
  }

  render() {
    return (
      <div>
        <h1>
          消息：<span id="data">{this.state.msg}</span>
        </h1>
        <h1>
          更新时间：<span id="current_time">{this.state.date}</span>
        </h1>
        <h1>
          状态：<span id="status">{this.state.status}</span>
        </h1>
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
