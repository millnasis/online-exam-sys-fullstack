import {
  Avatar,
  Col,
  List,
  Row,
  Input,
  Button,
  Radio,
  Divider,
  Modal,
} from "antd";
import React, { useState } from "react";
import "./gradeControl.scss";

const fakeData = [
  {
    gr_id: "123",
    gr_info: "通知消息",
    gr_name: "班级名字",
    gr_avatar:
      "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
    te_id: "1234",
    gr_founddate: "2023年3月2日12:00:16",
    gr_lastupdate: "2023年3月2日12:03:28",
    gs_founddate: "2023年3月2日12:03:28",
  },
  {
    gr_id: "1234",
    gr_info: "通知消息",
    gr_avatar:
      "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
    gr_name: "班级名字",
    te_id: "1234",
    gr_lastupdate: "2023年3月2日12:03:28",
    gs_founddate: "2023年3月2日12:03:28",
    gr_founddate: "2023年3月2日12:00:16",
  },
  {
    gr_id: "1235",
    gr_info:
      "通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息通知消息",
    gr_name: "班级名字",
    gr_avatar:
      "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
    te_id: "1234",
    gr_lastupdate: "2023年3月2日12:03:28",
    gr_founddate: "2023年3月2日12:00:16",
    gs_founddate: "2023年3月2日12:03:28",
  },
];

function ActionButton(props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a onClick={() => setOpen(true)}>更多</a>
      <Modal
        title="班级信息"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      ></Modal>
    </>
  );
}

class GradeControl extends React.Component {
  constructor(props) {
    super(props);
    this.originData = fakeData;
    this.state = {
      filterData: fakeData,
    };
  }

  render() {
    return (
      <div className="grade-control">
        <Row gutter={16}>
          <Col span={12}>
            <Input.Search
              prefix={"搜索班级"}
              placeholder={"输入班级名称搜索"}
            ></Input.Search>
          </Col>
          <Col span={12}>
            <span>排序方式：</span>
            <Radio.Group defaultValue={"new"}>
              <Radio.Button value={"new"}>最新消息</Radio.Button>
              <Radio.Button value={"time"}>加入时间</Radio.Button>
              <Radio.Button value={"name"}>按名称</Radio.Button>
            </Radio.Group>
          </Col>
          <Divider></Divider>
          <Col span={24}>
            <List
              dataSource={this.state.filterData}
              split={true}
              size={"large"}
              renderItem={(item) => {
                return (
                  <List.Item
                    actions={[<ActionButton></ActionButton>]}
                    className="list-item"
                    key={item.gr_id}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size={"large"}
                          shape={"square"}
                          src={item.gr_avatar}
                        ></Avatar>
                      }
                      title={item.gr_name}
                      description={item.gr_info}
                    ></List.Item.Meta>
                  </List.Item>
                );
              }}
            ></List>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GradeControl;
