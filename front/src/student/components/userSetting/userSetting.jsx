import { Avatar, Button, Divider, Input, Radio, Upload } from "antd";
import React from "react";
import { connect } from "react-redux";
import ImgCrop from "antd-img-crop";
import { CameraOutlined } from "@ant-design/icons";
import "./userSetting.scss";

class UserSetting extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      form: { sex: "F" },
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
              src={userInfo.st_avatar}
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
                <Input className="input-bar" size="large"></Input>
              ) : (
                userInfo.st_name
              )}
            </p>
            <p
              className="user-info-change-btn"
              onClick={(e) => this.setState({ edit: true })}
            >
              编辑信息
            </p>
            <p>
              <span>学号</span>
              {this.state.edit ? (
                <Input className="input-bar"></Input>
              ) : (
                userInfo.st_card
              )}
            </p>
            <Divider></Divider>
            <p>
              <span>性别</span>
              {this.state.edit ? (
                <span className="input-bar radio-group">
                  <input
                    type={"radio"}
                    name="sex"
                    onClick={() =>
                      this.setState({ form: { ...this.state.form, sex: "F" } })
                    }
                    checked={this.state.form.sex === "F"}
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
                    checked={this.state.form.sex === "M"}
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
              <span>年龄</span>
              {this.state.edit ? (
                <Input className="input-bar"></Input>
              ) : (
                userInfo.st_age
              )}
            </p>
            <Divider></Divider>
            <p>
              <span>注册日期</span>
              {userInfo.st_registerdate}
            </p>
            {!this.state.edit &&
            (
              <p>
                <Button>取消</Button>
                <Button type="primary">保存</Button>
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
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSetting);
