import { Avatar, Divider } from "antd";
import React from "react";
import { connect } from "react-redux";
import "./userSetting.scss";

class UserSetting extends React.Component {
  constructor(props) {
    super(props);
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
          </div>
          <div className="user-info-detail">
            <p className="user-name">{userInfo.st_name}</p>
            <p>
              <span>学号</span>
              {userInfo.st_card}
            </p>
            <Divider></Divider>
            <p>
              <span>性别</span>
              {userInfo.st_sex === "M" ? "男" : "女"}
            </p>
            <Divider></Divider>
            <p>
              <span>年龄</span>
              {userInfo.st_age}
            </p>
            <Divider></Divider>
            <p>
              <span>注册日期</span>
              {userInfo.st_registerdate}
            </p>
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
