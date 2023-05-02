import React, { useState } from "react";
import { Button, Steps, Typography, notification } from "antd";
import { CameraOutlined } from "@ant-design/icons";

function checkFunc(back) {
  //检测电脑设备是否已经安装了摄像头
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    navigator.enumerateDevices = function (callback) {
      navigator.mediaDevices.enumerateDevices().then(callback);
    };
  }
  var MediaDevices = [];
  var isHTTPs = location.protocol === "https:";
  var canEnumerate = false;

  if (
    typeof MediaStreamTrack !== "undefined" &&
    "getSources" in MediaStreamTrack
  ) {
    canEnumerate = true;
  } else if (
    navigator.mediaDevices &&
    !!navigator.mediaDevices.enumerateDevices
  ) {
    canEnumerate = true;
  }

  var hasWebcam = false;

  var isWebcamAlreadyCaptured = false;

  function checkDeviceSupport(callback) {
    if (!canEnumerate) {
      return;
    }

    if (
      !navigator.enumerateDevices &&
      window.MediaStreamTrack &&
      window.MediaStreamTrack.getSources
    ) {
      navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(
        window.MediaStreamTrack
      );
    }

    if (!navigator.enumerateDevices && navigator.enumerateDevices) {
      navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
    }

    if (!navigator.enumerateDevices) {
      if (callback) {
        callback();
      }
      return;
    }

    MediaDevices = [];
    navigator.enumerateDevices(function (devices) {
      devices.forEach(function (_device) {
        var device = {};
        for (var d in _device) {
          device[d] = _device[d];
        }

        if (device.kind === "audio") {
          device.kind = "audioinput";
        }

        if (device.kind === "video") {
          device.kind = "videoinput";
        }

        var skip;
        MediaDevices.forEach(function (d) {
          if (d.id === device.id && d.kind === device.kind) {
            skip = true;
          }
        });

        if (skip) {
          return;
        }

        if (!device.deviceId) {
          device.deviceId = device.id;
        }

        if (!device.id) {
          device.id = device.deviceId;
        }

        if (!device.label) {
          device.label = "Please invoke getUserMedia once.";
          if (!isHTTPs) {
            device.label =
              "HTTPs is required to get label of this " +
              device.kind +
              " device.";
          }
        } else {
          if (device.kind === "videoinput" && !isWebcamAlreadyCaptured) {
            isWebcamAlreadyCaptured = true;
          }
        }

        if (device.kind === "videoinput") {
          hasWebcam = true;
        }


        MediaDevices.push(device);
      });

      if (callback) {
        callback();
      }
    });
  }

  // 该函数已提前封装
  checkDeviceSupport(function () {
    if (hasWebcam == false) {
      console.log("没有摄像头！");
      notification.error({ message: "没有摄像头！" });
      return false;
    } else {
      if (isWebcamAlreadyCaptured == false) {
        console.log("捕获摄像头失败，请重新安装摄像头！");
        notification.error({ message: "捕获摄像头失败，请重新安装摄像头！" });
        return false;
      }
    }
    notification.success({ message: "找到了摄像头!!" });
    back();
  });
}

function MyCamera(props) {
  return (
    <div className="my-camera">
      <video
        id="camera-window"
        autoPlay
        playsInline
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "100%",
          height: "100%",
        }}
      ></video>
      <CameraOutlined></CameraOutlined>
    </div>
  );
}

function MyStep(props) {
  const {
    step,
    opencamera,
    setlocalvideo,
    nextStep,
    startexam,
    reopenlocalstream,
  } = props;
  const [enable, setEnable] = useState(0);
  switch (step) {
    case 0:
      return (
        <div className="inner-step">
          <MyCamera></MyCamera>
          <p>
            <Button
              onClick={() => {
                checkFunc(() => {
                  setlocalvideo(document.querySelector("#camera-window"));
                  opencamera();
                  setEnable(true);
                });
              }}
              disabled={enable}
            >
              开启摄像头
            </Button>
            <Button
              type="primary"
              disabled={!enable}
              onClick={() => {
                setlocalvideo(document.querySelector("#camera-window-header"));
                reopenlocalstream();
                setEnable(false);
                nextStep();
              }}
            >
              下一步
            </Button>
          </p>
        </div>
      );
    case 1:
      return (
        <div className="inner-step">
          <p>
            <Button
              onClick={() => {
                document.documentElement.requestFullscreen();
                setEnable(true);
                document.documentElement.onfullscreenchange = (e) => {
                  console.log(e);
                };
              }}
            >
              开启全屏模式
            </Button>
            <Button
              type="primary"
              disabled={!enable}
              onClick={() => {
                setEnable(false);
                nextStep();
              }}
            >
              下一步
            </Button>
          </p>
        </div>
      );
    case 2:
      return (
        <div className="inner-step">
          <Typography style={{ textAlign: "center" }}>
            <Typography.Title level={2}>注意</Typography.Title>
            <Typography.Paragraph>
              开始考试后您的切屏次数会被记录，并且将开启摄像头监控
            </Typography.Paragraph>
          </Typography>
          <Button
            type="primary"
            onClick={() => {
              startexam();
            }}
          >
            开始考试
          </Button>
        </div>
      );

    default:
      break;
  }
}

class Check extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      step: 0,
    };
  }

  render() {
    const { opencamera, setlocalvideo, startexam, reopenlocalstream } =
      this.props;

    return (
      <div className="check">
        <Steps
          className="step"
          current={this.state.step}
          items={[
            {
              title: "开启摄像头",
            },
            {
              title: "全屏模式",
            },
            {
              title: "开始考试",
            },
          ]}
        ></Steps>
        <div className="step-body">
          <MyStep
            step={this.state.step}
            nextStep={() => this.setState({ step: this.state.step + 1 })}
            opencamera={opencamera}
            setlocalvideo={setlocalvideo}
            startexam={startexam}
            reopenlocalstream={reopenlocalstream}
          ></MyStep>
        </div>
      </div>
    );
  }
}

export default Check;
