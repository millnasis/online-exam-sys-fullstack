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
import axios from "axios";
import "./index.scss";

import request from "../request";

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
    <div className="warpper">
      <Card
        className="login-win"
        title={<h2 className="title">{!identity ? "学生" : "老师"}登陆</h2>}
      >
        <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} onFinish={login}>
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

          <Item valuePropName="checked" wrapperCol={{ offset: 16, span: 16 }}>
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
        </Form>
      </Card>
    </div>
  );
}

ReactDom.render(<Home></Home>, document.querySelector("#root"));
