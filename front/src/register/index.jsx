import React, { useState } from "react";
import ReactDom from "react-dom";
import "./index.scss";
import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
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
import constant from "../constant";
import img from "./金水桥down.jpg";

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

function App(props) {
  const [identity, setIdentity] = useState(false);
  return (
    <div className="warpper" style={{ backgroundImage: `url(${img})` }}>
      <HeadTitle></HeadTitle>
      <div className="register-window">
        <Form
          onFinish={async (v) => {
            const url =
              v.identity === constant.identity.student
                ? "/students"
                : "/teachers";
            try {
              const msgdata = identity
                ? {
                    te_name: v.name,
                    te_card: v.card,
                    te_sex: v.sex,
                    te_age: v.age,
                    te_password: v.password,
                  }
                : {
                    st_name: v.name,
                    st_card: v.card,
                    st_sex: v.sex,
                    st_age: v.age,
                    st_password: v.password,
                  };
              console.log(msgdata);
              const response = await axios.post(url, msgdata);
              if (response.status === 200) {
                const { data, msg, code } = response.data;
                if (code === constant.code.success) {
                  notification.success({
                    message: "注册成功，即将跳转至登录页",
                  });
                  setTimeout(() => {
                    location.href = "./login";
                  }, 1500);
                } else {
                  notification.error({
                    message: "错误",
                    description:
                      typeof msg === "object"
                        ? "系统错误，请查看后台日志"
                        : msg,
                  });
                }
              } else {
                notification.error({
                  message: "错误代码" + response.status,
                  description: JSON.stringify(response.data),
                });
              }
            } catch (error) {
              notification.error({ description: "错误，服务器不存在" });
            }
          }}
        >
          <Form.Item>
            <h1 className="title">注册</h1>
          </Form.Item>
          <Form.Item
            label="用户名"
            name={"name"}
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined></UserOutlined>}></Input>
          </Form.Item>
          <Form.Item
            label={identity ? "工号" : "学号"}
            name={"card"}
            rules={[{ required: true, message: "请输入学号" }]}
          >
            <InputNumber
              prefix={<NumberOutlined></NumberOutlined>}
              controls={false}
              style={{ width: "100%" }}
            ></InputNumber>
          </Form.Item>
          <Form.Item>
            <Form.Item
              label="性别"
              name={"sex"}
              style={{ display: "inline-block" }}
              rules={[{ required: true, message: "请选择性别" }]}
            >
              <Radio.Group>
                <Radio.Button value={constant.sex.male}>男</Radio.Button>
                <Radio.Button value={constant.sex.female}>女</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="身份"
              style={{ display: "inline-block", margin: "0 20px" }}
              name={"identity"}
              rules={[{ required: true, message: "请选择身份" }]}
            >
              <Radio.Group>
                <Radio.Button
                  value={constant.identity.student}
                  onClick={() => {
                    setIdentity(false);
                  }}
                >
                  学生
                </Radio.Button>
                <Radio.Button
                  value={constant.identity.teacher}
                  onClick={() => {
                    setIdentity(true);
                  }}
                >
                  老师
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form.Item>
          <Form.Item
            label="年龄"
            name={"age"}
            rules={[{ required: true, message: "请输入年龄" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix={
                <svg
                  t="1675750055982"
                  className="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3987"
                  width="15"
                  height="15"
                >
                  <path
                    d="M950.421333 438.421333C950.421333 196.693333 753.770667 0 512 0 270.250667 0 73.578667 196.672 73.6 438.4c0 200.042667 137.045333 374.634667 328.746667 424.128-28.885333 92.992-90.816 118.826667-94.101333 120.106667-9.664 3.626667-15.381333 13.674667-13.525333 23.829333C296.576 1016.576 305.429333 1024 315.733333 1024l392.512 0c0.170667 0 0.298667 0 0.426667 0 11.797333 0 21.376-9.578667 21.461333-21.354667 0-9.578667-6.293333-17.664-14.997333-20.373333-10.709333-5.226667-65.706667-35.818667-92.885333-119.893333C813.610667 812.714667 950.421333 638.165333 950.421333 438.421333zM643.925333 981.248 382.037333 981.248c25.664-26.112 52.842667-67.456 67.242667-129.450667 0.021333-0.170667 0.128-0.277333 0.170667-0.448 0.021333-0.106667-0.021333-0.192 0-0.298667 6.250667-27.178667 10.304-57.92 10.304-93.738667 0-112.725333-43.946667-193.6-85.376-244.8 22.058667 10.090667 47.978667 23.765333 77.184 42.090667 9.578667 5.994667 22.144 3.541333 28.736-5.632 20.266667-28.288 44.778667-48.064 67.328-61.738667-3.498667 7.957333-6.336 15.808-8.384 23.146667-7.125333 25.408-5.866667 46.122667 3.498667 61.717333 5.888 9.749333 18.538667 13.162667 28.501333 7.637333 19.584-10.666667 40.426667-16.725333 59.84-20.053333-33.877333 34.325333-66.88 94.336-66.88 197.632 0 35.562667 4.245333 66.197333 10.752 93.376 0.042667 0.192-0.042667 0.362667 0 0.533333 0.064 0.277333 0.256 0.469333 0.32 0.746667C590.229333 913.344 618.090667 954.922667 643.925333 981.248zM612.309333 820.864c-3.264-19.114667-5.312-40.042667-5.312-63.509333 0-172.181333 101.866667-198.912 106.005333-199.914667 10.048-2.304 17.045333-11.349333 16.661333-21.589333-0.341333-10.218667-7.957333-18.816-18.090667-20.373333-1.322667-0.234667-68.330667-9.834667-132.949333 14.250667 0.448-2.410667 1.088-4.970667 1.834667-7.786667 8.106667-29.226667 29.674667-59.306667 39.658667-64.554667 9.344-4.949333 13.674667-15.957333 10.218667-25.962667-3.498667-10.005333-13.909333-15.893333-24.170667-13.952-3.712 0.682667-86.485333 17.130667-148.330667 90.901333-100.586667-59.968-161.877333-66.410667-164.565333-66.666667-9.728-0.874667-18.944 4.928-22.186667 14.229333-3.242667 9.258667 0.277333 19.584 8.512 24.938667 5.632 3.648 137.450667 91.797333 137.450667 276.458667 0 23.509333-1.834667 44.565333-4.928 63.616-172.565333-44.949333-295.808-202.304-295.808-382.549333 0-218.154667 177.472-395.669333 395.648-395.669333 218.176 0 395.648 177.493333 395.648 395.669333C907.605333 618.453333 784.554667 775.744 612.309333 820.864z"
                    p-id="3988"
                  ></path>
                </svg>
              }
            ></InputNumber>
          </Form.Item>
          <Form.Item
            label="密码"
            name={"password"}
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input
              prefix={<LockOutlined></LockOutlined>}
              type="password"
            ></Input>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" style={{ width: "180px" }}>
              注册
            </Button>
          </Form.Item>
          <Divider></Divider>
          <Form.Item>
            <div className="bottom-icons">
              <QqOutlined></QqOutlined>
              <WechatOutlined></WechatOutlined>
              <GithubOutlined></GithubOutlined>
              <DingdingOutlined></DingdingOutlined>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

ReactDom.render(<App></App>, document.querySelector("#root"));
