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
    this.localVideo = document.querySelector("#localVideo");
    this.remoteVideo = document.querySelector("#remoteVideo");
  }

  createWebsocket() {
    const socket = new SockJS(this.url);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, (frame) => {
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_NEW_PEER + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.stringify(resp.body);
          this.remoteUserId = msg.remoteUid;
          console.log(signal.SIGNAL_TYPE_NEW_PEER, msg);
        }
      );
      this.stompClient.subscribe(
        respPrefix + signal.SIGNAL_TYPE_RESP_JOIN + `/${this.localUserId}`,
        (resp) => {
          const msg = JSON.stringify(resp.body);
          this.remoteUserId = msg.remoteUid;
          console.log(signal.SIGNAL_TYPE_RESP_JOIN, msg);
        }
      );
      this.stompClient.subscribe(respPrefix+signal.SIGNAL_TYPE_PEER_LEAVE + `/${this.localUserId}`,(resp)=>{
        const msg = JSON.stringify(resp.body);
        this.remoteUserId = -1;
        this.remoteVideo.srcObject = null;

      })
    });
  }

  sendMessage(url, message) {
    this.stompClient.send(url, {}, message);
  }

  async initLocalStream(roomid) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    this.roomId = roomid;
    this.openLocalStream(stream);
  }

  openLocalStream(stream) {
    console.log("开启本地流");
    this.dojoin(this.roomId);
    this.localStream = stream;
    this.localVideo.srcObject = stream;
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

  doLeave(){
    const jsonMsg = {
      uid: this.localUserId,
    }
    this.localStream = null;
    this.localVideo.srcObject = null;
    const message = JSON.stringify(jsonMsg);
    this.sendMessage(
      sendPrefix + signal.SIGNAL_TYPE_LEAVE + "/" + this.roomId,
      message
    );
    console.log(`doleave msg: ${message}`);
  }
}
