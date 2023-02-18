package com.online_exam_sys.controller;

import java.security.Principal;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import com.online_exam_sys.util.Constant;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.online_exam_sys.pojo.signal.PeerLeaveSignal;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate template;

    @EventListener
    public void handleWebsocketConnect(SessionConnectedEvent event) {
        log.info("WebSocket 客户端已连接: {}",
                event);
    }

    @EventListener
    public void handleWebsocketDisconnect(SessionDisconnectEvent event) {
        log.info("WebSocket 客户端断开链接: {}",
                event);
        String uuid = event.getSessionId();
        String roomid = MsgController.getUserRoomMap().get(uuid);

        if (roomid == null) {
            log.error("无法找到对应房间id:{}", MsgController.getUserRoomMap().entrySet());
            return;
        }
        Set<String> roomSet = MsgController.getRoomTableMap().get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }
        roomSet.remove(uuid);

        log.info("force leave " + roomid + " 操作，消息：{}", uuid);
        log.info("当前房间{}人数:{}", roomid, roomSet.size());
        if (roomSet.size() > 0) {
            roomSet.forEach((uid) -> {
                log.info("当前uid:{}", uid);
                PeerLeaveSignal pls = new PeerLeaveSignal();
                pls.setRemoteUid(uuid);
                this.template.convertAndSend("/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid,
                        pls);

                log.info("发送给{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid);

            });
        }

    }
}
