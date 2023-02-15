import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default class ZeroRtc {
  constructor(url) {
    this.url = url;
    this.stompClient = null;
    this.localUserId = Math.random().toString(36).substring(2);
    this.remoteUserId = -1;
    this.roomId = -1;
    this.localStream = null;
    this.localVideo = null;
  }

  createWebsocket() {
    const socket = new SockJS(this.url);
    this.stompClient = Stomp.over(socket);
  }

  sendMessage(url,message) {
    this.stompClient.send(url, {}, message);
  }

  openLocalStream(stream) {
    console.log("开启本地流");
    this.dojoin(this.roomId);
    this.localStream = stream;
    this.localVideo.srcObject = stream;
  }

  dojoin(roomId) {
    const jsonMsg = {
      cmd: "join",
      roomId: roomId,
      uid: this.localUserId,
    };

    const message = JSON.stringify(jsonMsg);
    this.sendMessage(message);
    console.log(`dojoin msg: ${message}`);
  }
}
