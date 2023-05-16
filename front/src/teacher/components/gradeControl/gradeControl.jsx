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
  Form,
  DatePicker,
  InputNumber,
  Typography,
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import request from "../../../request";
import ImgCrop from "antd-img-crop";

import "./gradeControl.scss";
import { CameraOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import constant from "../../../constant";
const { Paragraph, Text } = Typography;

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

function StartAnExamModal(props) {
  const { open, setOpen, gr_id } = props;
  const [form, setForm] = useState({
    pa_name: "",
    pa_begintime: "",
    pa_duringtime: "",
  });
  const disabledDate = (current) => {
    return current && current < dayjs().endOf("day");
  };
  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false, -1);
      }}
      footer={[
        <Button
          key={"cancelBtn"}
          onClick={() => {
            setOpen(false, -1);
          }}
        >
          取消
        </Button>,
        <Button
          type="primary"
          key={"confirmBtn"}
          onClick={() => {
            const data = { ...form, gr_id };
            console.log(data);
            request(
              axios.put("/papers", data),
              (response) => {
                setOpen(false, -1);
                notification.success({
                  message: "创建成功，请转到考试管理查看",
                });
              },
              () => null
            );
          }}
        >
          确定
        </Button>,
      ]}
      title="发起考试"
    >
      <Form>
        <Form.Item name={"pa_name"} label={<strong>试卷名</strong>}>
          <Input
            value={form.pa_name}
            onChange={(e) => {
              setForm({ ...form, pa_name: e.currentTarget.value });
            }}
          ></Input>
        </Form.Item>
        <Form.Item name={"pa_begintime"} label={<strong>开始时间</strong>}>
          <DatePicker
            format="YYYY-MM-DD HH:mm:ss"
            // disabledDate={disabledDate}
            showTime={{ defaultValue: dayjs("00:00:00", "HH:mm:ss") }}
            value={form.pa_begintime}
            onChange={(v) => {
              setForm({ ...form, pa_begintime: v.toDate() });
            }}
          />
        </Form.Item>
        <Form.Item name={"pa_duringtime"} label={<strong>考试时长</strong>}>
          <InputNumber
            value={form.pa_duringtime}
            min={1}
            max={360}
            controls={false}
            onChange={(value) => {
              setForm({ ...form, pa_duringtime: value });
            }}
            addonAfter="分钟"
          ></InputNumber>
        </Form.Item>
      </Form>
    </Modal>
  );
}

function GradeListItem(props) {
  const { getGradeInfo, setStartExam } = props;
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
          key={"moreBtn"}
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
        <a key={"startBtn"} onClick={() => setStartExam(item.gr_id)}>
          开启一场考试
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
                    onChange={(e) => {
                      setForm({
                        ...form,
                        gr_name: e.currentTarget.value,
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
                    onChange={(e) => {
                      setForm({
                        ...form,
                        gr_info: e.currentTarget.value,
                      });
                    }}
                  ></Input.TextArea>
                ) : (
                  <>
                    <br />
                    <span className="grade-modal-info-des">{item.gr_info}</span>
                  </>
                )}
              </p>
              <p>
                <span className="grade-modal-info-title">班级口令</span>
                <Paragraph copyable>{item.gr_password}</Paragraph>
              </p>
              <p>
                <span className="grade-modal-info-title">创建时间</span>
                {dayjs(item.gr_founddate)
                  .format("YYYY年MM月DD日HH时MM分")
                  .toString()}
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
      startExam: false,
      startExamGr_id: -1,
    };

    this.getGradeInfo = this.getGradeInfo.bind(this);
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
        <StartAnExamModal
          key={this.state.startExamGr_id}
          open={this.state.startExam}
          gr_id={this.state.startExamGr_id}
          setOpen={(bool, id = this.state.startExamGr_id) =>
            this.setState({ startExam: bool, startExamGr_id: id })
          }
        ></StartAnExamModal>
        <Modal
          open={this.state.showModal}
          className="create-grade-modal"
          title="创建一个班级"
          onOk={async () => {
            if (this.state.gradeForm.gr_name === "") {
              notification.error({ message: "请输入班级名称" });
              return;
            }
            const { userInfo } = this.props.global;
            request(
              axios.post(`/grades`, {
                ...this.state.gradeForm,
                te_id: userInfo.te_id,
              }),
              async (response) => {
                if (response.data.code === constant.code.success) {
                  notification.success({
                    message: "创建成功",
                    placement: "top",
                    duration: 0,
                    description: (
                      <Paragraph>
                        该班级的口令是：
                        <Paragraph copyable>
                          {response.data.data.gr_password}
                        </Paragraph>
                      </Paragraph>
                    ),
                  });
                }
                await this.getGradeInfo();
              },
              () => {
                this.setState({
                  showModal: false,
                  gradeForm: {
                    gr_name: "",
                    gr_avatar:
                      "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
                    gr_info: "",
                  },
                });
              }
            );
          }}
          onCancel={() =>
            this.setState({
              showModal: false,
              gradeForm: {
                gr_name: "",
                gr_avatar:
                  "https://img1.baidu.com/it/u=2121025603,1672671484&fm=253&fmt=auto&app=138&f=PNG?w=500&h=500",
                gr_info: "",
              },
            })
          }
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
            onChange={(e) => {
              this.setState({
                gradeForm: {
                  ...this.state.gradeForm,
                  gr_name: e.currentTarget.value,
                },
              });
            }}
            className="name-input-bar"
          ></Input>
          <h3>通知信息</h3>
          <Input.TextArea
            value={this.state.gradeForm.gr_info}
            onChange={(e) =>
              this.setState({
                gradeForm: {
                  ...this.state.gradeForm,
                  gr_info: e.currentTarget.value,
                },
              })
            }
          ></Input.TextArea>
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
                    setStartExam={(gr_id) =>
                      this.setState({ startExam: true, startExamGr_id: gr_id })
                    }
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
