import { Avatar, Button, Divider, Input, InputNumber, Upload } from "antd";
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

class UserSetting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      form: {
        sex: "F",
        name: null,
        age: 0,
        avatar: "",
      },
      loading: false,
      avatar: [],
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
              src={this.state.form.avatar}
              className="user-avatar"
            ></Avatar>
            {this.state.edit ? (
              <ImgCrop rotate>
                <Upload
                  className="user-avatar-upload-btn"
                  action="/api/upload/avatar"
                  listType="picture-card"
                  fileList={this.state.avatar}
                  name="avatar"
                  onChange={(e) => {
                    this.setState({ avatar: e.fileList });
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
                      form: { ...this.state.form, name: v.currentTarget.value },
                    });
                  }}
                  value={this.state.form.name}
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
                      sex: userInfo.st_sex,
                      name: userInfo.st_name,
                      age: userInfo.st_age,
                      avatar: userInfo.st_avatar,
                    },
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
                      this.setState({ form: { ...this.state.form, sex: "F" } })
                    }
                    checked={this.state.form.sex === "M"}
                    readOnly
                  ></input>
                  男&nbsp;
                  <input
                    readOnly
                    type={"radio"}
                    name="sex"
                    onClick={() =>
                      this.setState({ form: { ...this.state.form, sex: "M" } })
                    }
                    checked={this.state.form.sex === "F"}
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
                      form: { ...this.state.form, age: v.currentTarget.value },
                    });
                  }}
                  value={this.state.form.age}
                ></InputNumber>
              ) : (
                userInfo.st_age
              )}
            </p>
            <Divider></Divider>
            <p>
              <span className="title">注册日期</span>
              {userInfo.st_registerdate}
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
                    this.setState({ loading: true });
                    const response = await axios.post("/students", {
                      ...userInfo,
                      ...this.state.form,
                    });
                    if (
                      response.status === 200 &&
                      response.data.code === constant.code.success
                    ) {
                      this.props.get_user_info(userInfo.st_card);
                      this.setState({ loading: false });
                    }
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
