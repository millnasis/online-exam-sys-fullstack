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
  notification,
  InputNumber,
  Skeleton,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import constant from "../../../constant";
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

function GradeListItem(props) {
  const [open, setOpen] = useState(false);
  const [fetching, setFetchinng] = useState(false);
  const [member, setMember] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const { item } = props;
  return (
    <List.Item
      actions={[<a onClick={() => setOpen(true)}>更多</a>]}
      className="list-item"
      key={item.gr_id}
    >
      <Modal
        title="班级信息"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
      >
        {fetching ? (
          <Skeleton></Skeleton>
        ) : (
          <div className="grade-modal">
            <Avatar
              src={item.gr_avatar}
              className="grade-modal-avatar"
            ></Avatar>
            <div className="grade-modal-info">
              <p>
                <strong>{item.gr_name}</strong>
              </p>
              <p>
                <span className="grade-modal-info-title">班级信息</span>
                <span
                className="grade-modal-info-des"
                  
                >
                  {item.gr_info}
                </span>
              </p>
              <p>
                <span className="grade-modal-info-title">创建时间</span>
                {item.gr_founddate}
              </p>
              <p>
                <span className="grade-modal-info-title">加入时间</span>
                {item.gs_founddate}
              </p>
              <List
                header={
                  <div>
                    <span className="grade-modal-info-title">班级成员(50)</span>
                  </div>
                }
                dataSource={member}
                renderItem={(memberItem) => {
                  return (
                    <List.Item
                      actions={[<a>查看</a>]}
                      className="grade-modal-member"
                    >
                      <Avatar className="grade-modal-member-avatar"></Avatar>
                      什么几把名字
                    </List.Item>
                  );
                }}
              ></List>
            </div>
          </div>
        )}
      </Modal>
      <List.Item.Meta
        avatar={
          <Avatar size={"large"} shape={"square"} src={item.gr_avatar}></Avatar>
        }
        title={item.gr_name}
        description={item.gr_info}
      ></List.Item.Meta>
    </List.Item>
  );
}

class GradeControl extends React.Component {
  constructor(props) {
    super(props);
    this.originData = fakeData;
    this.state = {
      filterData: fakeData,
      showModal: false,
      gradeInput: "",
    };
  }

  async getGradeInfo() {
    const { userInfo } = this.props.global;
    try {
      const response = await axios.get("/grades/student/" + userInfo.st_id);
      if (response.status === 200) {
        const { data, msg, code } = response.data;
        if (code === constant.code.error) {
          notification.error({
            message: "错误",
            description:
              typeof msg === "object" ? "系统错误，请查看后台日志" : msg,
          });
          console.log(data);
        } else {
          this.setState({
            filterData: response.data.data,
          });
        }
      } else {
        notification.error({
          message: "错误代码" + response.status,
          description: JSON.stringify(response.data),
        });
      }
    } catch (error) {
      notification.error({ description: "错误，未找到服务器" });
    }
  }

  componentDidMount() {
    this.getGradeInfo();
  }

  render() {
    return (
      <div className="grade-control">
        <Modal
          open={this.state.showModal}
          title="加入一个班级"
          onOk={async () => {
            if (this.state.gradeInput === "") {
              notification.error({ message: "请输入班级id" });
              return;
            }
            const { userInfo } = this.props.global;
            try {
              const response = await axios.post(
                `/grade-student/grade/${this.state.gradeInput}`,
                userInfo
              );
              if (response.status === 200) {
                const { data, msg, code } = response.data;
                if (code === constant.code.error) {
                  notification.error({
                    message: "错误",
                    description:
                      typeof msg === "object"
                        ? "系统错误，请查看后台日志"
                        : msg,
                  });
                  console.log(data);
                } else {
                  await this.getGradeInfo();
                }
              } else {
                notification.error({
                  message: "错误代码" + response.status,
                  description: JSON.stringify(response.data),
                });
              }
            } catch (error) {
              notification.error({ description: "错误，未找到服务器" });
            } finally {
              this.setState({
                showModal: false,
              });
            }
          }}
          onCancel={() => this.setState({ showModal: false })}
        >
          <InputNumber
            addonBefore={"班级id"}
            value={this.state.gradeInput}
            onChange={(v) => {
              this.setState({ gradeInput: v });
            }}
            style={{ width: "100%" }}
            controls={false}
          ></InputNumber>
        </Modal>
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
            <Button
              className="join-grade-btn"
              type="primary"
              onClick={() => this.setState({ showModal: true, gradeInput: "" })}
            >
              加入班级
            </Button>
          </Col>
          <Divider></Divider>
          <Col span={24}>
            <List
              dataSource={this.state.filterData}
              split={true}
              size={"large"}
              renderItem={(item) => {
                return <GradeListItem item={item}></GradeListItem>;
              }}
            ></List>
          </Col>
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
  };
}

export default connect(mapStateToProps, null)(GradeControl);
