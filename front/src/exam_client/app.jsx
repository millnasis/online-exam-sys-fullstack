import React from "react";
import { Layout, List } from "antd";
import constant from "../constant";
const { Header, Footer, Sider, Content } = Layout;
import "./app.scss";
import { CheckOutlined } from "@ant-design/icons";

const fakeData = [
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe:
      "瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈瓦尼吗玩你妈",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "123",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[0]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image:
      '["https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500"]',
  },
  {
    qu_id: "12322",
    pa_id: "123",
    qu_type: constant.question_type.choose,
    qu_answer: "[1,2]",
    qu_describe: "asjdoiasjdoiasjdas?",
    qu_score: 12,
    qu_choose: '["玩你妈","伞兵一号","准备就绪"]',
    qu_image: "[]",
  },
  {
    qu_id: "124",
    pa_id: "1234",
    qu_type: constant.question_type.fill,
    qu_answer: '["fuck","die"]',
    qu_describe: "asjdoiasj___doia___sjdas?",
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
  {
    qu_id: "125",
    pa_id: "1235",
    qu_type: constant.question_type.subject,
    qu_answer: "[]",
    qu_describe: "<div>fasdjaklsdjalskduck?</div>",
    qu_choose: "[]",
    qu_score: 12,
    qu_image: "[]",
  },
];

function overFlowHandle(content) {
  if (content.length > 30) {
    return content.substring(0, 30) + "...";
  }
  return content;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      questionList: fakeData,
    };
  }

  componentDidMount() {
    localStorage.setItem(
      "userinfo",
      JSON.stringify({
        st_id: 123,
        st_name: "MillNasis",
        st_sex: "M",
        st_avatar:
          "https://img-blog.csdnimg.cn/img_convert/4cef4c0a5c42d4ccae9ba327c550350b.png",
        st_age: 23,
        st_registerdate: "2023-02-07",
        st_password: null,
        st_card: "3192052051725",
      })
    );
    const userInfo = localStorage.getItem("userinfo");
    if (userInfo === null) {
      notification.error({ message: "未找到您的登陆信息，请重新登陆" });
      setTimeout(() => {
        location.href = "./login";
      }, 1500);
    }
    console.log(userInfo);
    this.setState({ userInfo: JSON.parse(userInfo) });
  }

  render() {
    return (
      <Layout className="home">
        <Header className="header">Header</Header>
        <Layout className="body">
          <div className="sider">
            <List
              header={<h1>xxx考试，当前第x题，共x题</h1>}
              className="sider-question-list"
              dataSource={this.state.questionList}
              renderItem={(item, index) => {
                return (
                  <List.Item
                    className="question-list-item"
                    key={item.qu_id}
                    actions={[<CheckOutlined></CheckOutlined>]}
                  >
                    <strong>{`${index + 1}. ${overFlowHandle(
                      item.qu_describe
                    )}`}</strong>
                    {`(${item.qu_score}分)`}
                  </List.Item>
                );
              }}
            ></List>
          </div>
          <Content className="content">Content</Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
