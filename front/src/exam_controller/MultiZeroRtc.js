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
    this.remoteStreamMap = new Map();
    this.remoteVideoMap = new Map();
    this.peerConnectionMap = null;
    this.joinCallBack = null;
    this.exitCallBack = null;
    this.screenoffCallBack = null;
    this.handinCallback = null;

    this.setlocalUserId = this.setlocalUserId.bind(this);
  }

  setlocalUserId(id) {
    this.localUserId = id;
  }

  getRemoteUserIdList() {
    return this.remoteUserIdList;
  }

  createWebsocket(pa_id) {
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
          this.joinCallBack(msg.remoteUid);
          const remoteVideo = document.querySelector(
            "#camera-window" + msg.remoteUid
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
          this.joinCallBack(studentIdList);
          studentIdList.forEach((studentId) => {
            const remoteVideo = document.querySelector(
              "#camera-window" + studentId
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
          this.exitCallBack(msg.remoteUid);
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
            this.joinCallBack(remoteUid);
            const remoteVideo = document.querySelector(
              "#camera-window" + remoteUid
            );
            this.remoteVideoMap.set(remoteUid, remoteVideo);
          }
          const desc = JSON.parse(msg.msg);
          if (!this.peerConnectionMap.has(remoteUid)) {
            console.log("订阅到了offer，id是" + remoteUid, msg);
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
        respPrefix + "screenoff/" + this.localUserId,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.screenoffCallBack(msg.st_id);
        }
      );
      this.stompClient.subscribe(
        respPrefix + "handin/" + this.localUserId,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.handinCallback(msg.st_id, msg.ep_id);
        }
      );
      this.initLocalStream(pa_id);
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

  sendWarning(ep_id, st_id, msg) {
    const jsonMsg = {
      ep_id,
      st_id,
      msg,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(sendPrefix + "warning" + "/" + st_id, message);
  }

  sendInfo(msg) {
    const roomid = this.roomId;
    const jsonMsg = {
      roomid,
      msg,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(sendPrefix + "info" + "/" + roomid, message);
  }

  sendSetCheat(ep_id, st_id) {
    const jsonMsg = {
      ep_id,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(sendPrefix + "cheat" + "/" + st_id, message);
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
