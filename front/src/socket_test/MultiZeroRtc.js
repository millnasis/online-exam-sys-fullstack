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
    this.localUserId = Math.random().toString(36).substring(2);
    this.remoteUserIdList = [];
    this.roomId = -1;
    this.localStream = null;
    this.remoteStreamMap = new Map();
    this.localVideo = document.querySelector("#localVideo");
    this.remoteVideoMap = new Map();
    this.peerConnectionMap = null;
  }

  createWebsocket() {
    const socket = new SockJS(this.url, null, {
      sessionId: () => this.localUserId,
    });
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_NEW_PEER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserIdList.push(msg.remoteUid);
          // console.log(signal.SIGNAL_TYPE_NEW_PEER, msg);
          this.doOffer(msg.remoteUid);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_RESP_JOIN + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserIdList.push(msg.remoteUid);
          this.remoteStreamMap.set(msg.remoteUid, null);
          // 这里应该获取dom对象给remoteVideo
          this.remoteVideoMap.set(msg.remoteUid, null);
          this.peerConnectionMap.set(msg.remoteUid, null);
          // console.log(signal.SIGNAL_TYPE_RESP_JOIN, msg);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_PEER_LEAVE + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserIdList = this.remoteUserIdList.filter((value) => {
            return value != msg.remoteUid;
          });
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
        (resp) => {
          const msg = JSON.parse(resp.body);
          const remoteUid = msg.remoteUid;
          const desc = JSON.parse(msg.msg);
          const peerConnection = this.peerConnectionMap.get(remoteUid);
          if (peerConnection === null) {
            this.createPeerConnection(remoteUid);
          }
          peerConnection.setRemoteDescription(desc);
          this.doAnswer();
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_ANSWER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          const desc = JSON.parse(msg.msg);
          const peerConnection = this.peerConnectionMap.get(msg.remoteUid);
          peerConnection.setRemoteDescription(desc);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_CANDIDATE + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          const candidate = JSON.parse(msg.msg);
          const peerConnection = this.peerConnectionMap.get(remoteUid);
          peerConnection.addIceCandidate(candidate);
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

  openLocalStream(stream) {
    console.log("开启本地流");
    this.dojoin(this.roomId);
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

  dojoin(roomId) {
    const jsonMsg = {
      uid: this.localUserId,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_JOIN + "/" + roomId,
      message
    );
    console.log(`dojoin msg: ${message}`);
  }

  createPeerConnection(remoteUid) {
    const peerConnection = new RTCPeerConnection(null);
    peerConnection.onicecandidate = (e) => {
      if (e.candidate) {
        const jsonMsg = {
          uid: this.localUserId,
          remoteUid: remoteUid,
          msg: JSON.stringify(e.candidate),
        };
        const message = JSON.stringify(jsonMsg);
        this.sendMessage(
          sendPrefix + signal.SIGNAL_TYPE_CANDIDATE + "/" + this.roomId,
          message
        );
      } else {
        console.log("candidate处理终止");
      }
      peerConnection.ontrack = (e) => {
        let remotestream = this.remoteStreamMap.get(remoteUid);
        remotestream = e.streams[0];
        this.remoteStreamMap.set(remoteUid, remotestream);
        let remoteVideo = this.remoteVideoMap.get(remoteUid);
        remoteVideo.srcObject = remotestream;
        this.remoteVideoMap.set(remoteUid, remoteVideo);
      };
    };

    this.localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, this.localStream);
    });

    this.peerConnectionMap.set(remoteUid, peerConnection);
  }

  async doOffer(remoteUid) {
    console.log("现在的remoteUid是", remoteUid);
    const peerConnection = this.peerConnectionMap.get(remoteUid);
    if (peerConnection === null) {
      this.createPeerConnection(remoteUid);
    }
    const session = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(session);
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
    console.log("do offer msg:" + message);
  }

  async doAnswer(remoteUid) {
    const peerConnection = this.peerConnectionMap.get(remoteUid);
    const session = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(session);
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
    console.log("do answer msg:" + message);
  }

  doLeave() {
    const jsonMsg = {
      uid: this.localUserId,
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
    this.remoteVideoMap.forEach((remoteVideo) => {
      remoteVideo.srcObject = null;
    });
    this.closeLocalStream();
    this.peerConnectionMap.forEach((peerConnection) => {
      if (peerConnection !== null) {
        peerConnection.close();
      }
    });
    this.peerConnectionMap.clear();
  }
}
