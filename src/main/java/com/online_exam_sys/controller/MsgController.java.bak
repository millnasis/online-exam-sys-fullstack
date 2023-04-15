package com.online_exam_sys.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.online_exam_sys.pojo.Hello;
import com.online_exam_sys.pojo.HelloMessage;
import com.online_exam_sys.pojo.signal.AnswerSignal;
import com.online_exam_sys.pojo.signal.CandidateSignal;
import com.online_exam_sys.pojo.signal.JoinSignal;
import com.online_exam_sys.pojo.signal.LeaveSignal;
import com.online_exam_sys.pojo.signal.NewPeerSignal;
import com.online_exam_sys.pojo.signal.OfferSignal;
import com.online_exam_sys.pojo.signal.PeerLeaveSignal;
import com.online_exam_sys.pojo.signal.RespJoinSignal;
import com.online_exam_sys.util.Constant;

import io.swagger.annotations.Api;
import lombok.extern.slf4j.Slf4j;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentSkipListSet;

@Api(tags = "socket")
@RestController
@Slf4j
public class MsgController {

    private SimpMessagingTemplate template;

    public MsgController(SimpMessagingTemplate simpMessagingTemplate) {
        this.template = simpMessagingTemplate;
    }

    private static final Map<String, Set<String>> ROOM_TABLE_MAP = new ConcurrentHashMap<>();

    private static final Map<String, String> USER_ROOM_MAP = new ConcurrentHashMap<>();

    public static Map<String, Set<String>> getRoomTableMap() {
        return ROOM_TABLE_MAP;
    }

    public static Map<String, String> getUserRoomMap() {
        return USER_ROOM_MAP;
    }

    @MessageMapping("/hello")
    // @SendTo("/topic/greet")
    public void hello(HelloMessage msg) throws InterruptedException {
        Hello h = new Hello();
        h.setContent("HELLO ！！！" + HtmlUtils.htmlEscape(msg.getName()));
        h.setDate(LocalDateTime.now().toString());
        this.template.convertAndSend("/ws-resp/greet", h);
        // return h;
    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_JOIN + "/{roomid}")
    public void join(JoinSignal msgJoin, @DestinationVariable String roomid) {
        log.info("join " + roomid + " 操作，消息：{}", msgJoin);
        Set<String> roomSet = ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            roomSet = new ConcurrentSkipListSet<String>();
            ROOM_TABLE_MAP.put(roomid, roomSet);
        }

        roomSet.add(msgJoin.getUid());
        USER_ROOM_MAP.put(msgJoin.getUid(), roomid);
        log.info("当前房间{}人数:{}", roomid, roomSet.size());
        log.info("set集合:{}", USER_ROOM_MAP.entrySet());
        if (roomSet.size() > 1) {
            roomSet.forEach((uid) -> {
                log.info("当前uid:{}", uid);
                if (!uid.equals(msgJoin.getUid())) {
                    NewPeerSignal nps = new NewPeerSignal();
                    nps.setRemoteUid(msgJoin.getUid());
                    this.template.convertAndSend("/ws-resp/" + Constant.signal.SIGNAL_TYPE_NEW_PEER + "/" + uid,
                            nps);

                    log.info("发送给{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_NEW_PEER + "/" + uid);

                    RespJoinSignal rjs = new RespJoinSignal();
                    rjs.setRemoteUid((String) uid);
                    this.template.convertAndSend(
                            "/ws-resp/" + Constant.signal.SIGNAL_TYPE_RESP_JOIN + "/" + msgJoin.getUid(),
                            rjs);
                    log.info("发送给{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_RESP_JOIN + "/" + msgJoin.getUid());

                }
            });
        }

    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_LEAVE + "/{roomid}")
    public void leave(LeaveSignal msgLeave, @DestinationVariable String roomid) {
        log.info("leave " + roomid + " 操作，消息：{}", msgLeave);
        Set<String> roomSet = ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }

        roomSet.remove(msgLeave.getUid());
        USER_ROOM_MAP.remove(msgLeave.getUid());
        log.info("当前房间{}人数:{}", roomid, roomSet.size());
        if (roomSet.size() > 0) {
            roomSet.forEach((uid) -> {
                log.info("当前uid:{}", uid);
                PeerLeaveSignal pls = new PeerLeaveSignal();
                pls.setRemoteUid(msgLeave.getUid());
                this.template.convertAndSend("/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid,
                        pls);

                log.info("发送给{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_PEER_LEAVE + "/" + uid);

            });
        }

    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_OFFER + "/{roomid}")
    public void offer(OfferSignal msgOffer, @DestinationVariable String roomid) {
        log.info("join " + roomid + " 操作，消息：{}", msgOffer);
        Set<String> roomSet = ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }
        if (!roomSet.contains(msgOffer.getUid())) {
            log.error("无法找到用户{}", msgOffer.getUid());
            return;
        }

        if (!roomSet.contains(msgOffer.getRemoteUid())) {
            log.error("无法找到远程用户{}", msgOffer.getRemoteUid());
            return;
        }

        this.template.convertAndSend(
                "/ws-resp/" + Constant.signal.SIGNAL_TYPE_OFFER + "/" + msgOffer.getRemoteUid(), msgOffer);
        log.info("发送给:{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_OFFER + "/" + msgOffer.getRemoteUid());

    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_ANSWER + "/{roomid}")
    public void answer(AnswerSignal msgAnswer, @DestinationVariable String roomid) {
        log.info("join " + roomid + " 操作，消息：{}", msgAnswer);
        Set<String> roomSet = ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }
        if (!roomSet.contains(msgAnswer.getUid())) {
            log.error("无法找到用户{}", msgAnswer.getUid());
            return;
        }

        if (!roomSet.contains(msgAnswer.getRemoteUid())) {
            log.error("无法找到远程用户{}", msgAnswer.getRemoteUid());
            return;
        }

        this.template.convertAndSend(
                "/ws-resp/" + Constant.signal.SIGNAL_TYPE_ANSWER + "/" + msgAnswer.getRemoteUid(), msgAnswer);
        log.info("发送给:{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_ANSWER + "/" + msgAnswer.getRemoteUid());
    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_CANDIDATE + "/{roomid}")
    public void answer(CandidateSignal msgCandidate, @DestinationVariable String roomid) {
        log.info("join " + roomid + " 操作，消息：{}", msgCandidate);
        Set<String> roomSet = ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }
        if (!roomSet.contains(msgCandidate.getUid())) {
            log.error("无法找到用户{}", msgCandidate.getUid());
            return;
        }

        if (!roomSet.contains(msgCandidate.getRemoteUid())) {
            log.error("无法找到远程用户{}", msgCandidate.getRemoteUid());
            return;
        }

        this.template.convertAndSend(
                "/ws-resp/" + Constant.signal.SIGNAL_TYPE_CANDIDATE + "/" + msgCandidate.getRemoteUid(), msgCandidate);
        log.info("发送给:{}", "/ws-resp/" + Constant.signal.SIGNAL_TYPE_CANDIDATE + "/" + msgCandidate.getRemoteUid());
    }

}
