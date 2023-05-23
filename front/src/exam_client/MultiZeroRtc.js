import SockJS from "sockjs-client";
import Stomp from "stompjs";
import constants from "../constant";
const { signal } = constants;

const respPrefix = "/ws-resp/";
const sendPrefix = "/signal/";

export default class MultiZeroRtc {
  constructor(url) {
    this.url = url;
    this.stompClient = null;
    this.localUserId = null;
    this.remoteUserIdList = [];
    this.roomId = -1;
    this.localStream = null;
    this.localVideo = null;
    this.peerConnectionMap = null;

    this.setLocalVideo = this.setLocalVideo.bind(this);
    this.reopenLocalStream = this.reopenLocalStream.bind(this);
    this.setlocalUserId = this.setlocalUserId.bind(this);
    this.dojoin = this.dojoin.bind(this);

    this.joinCallBack = null;
    this.exitCallBack = null;
    this.cheatCallBack = null;
    this.warningCallback = null;
    this.infoCallback = null;
  }

  setLocalVideo(element) {
    console.log(element, this);
    this.localVideo = element;
  }

  setlocalUserId(id) {
    this.localUserId = id;
  }

  getRemoteUserIdList() {
    return this.remoteUserIdList;
  }

  createWebsocket() {
    const socket = new SockJS(this.url, null, {
      sessionId: () => "S " + this.localUserId,
    });
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_NEW_PEER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserIdList.push(msg.remoteUid);
          this.joinCallBack();
          this.doOffer(msg.remoteUid);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_RESP_JOIN + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          const { teacherIdList } = msg;
          console.log("返回的信息!!!", msg);
          this.remoteUserIdList.push(...teacherIdList);
          this.joinCallBack();
          teacherIdList.forEach((teacherId) => {
            this.doOffer(teacherId);
          });
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_PEER_LEAVE + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserIdList = this.remoteUserIdList.filter((value) => {
            return value != msg.remoteUid;
          });
          this.exitCallBack();
          const peerConnection = this.peerConnectionMap.get(msg.remoteUid);
          if (peerConnection !== null) {
            peerConnection.close();
          }
          this.peerConnectionMap.delete(msg.remoteUid);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_OFFER + `/${this.localUserId}`,
        async (resp) => {
          const msg = JSON.parse(resp.body);
          const remoteUid = msg.uid;
          const desc = JSON.parse(msg.msg);
          if (!this.peerConnectionMap.has(remoteUid)) {
            console.log("订阅到了offer，id是" + remoteUid);
            await this.createPeerConnection(remoteUid);
          }
          const peerConnection = this.peerConnectionMap.get(remoteUid);
          if (peerConnection.remoteDescription === null) {
            await peerConnection.setRemoteDescription(desc);
          }
          await this.doAnswer(remoteUid);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_ANSWER + `/${this.localUserId}`,
        async (resp) => {
          const msg = JSON.parse(resp.body);
          const desc = JSON.parse(msg.msg);
          const remoteUid = msg.uid;
          const peerConnection = this.peerConnectionMap.get(remoteUid);
          if (peerConnection.remoteDescription === null) {
            await peerConnection.setRemoteDescription(desc);
          }
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_CANDIDATE + `/${this.localUserId}`,
        async (resp) => {
          const msg = JSON.parse(resp.body);
          const candidate = JSON.parse(msg.msg);
          const remoteUid = msg.uid;
          const peerConnection = this.peerConnectionMap.get(remoteUid);
          console.log(this);
          await peerConnection.addIceCandidate(candidate);
        }
      );
      this.stompClient.subscribe(
        respPrefix + "cheat" + "/" + this.localUserId,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.cheatCallBack();
        }
      );
      this.stompClient.subscribe(
        respPrefix + "warning" + "/" + this.localUserId,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.warningCallback(msg.msg);
        }
      );
      this.stompClient.subscribe(
        respPrefix + "info" + "/" + this.localUserId,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.infoCallback(msg.msg);
        }
      );
    });
  }

  sendMessage(url, message) {
    this.stompClient.send(url, {}, message);
  }

  sendSetScreenoff(ep_id, pa_id) {
    const jsonMsg = {
      ep_id,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(sendPrefix + "screenoff" + "/" + pa_id, message);
  }

  async initLocalStream(roomid) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // audio: true,
        video: true,
      });
      this.roomId = roomid;
      this.openLocalStream(stream);
    } catch (error) {
      console.error(error);
    }
  }
  reopenLocalStream() {
    this.localVideo.srcObject = this.localStream;
  }

  openLocalStream(stream) {
    console.log("开启本地流");
    this.localStream = stream;
    this.localVideo.srcObject = stream;
    // 创建存放多个peerConnection的集合，一个peerConnection对应一个端对端连接
    this.peerConnectionMap = new Map();
  }

  closeLocalStream() {
    if (this.localStream !== null) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
  }

  dojoin() {
    const roomId = this.roomId;
    const jsonMsg = {
      uid: this.localUserId,
      identity: "student",
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_JOIN + "/" + roomId,
      message
    );
    console.log(`dojoin msg: ${message}`);
  }

  async createPeerConnection(remoteUid) {
    const peerConnection = new RTCPeerConnection({
      bundlePolicy: "max-bundle",
      rtcpMuxPolicy: "require",
      // relay是强制使用转发服务器，all是能打洞则打洞
      iceTransportPolicy: "all",
      iceServers: [
        {
          urls: [
            "turn:114.55.40.109:3478?transport=udp",
            "turn:114.55.40.109:3478?transport=tcp",
          ],
          username: "tyy",
          credential: "123456",
        },
        {
          urls: ["stun:114.55.40.109:3478"],
        },
      ],
    });
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const jsonMsg = {
          uid: this.localUserId,
          remoteUid: remoteUid,
          msg: JSON.stringify(e.candidate),
          identity: "student",
        };
        const message = JSON.stringify(jsonMsg);
        this.sendMessage(
          sendPrefix + signal.SIGNAL_TYPE_CANDIDATE + "/" + this.roomId,
          message
        );
      } else {
        console.log("candidate处理终止");
        console.log(this);
      }
    };

    this.localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnectionMap.set(remoteUid, peerConnection);
  }

  async doOffer(remoteUid) {
    console.log("现在的remoteUid是", remoteUid);
    if (!this.peerConnectionMap.has(remoteUid)) {
      console.log("主动创建的offer，id是" + remoteUid);
      await this.createPeerConnection(remoteUid);
    }
    const peerConnection = this.peerConnectionMap.get(remoteUid);
    const session = await peerConnection.createOffer();
    const jsonMsg = {
      uid: this.localUserId,
      remoteUid: remoteUid,
      msg: JSON.stringify(session),
    };
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_OFFER + "/" + this.roomId,
      message
    );
    console.log(this);
    await peerConnection.setLocalDescription(session);
    console.log("do offer msg:" + message);
  }

  async doAnswer(remoteUid) {
    console.log("做了answer!!!");
    const peerConnection = this.peerConnectionMap.get(remoteUid);
    const session = await peerConnection.createAnswer();
    const jsonMsg = {
      uid: this.localUserId,
      remoteUid: remoteUid,
      msg: JSON.stringify(session),
    };
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_ANSWER + "/" + this.roomId,
      message
    );
    console.log(this);
    await peerConnection.setLocalDescription(session);
    console.log("do answer msg:" + message);
  }

  doLeave() {
    const jsonMsg = {
      uid: this.localUserId,
      identity: "student",
    };
    this.localStream = null;
    this.localVideo.srcObject = null;
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_LEAVE + "/" + this.roomId,
      message
    );
    console.log(`doleave msg: ${message}`);
  }

  hangup() {
    this.localVideo.srcObject = null;
    this.closeLocalStream();
    this.peerConnectionMap.forEach((peerConnection) => {
      if (peerConnection !== null) {
        peerConnection.close();
      }
    });
    this.peerConnectionMap.clear();
    this.exitCallBack();
  }
}
