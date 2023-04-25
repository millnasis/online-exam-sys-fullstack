import React from "react";
import { Button, Steps, notification } from "antd";
import { CameraOutlined } from "@ant-design/icons";

function checkFunc() {
  //检测电脑设备是否已经安装了摄像头
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
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

        // there is no 'videoouput' in the spec.

        MediaDevices.push(device);
      });

      if (callback) {
        callback();
      }
    });
  }
  //end

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
  });
}

const description = "This is a description.";

function MyCamera(props) {
  return (
    <div className="my-camera">
      <CameraOutlined></CameraOutlined>
    </div>
  );
}

function MyStep(props) {
  const { step } = props;
  switch (step) {
    case 0:
      return (
        <div className="inner-step">
          <MyCamera></MyCamera>
          <Button
            onClick={() => {
              checkFunc();
            }}
          >
            开启摄像头
          </Button>
        </div>
      );
    case 1:
      return (
        <div className="inner-step">
          <Button>开启摄像头</Button>
        </div>
      );
    case 2:
      return (
        <div className="inner-step">
          <Button>开启摄像头</Button>
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
    return (
      <div className="check">
        <Steps
          className="step"
          current={this.state.step}
          items={[
            {
              title: "开启摄像头",
              description,
            },
            {
              title: "全屏模式",
              description,
            },
            {
              title: "开始考试",
              description,
            },
          ]}
        ></Steps>
        <div className="step-body">
          <MyStep step={this.state.step}></MyStep>
        </div>
      </div>
    );
  }
}

export default Check;
