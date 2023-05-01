package com.online_exam_sys.controller;

import java.util.Map;
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
        String uuid = event.getSessionId();
        log.info("WebSocket 客户端断开链接: {},sessionId是：{}",
                event, uuid);

        log.info("{}\n{}\n{}\n{}", MsgController.getTeacherRoomTableMap(), MsgController.getTeacherUserRoomMap(),
                MsgController.getStudentRoomTableMap(),
                MsgController.getStudentUserRoomMap());
        // uuid是建立socket连接时传进来的身份信息
        String[] split = uuid.split(" ");
        Map<String, String> roomMap;
        Map<String, Set<String>> tableMap;
        Map<String, Set<String>> atableMap;
        // 解析身份并获取对应的房间集合
        if ("S".equals(split[0])) {
            roomMap = MsgController.getStudentUserRoomMap();
            tableMap = MsgController.getStudentRoomTableMap();
            atableMap = MsgController.getTeacherRoomTableMap();
        } else {
            roomMap = MsgController.getTeacherUserRoomMap();
            tableMap = MsgController.getTeacherRoomTableMap();
            atableMap = MsgController.getStudentRoomTableMap();

        }
        String roomid = roomMap.get(split[1]);

        if (roomid == null) {
            log.error("无法找到对应房间id:{}", roomMap.entrySet());
            return;
        }
        Set<String> roomSet = tableMap.get(roomid);
        Set<String> aroomSet = atableMap.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }
        roomSet.remove(split[1]);

        // 执行强制离开操作
        log.info("force leave " + roomid + " 操作，消息：{}", split[1]);
        log.info("当前房间{}人数:{}", roomid, roomSet.size());
        if (aroomSet.size() > 0) {
            aroomSet.forEach((uid) -> {
                log.info("当前uid:{}", uid);
                PeerLeaveSignal pls = new PeerLeaveSignal();
                pls.setRemoteUid(split[1]);
                this.template.convertAndSend("/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid,
                        pls);

                log.info("发送给{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid);

            });
        }

    }
}
