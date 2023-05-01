import SockJS from "sockjs-client";
import Stomp from "stompjs";
import constants from "../constant";
const { signal } = constants;

const respPrefix = "/ws-resp/";
const sendPrefix = "/signal/";

export default class MultiZeroRtc {
  constructor(url, joinCallBack, exitCallBack) {
    this.url = url;
    this.stompClient = null;
    this.localUserId = null;
    this.remoteUserIdList = [];
    this.roomId = -1;
    this.localStream = null;
    this.localVideo = null;
    this.peerConnectionMap = null;
    this.joinCallBack = joinCallBack;
    this.exitCallBack = exitCallBack;

    this.setLocalVideo = this.setLocalVideo.bind(this);
    this.reopenLocalStream = this.reopenLocalStream.bind(this);
    this.setlocalUserId = this.setlocalUserId.bind(this);
    this.dojoin = this.dojoin.bind(this);
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
    });
  }

  sendMessage(url, message) {
    this.stompClient.send(url, {}, message);
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
    // 创建多个peerConnection
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
    const peerConnection = new RTCPeerConnection(null);
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
