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
    // 用于转发消息的对象
    private SimpMessagingTemplate template;

    public MsgController(SimpMessagingTemplate simpMessagingTemplate) {
        this.template = simpMessagingTemplate;
    }

    // 为教师和学生分别建立两个空间
    private static final Map<String, Set<String>> TEACHER_ROOM_TABLE_MAP = new ConcurrentHashMap<>();
    private static final Map<String, Set<String>> STUDENT_ROOM_TABLE_MAP = new ConcurrentHashMap<>();

    private static final Map<String, String> TEACHER_USER_ROOM_MAP = new ConcurrentHashMap<>();
    private static final Map<String, String> STUDENT_USER_ROOM_MAP = new ConcurrentHashMap<>();

    public static Map<String, Set<String>> getStudentRoomTableMap() {
        return STUDENT_ROOM_TABLE_MAP;
    }

    public static Map<String, String> getStudentUserRoomMap() {
        return STUDENT_USER_ROOM_MAP;
    }

    public static Map<String, Set<String>> getTeacherRoomTableMap() {
        return TEACHER_ROOM_TABLE_MAP;
    }

    public static Map<String, String> getTeacherUserRoomMap() {
        return TEACHER_USER_ROOM_MAP;
    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_JOIN + "/{roomid}")
    public void join(JoinSignal msgJoin, @DestinationVariable String roomid) {
        log.info("join " + roomid + " 操作，消息：{}", msgJoin);
        // 查询房间，若没有就建立
        Set<String> TroomSet = TEACHER_ROOM_TABLE_MAP.get(roomid);
        if (TroomSet == null) {
            TroomSet = new ConcurrentSkipListSet<String>();
            TEACHER_ROOM_TABLE_MAP.put(roomid, TroomSet);
        }
        Set<String> SroomSet = STUDENT_ROOM_TABLE_MAP.get(roomid);
        if (SroomSet == null) {
            SroomSet = new ConcurrentSkipListSet<String>();
            STUDENT_ROOM_TABLE_MAP.put(roomid, SroomSet);
        }

        if ("teacher".equals(msgJoin.getIdentity())) {
            // 教师身份逻辑

            // 教师加入房间
            TroomSet.add(msgJoin.getUid());
            TEACHER_USER_ROOM_MAP.put(msgJoin.getUid(), roomid);
            // 如果有学生在房间内，则向其发送New-peer信令
            if (SroomSet.size() > 0) {
                SroomSet.forEach((uid) -> {
                    NewPeerSignal nps = new NewPeerSignal();
                    nps.setRemoteUid(msgJoin.getUid());
                    this.template.convertAndSend("/ws-resp/" + Constant.signal.SIGNAL_TYPE_NEW_PEER + "/" + uid, nps);
                });
                // 并给教师本身返回Resp-join信令
                RespJoinSignal rjs = new RespJoinSignal();
                rjs.setStudentIdList(SroomSet.toArray());
                this.template.convertAndSend(
                        "/ws-resp/" + Constant.signal.SIGNAL_TYPE_RESP_JOIN + "/" + msgJoin.getUid(), rjs);
            }
        } else {
            // 学生身份逻辑，不发送New-peer给教师，而是在Resp-join信令中带回教师名单，再从前端逐一发送Offer
            SroomSet.add(msgJoin.getUid());
            STUDENT_USER_ROOM_MAP.put(msgJoin.getUid(), roomid);
            if (TroomSet.size() > 0) {
                RespJoinSignal rjs = new RespJoinSignal();
                rjs.setTeacherIdList(TroomSet.toArray());
                this.template.convertAndSend(
                        "/ws-resp/" + Constant.signal.SIGNAL_TYPE_RESP_JOIN + "/" + msgJoin.getUid(), rjs);
            }
        }
        log.info("{}\n{}\n{}\n{}", TEACHER_ROOM_TABLE_MAP, TEACHER_USER_ROOM_MAP, STUDENT_ROOM_TABLE_MAP,
                STUDENT_USER_ROOM_MAP);

    }

    @MessageMapping("/" + Constant.signal.SIGNAL_TYPE_LEAVE + "/{roomid}")
    public void leave(LeaveSignal msgLeave, @DestinationVariable String roomid) {
        log.info("leave " + roomid + " 操作，消息：{}", msgLeave);

        Set<String> roomSet;
        Set<String> aroomSet;
        Map<String, String> roomMap;
        if ("teacher".equals(msgLeave.getIdentity())) {
            roomSet = TEACHER_ROOM_TABLE_MAP.get(roomid);
            aroomSet = STUDENT_ROOM_TABLE_MAP.get(roomid);
            roomMap = TEACHER_USER_ROOM_MAP;
        } else {
            aroomSet = TEACHER_ROOM_TABLE_MAP.get(roomid);
            roomSet = STUDENT_ROOM_TABLE_MAP.get(roomid);
            roomMap = STUDENT_USER_ROOM_MAP;

        }
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
            return;
        }

        roomSet.remove(msgLeave.getUid());
        roomMap.remove(msgLeave.getUid());
        log.info("当前房间{}人数:{}", roomid, roomSet.size());
        if (aroomSet.size() > 0) {
            aroomSet.forEach((uid) -> {
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
        Set<String> roomSet = TEACHER_ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
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
        Set<String> roomSet = STUDENT_ROOM_TABLE_MAP.get(roomid);
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
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
        Set<String> roomSet;
        if ("teacher".equals(msgCandidate.getIdentity())) {
            roomSet = STUDENT_ROOM_TABLE_MAP.get(roomid);
        } else {
            roomSet = TEACHER_ROOM_TABLE_MAP.get(roomid);

        }
        if (roomSet == null) {
            log.error("无法找到房间{}", roomid);
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
