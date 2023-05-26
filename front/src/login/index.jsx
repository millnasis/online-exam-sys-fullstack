import React, { useState } from "react";
import ReactDom, { render } from "react-dom";
import {
  Card,
  Form,
  Button,
  Input,
  Checkbox,
  notification,
  Switch,
} from "antd";
import Icon, {
  DingdingOutlined,
  GithubOutlined,
  LockOutlined,
  NumberOutlined,
  QqOutlined,
  UserOutlined,
  WechatOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./index.scss";
import img from "./10.png";

import request from "../request";

const Myicon = () => (
  <svg
    t="1685008955035"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2534"
    width="50"
    height="50"
    fill="white"
    className="head-title-svg"
  >
    <path
      d="M928 563.2a32 32 0 0 1-32-32v-160a32 32 0 0 1 64 0v160a32 32 0 0 1-32 32z"
      p-id="2535"
    ></path>
    <path
      d="M515.584 524.8c-20.8 0-38.848-2.816-56.896-8.96L49.28 359.872C6.336 342.336 0 315.328 0 300.8c0-14.592 6.336-41.6 48.576-58.816L453.952 86.208c31.232-12.096 84.736-12.16 116.16 0l404.672 155.52c42.88 17.408 49.216 44.48 49.216 59.072 0 14.592-6.336 41.536-48.64 58.816L570.048 515.392c-13.312 6.08-31.68 9.408-54.464 9.408zM73.92 300.8l406.464 154.752c10.432 3.584 21.248 5.248 35.2 5.248 16.512 0 25.344-2.432 29.76-4.416L950.016 300.8 547.072 145.984c-16.768-6.528-53.504-6.464-70.08 0L73.92 300.8z"
      p-id="2536"
    ></path>
    <path
      d="M515.584 644.16c-20.736 0-38.784-2.88-56.896-9.024L180.16 529.152l22.72-59.84 277.44 105.664c10.496 3.52 21.312 5.248 35.2 5.248 16.448 0 25.28-2.432 29.76-4.48l275.136-105.792 22.976 59.776-273.344 105.024c-13.376 6.144-31.744 9.408-54.464 9.408z"
      p-id="2537"
    ></path>
    <path
      d="M515.456 947.2c-164.8 0-346.304-50.368-355.328-161.024L160 499.2a32 32 0 0 1 64 0v281.024C228.416 836.352 361.92 883.2 515.456 883.2c120.768 0 232.32-28.352 271.296-68.928 9.344-9.664 13.632-19.328 13.184-29.376V501.504a32 32 0 0 1 64 0v278.72c1.152 29.632-9.6 56-30.976 78.336-62.784 65.344-205.12 88.64-317.504 88.64zM896 627.2a32 32 0 1 0 64 0 32 32 0 1 0-64 0z"
      p-id="2538"
    ></path>
  </svg>
);

const StudentIcon = (props) => {
  return <Icon component={Myicon} {...props}></Icon>;
};

function HeadTitle() {
  return (
    <div className="head-title">
      <StudentIcon></StudentIcon> | <span>在线考试系统</span>
    </div>
  );
}

const { Item } = Form;
function Home(props) {
  const [identity, setIdentity] = useState(false);
  async function login(data) {
    const { card, password } = data;
    const url = identity ? "/session/teacher" : "/session/student";
    const msgObj = identity
      ? { te_card: card, te_password: password }
      : { st_card: card, st_password: password };
    request(
      await axios.post(url, msgObj),
      (response) => {
        localStorage.setItem("userinfo", JSON.stringify(response.data.data));
        location.href = identity ? "/teacher" : "/student";
      },
      () => null
    );
  }

  return (
    <div className="warpper" style={{ backgroundImage: `url(${img})` }}>
      <HeadTitle></HeadTitle>
      <Card
        bordered={false}
        className="login-win"
        title={<h2 className="title">{!identity ? "学生" : "老师"}登陆</h2>}
      >
        <Form layout="vertical" onFinish={login}>
          <Item
            label={identity ? "工号" : "学号"}
            name="card"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Item>
          <Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password />
          </Item>

          <Item valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>记住我</Checkbox>
            <Switch
              checkedChildren={"我是老师"}
              unCheckedChildren={"我是学生"}
              onChange={(checked) => setIdentity(checked)}
            ></Switch>
          </Item>

          <Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: "5%" }}
            >
              登陆
            </Button>
            <Button
              type="dashed"
              danger
              onClick={() => (location.href = "./register")}
            >
              注册
            </Button>
          </Item>
          <Form.Item>
            <div className="bottom-icons">
              <QqOutlined></QqOutlined>
              <WechatOutlined></WechatOutlined>
              <GithubOutlined></GithubOutlined>
              <DingdingOutlined></DingdingOutlined>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

ReactDom.render(<Home></Home>, document.querySelector("#root"));
