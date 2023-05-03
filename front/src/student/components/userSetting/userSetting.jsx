import {
  Avatar,
  Button,
  Divider,
  Input,
  InputNumber,
  notification,
  Upload,
} from "antd";
import React from "react";
import { connect } from "react-redux";
import ImgCrop from "antd-img-crop";
import axios from "axios";

import { actions } from "../../reducers/root.js";
const { get_user_info } = actions;

import { CameraOutlined } from "@ant-design/icons";
import "./userSetting.scss";
import constant from "../../../constant";
import { bindActionCreators } from "redux";
import request from "../../../request.js";
import dayjs from "dayjs";

class UserSetting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      form: {
        st_sex: "F",
        st_name: null,
        st_age: 0,
        st_avatar: "",
      },
      avatar_temp: "",
    };
  }

  render() {
    const { userInfo } = this.props.global;
    return (
      <div className="user-setting">
        <div className="background-img"></div>
        <div className="user-info">
          <div className="user-avatar-warp">
            <Avatar
              size={"large"}
              shape="square"
              src={
                this.state.edit ? this.state.form.st_avatar : userInfo.st_avatar
              }
              className="user-avatar"
            ></Avatar>
            {this.state.edit ? (
              <ImgCrop rotate>
                <Upload
                  className="user-avatar-upload-btn"
                  action="/upload/student/avatar"
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
                            st_avatar: url,
                          },
                          avatar_temp: e.file.response.data,
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
            ) : null}
          </div>
          <div className="user-info-detail">
            <p className="user-name">
              {this.state.edit ? (
                <Input
                  className="input-bar"
                  size="large"
                  onChange={(v) => {
                    this.setState({
                      form: {
                        ...this.state.form,
                        st_name: v.currentTarget.value,
                      },
                    });
                  }}
                  value={this.state.form.st_name}
                ></Input>
              ) : (
                userInfo.st_name
              )}
            </p>
            {!this.state.edit && (
              <p
                className="user-info-change-btn"
                onClick={(e) => {
                  const { userInfo } = this.props.global;
                  this.setState({
                    edit: true,
                    form: {
                      st_sex: userInfo.st_sex,
                      st_name: userInfo.st_name,
                      st_age: userInfo.st_age,
                      st_avatar: userInfo.st_avatar,
                    },
                    avatar_temp: "",
                  });
                }}
              >
                编辑信息
              </p>
            )}
            <p>
              <span className="title">学号</span>
              {userInfo.st_card}
            </p>
            <Divider></Divider>
            <p>
              <span className="title">性别</span>
              {this.state.edit ? (
                <span className="input-bar radio-group">
                  <input
                    type={"radio"}
                    name="sex"
                    onClick={() =>
                      this.setState({
                        form: { ...this.state.form, st_sex: "M" },
                      })
                    }
                    checked={this.state.form.st_sex === "M"}
                    readOnly
                  ></input>
                  男&nbsp;
                  <input
                    readOnly
                    type={"radio"}
                    name="sex"
                    onClick={() =>
                      this.setState({
                        form: { ...this.state.form, st_sex: "F" },
                      })
                    }
                    checked={this.state.form.st_sex === "F"}
                  ></input>
                  女
                </span>
              ) : userInfo.st_sex === "M" ? (
                "男"
              ) : (
                "女"
              )}
            </p>
            <Divider></Divider>
            <p>
              <span className="title">年龄</span>
              {this.state.edit ? (
                <InputNumber
                  controls={false}
                  min={0}
                  className="input-bar"
                  onChange={(v) => {
                    this.setState({
                      form: { ...this.state.form, st_age: v },
                    });
                  }}
                  value={this.state.form.st_age}
                ></InputNumber>
              ) : (
                userInfo.st_age
              )}
            </p>
            <Divider></Divider>
            <p>
              <span className="title">注册时间</span>
              {dayjs(userInfo.st_registerdate)
                .format("YYYY年MM月DD日HH时MM分")
                .toString()}
            </p>
            {this.state.edit && (
              <p className="control-btn">
                <Button
                  className="btn"
                  onClick={() => this.setState({ edit: false })}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  className="btn"
                  onClick={async () => {
                    request(
                      axios.put("/students", {
                        ...userInfo,
                        ...this.state.form,
                        st_avatar:
                          this.state.avatar_temp === ""
                            ? this.state.form.st_avatar
                            : this.state.avatar_temp,
                      }),
                      (response) => {
                        this.props.get_user_info(userInfo.st_id);
                      },
                      () => {
                        this.setState({ edit: false });
                      }
                    );
                  }}
                  loading={this.state.loading}
                >
                  保存
                </Button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    global: state.global,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    get_user_info: bindActionCreators(get_user_info, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSetting);
