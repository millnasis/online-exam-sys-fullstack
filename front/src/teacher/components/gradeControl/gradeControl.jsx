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
  Upload,
  Skeleton,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { connect } from "react-redux";
import request from "../../../request";
import ImgCrop from "antd-img-crop";

import "./gradeControl.scss";
import { CameraOutlined } from "@ant-design/icons";

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
  const { getGradeInfo } = props;
  const [open, setOpen] = useState(false);
  const [fetching, setFetchinng] = useState(false);
  const [member, setMember] = useState([]);
  const { item } = props;
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ gr_avatar: "", gr_info: "", gr_name: "" });
  const [avatar_temp, setAvatar_temp] = useState("");
  return (
    <List.Item
      actions={[
        <a
          onClick={() => {
            setOpen(true);
            setFetchinng(true);
            request(
              axios.get("/students/grade/" + item.gr_id),
              (response) => {
                setMember(response.data.data);
              },
              () => {
                setFetchinng(false);
              }
            );
          }}
        >
          更多
        </a>,
      ]}
      className="list-item"
      key={item.gr_id}
    >
      <Modal
        title="班级信息"
        open={open}
        onCancel={() => {
          if (edit) {
            setEdit(false);
          } else {
            setOpen(false);
          }
        }}
        footer={
          edit
            ? [
                <Button key={"cancelBtn"} onClick={() => setEdit(false)}>
                  取消
                </Button>,
                <Button
                  type="primary"
                  key={"okBtn"}
                  onClick={() => {
                    request(
                      axios.put("/grades", {
                        ...item,
                        ...form,
                        gr_avatar:
                          avatar_temp === "" ? form.gr_avatar : avatar_temp,
                      }),
                      (response) => {
                        getGradeInfo();
                      },
                      () => {
                        setEdit(false);
                      }
                    );
                    setEdit(false);
                  }}
                >
                  确定
                </Button>,
              ]
            : [
                <Button danger key={"dangerBtn"}>
                  解散班级
                </Button>,
                <Button
                  type="primary"
                  key={"okBtn"}
                  onClick={() => setOpen(false)}
                >
                  确定
                </Button>,
              ]
        }
      >
        {fetching ? (
          <Skeleton></Skeleton>
        ) : (
          <div className="grade-modal">
            {edit || (
              <span
                className="edit-btn"
                onClick={() => {
                  setForm({
                    gr_avatar: item.gr_avatar,
                    gr_info: item.gr_info,
                    gr_name: item.gr_name,
                  });
                  setAvatar_temp("");
                  setEdit(true);
                }}
              >
                修改信息
              </span>
            )}
            <div className="grade-avatar-warp">
              <Avatar
                src={edit ? form.gr_avatar : item.gr_avatar}
                className="grade-modal-avatar"
              ></Avatar>
              {edit && (
                <ImgCrop rotate>
                  <Upload
                    className="grade-avatar-upload-btn"
                    action={"/upload/grade/avatar/" + item.gr_id}
                    listType="picture-card"
                    name="avatar"
                    showUploadList={false}
                    onChange={(e) => {
                      if ("done" === e.file.status) {
                        const reader = new FileReader();
                        reader.addEventListener("load", () => {
                          const url = reader.result;
                          setForm({
                            ...form,
                            gr_avatar: url,
                          });
                          setAvatar_temp(e.file.response.data);
                        });
                        reader.readAsDataURL(e.file.originFileObj);
                      }
                    }}
                    maxCount={1}
                  >
                    <CameraOutlined></CameraOutlined>
                  </Upload>
                </ImgCrop>
              )}
            </div>
            <div className="grade-modal-info">
              <p>
                {edit ? (
                  <Input
                    addonBefore={"班级名字"}
                    value={form.gr_name}
                    onChange={(v) => {
                      setForm({
                        ...form,
                        gr_name: v,
                      });
                    }}
                  ></Input>
                ) : (
                  <strong>{item.gr_name}</strong>
                )}
              </p>
              <p>
                <span className="grade-modal-info-title">班级信息</span>
                {edit ? (
                  <Input.TextArea
                    value={form.gr_info}
                    onChange={(v) => {
                      setForm({
                        ...form,
                        gr_info: v,
                      });
                    }}
                  ></Input.TextArea>
                ) : (
                  <span className="grade-modal-info-des">{item.gr_info}</span>
                )}
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
                      <Avatar
                        className="grade-modal-member-avatar"
                        src={memberItem.st_avatar}
                      ></Avatar>
                      {memberItem.st_name}
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
      gradeForm: {
        gr_name: "",
        gr_avatar:
          "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
        gr_info: "",
      },
    };
  }

  async getGradeInfo() {
    const { userInfo } = this.props.global;
    request(
      axios.get("/grades/teacher/" + userInfo.te_id),
      (response) => {
        this.originData = response.data.data;
        this.setState({
          filterData: response.data.data,
        });
      },
      () => null
    );
  }

  componentDidMount() {
    this.getGradeInfo();
  }

  render() {
    return (
      <div className="grade-control">
        <Modal
          open={this.state.showModal}
          className="create-grade-modal"
          title="创建一个班级"
          onOk={async () => {
            if (this.state.gradeInput === "") {
              notification.error({ message: "请输入班级id" });
              return;
            }
            const { userInfo } = this.props.global;
            request(
              axios.post(
                `/grade-student/grade/${this.state.gradeInput}`,
                userInfo
              ),
              async () => {
                await this.getGradeInfo();
              },
              () => {
                this.setState({
                  showModal: false,
                });
              }
            );
          }}
          onCancel={() => this.setState({ showModal: false })}
        >
          <h3>班级头像</h3>
          <div className="avatar-warp">
            <Avatar
              src={this.state.gradeForm.gr_avatar}
              className="form-avatar"
            ></Avatar>
            <ImgCrop rotate>
              <Upload
                className="avatar-upload-btn"
                action="/upload/grade/avatar"
                listType="picture-card"
                name="avatar"
                showUploadList={false}
                onChange={(e) => {
                  if ("done" === e.file.status) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      const url = reader.result;
                      this.setState({
                        form: {
                          ...this.state.form,
                          gr_avatar: url,
                        },
                      });
                    });
                    reader.readAsDataURL(e.file.originFileObj);
                  }
                }}
                maxCount={1}
              >
                <CameraOutlined></CameraOutlined>上传
              </Upload>
            </ImgCrop>
          </div>
          <h3>班级名称</h3>
          <Input
            value={this.state.gradeForm.gr_name}
            onChange={(v) => {
              this.setState({
                gradeForm: { ...this.state.gradeForm, gr_name: v },
              });
            }}
            className="name-input-bar"
          ></Input>
          <h3>通知信息</h3>
          <Input.TextArea></Input.TextArea>
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
              <Radio.Button value={"time"}>创建时间</Radio.Button>
              <Radio.Button value={"name"}>按名称</Radio.Button>
            </Radio.Group>
            <Button
              className="join-grade-btn"
              type="primary"
              onClick={() => this.setState({ showModal: true, gradeInput: "" })}
            >
              创建班级
            </Button>
          </Col>
          <Divider></Divider>
          <Col span={24}>
            <List
              dataSource={this.state.filterData}
              split={true}
              size={"large"}
              renderItem={(item) => {
                return (
                  <GradeListItem
                    item={item}
                    getGradeInfo={this.getGradeInfo}
                  ></GradeListItem>
                );
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
