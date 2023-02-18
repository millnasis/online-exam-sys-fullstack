import SockJS from "sockjs-client";
import Stomp from "stompjs";
import constants from "../constant";
const { signal } = constants;

const respPrefix = "/ws-resp/";
const sendPrefix = "/signal/";

export default class ZeroRtc {
  constructor(url) {
    this.url = url;
    this.stompClient = null;
    this.localUserId = Math.random().toString(36).substring(2);
    this.remoteUserId = -1;
    this.roomId = -1;
    this.localStream = null;
    this.remoteStream = null;
    this.localVideo = document.querySelector("#localVideo");
    this.remoteVideo = document.querySelector("#remoteVideo");
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
          this.remoteUserId = msg.remoteUid;
          console.log(signal.SIGNAL_TYPE_NEW_PEER, msg);
          this.doOffer();
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_RESP_JOIN + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          this.remoteUserId = msg.remoteUid;
          console.log(signal.SIGNAL_TYPE_RESP_JOIN, msg);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_PEER_LEAVE + `/${this.localUserId}`,
        (resp) => {
          this.remoteUserId = -1;
          this.remoteVideo.srcObject = null;
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_OFFER + `/${this.localUserId}`,
        (resp) => {
          if (this.peerConnection === null) {
            this.createPeerConnection();
          }
          const msg = JSON.parse(resp.body);
          const desc = JSON.parse(msg.msg);
          this.peerConnection.setRemoteDescription(desc);
          this.doAnswer();
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_ANSWER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          const desc = JSON.parse(msg.msg);
          this.peerConnection.setRemoteDescription(desc);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_CANDIDATE + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.parse(resp.body);
          const candidate = JSON.parse(msg.msg);
          this.peerConnection.addIceCandidate(candidate);
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
        audio: true,
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
    this.peerConnection = null;
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

  createPeerConnection() {
    this.peerConnection = new RTCPeerConnection(null);
    this.peerConnection.onicecandidate = (e) => {
      console.log("处理candidate");
      if (e.candidate) {
        const jsonMsg = {
          uid: this.localUserId,
          remoteUid: this.remoteUserId,
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
    };
    this.peerConnection.ontrack = (e) => {
      console.log("添加远程流");
      this.remoteStream = e.streams[0];
      this.remoteVideo.srcObject = this.remoteStream;
    };

    this.localStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }

  async doOffer() {
    console.log("现在的remoteUid是", this.remoteUserId);
    if (this.peerConnection === null) {
      this.createPeerConnection();
    }
    const session = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(session);
    const jsonMsg = {
      uid: this.localUserId,
      remoteUid: this.remoteUserId,
      msg: JSON.stringify(session),
    };
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_OFFER + "/" + this.roomId,
      message
    );
    console.log("do offer msg:" + message);
  }

  async doAnswer() {
    const session = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(session);
    const jsonMsg = {
      uid: this.localUserId,
      remoteUid: this.remoteUserId,
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
    this.remoteVideo.srcObject = null;
    this.closeLocalStream();
    if (this.peerConnection !== null) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
  }
}
