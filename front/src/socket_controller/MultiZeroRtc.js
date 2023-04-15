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
    this.localUserId = Math.random().toString(36).substring(2);
    this.remoteUserIdList = [];
    this.roomId = -1;
    this.remoteStreamMap = new Map();
    this.remoteVideoMap = new Map();
    this.peerConnectionMap = null;
    this.joinCallBack = joinCallBack;
    this.exitCallBack = exitCallBack;
  }

  getRemoteUserIdList() {
    return this.remoteUserIdList;
  }

  createWebsocket() {
    const socket = new SockJS(this.url, null, {
      sessionId: () => "T " + this.localUserId,
    });
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_NEW_PEER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          console.log("返回的信息!!!", msg);
          this.remoteUserIdList.push(msg.remoteUid);
          this.joinCallBack();
          const remoteVideo = document.querySelector(
            "#remoteVideo" + msg.remoteUid
          );
          this.remoteVideoMap.set(msg.remoteUid, remoteVideo);
          // console.log(signal.SIGNAL_TYPE_NEW_PEER, msg);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_RESP_JOIN + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          console.log("返回的信息!!!", msg);
          const { studentIdList } = msg;
          this.remoteUserIdList.push(...studentIdList);
          this.joinCallBack();
          studentIdList.forEach((studentId) => {
            const remoteVideo = document.querySelector(
              "#remoteVideo" + studentId
            );
            this.remoteVideoMap.set(studentId, remoteVideo);
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
          this.remoteStreamMap.delete(msg.remoteUid);
          const video = this.remoteVideoMap.get(msg.remoteUid);
          video.srcObject = null;
          this.remoteVideoMap.delete(msg.remoteUid);
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
          if (this.remoteUserIdList.findIndex((v) => v === remoteUid) === -1) {
            this.remoteUserIdList.push(remoteUid);
            this.joinCallBack();
            const remoteVideo = document.querySelector(
              "#remoteVideo" + remoteUid
            );
            this.remoteVideoMap.set(remoteUid, remoteVideo);
          }
          const desc = JSON.parse(msg.msg);
          if (!this.peerConnectionMap.has(remoteUid)) {
            console.log("订阅到了offer，id是" + remoteUid,msg);
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
      this.roomId = roomid;
      this.openLocalStream();
    } catch (error) {
      console.error(error);
    }
  }

  openLocalStream() {
    this.dojoin(this.roomId);
    this.peerConnectionMap = new Map();
  }

  dojoin(roomId) {
    const jsonMsg = {
      uid: this.localUserId,
      identity: "teacher",
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
    peerConnection.createOffer({
      offerToReceiveVideo: false,
    });
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const jsonMsg = {
          uid: this.localUserId,
          remoteUid: remoteUid,
          msg: JSON.stringify(e.candidate),
          identity: "teacher",
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
    peerConnection.ontrack = (e) => {
      this.remoteStreamMap.set(remoteUid, e.streams[0]);
      const remoteVideo = this.remoteVideoMap.get(remoteUid);
      console.log("流来啦！！！！！！是" + remoteUid + "的");
      remoteVideo.srcObject = e.streams[0];
    };

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
      identity: "teacher",
    };
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_LEAVE + "/" + this.roomId,
      message
    );
    console.log(`doleave msg: ${message}`);
  }

  hangup() {
    this.remoteVideoMap.forEach((remoteVideo) => {
      remoteVideo.srcObject = null;
    });
    this.peerConnectionMap.forEach((peerConnection) => {
      if (peerConnection !== null) {
        peerConnection.close();
      }
    });
    this.peerConnectionMap.clear();
    this.exitCallBack();
  }
}
