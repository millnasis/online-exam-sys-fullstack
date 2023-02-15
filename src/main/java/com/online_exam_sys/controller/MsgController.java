package com.online_exam_sys.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.online_exam_sys.pojo.Hello;
import com.online_exam_sys.pojo.HelloMessage;
import com.online_exam_sys.pojo.signal.JoinSignal;

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

    private static final Map<Integer, Set> ROOM_TABLE_MAP = new ConcurrentHashMap<>();

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;


    @MessageMapping("/hello")
    // @SendTo("/topic/greet")
    public void hello(HelloMessage msg) throws InterruptedException {
        Hello h = new Hello();
        h.setContent("HELLO ！！！" + HtmlUtils.htmlEscape(msg.getName()));
        h.setDate(LocalDateTime.now().toString());
        simpMessagingTemplate.convertAndSend("/ws-resp/greet", h);
        // return h;
    }

    // @MessageMapping("/join")
    // // @SendTo("/ws-resp/")
    // public void join(JoinSignal msgJoin) {
    //     log.info("join操作，消息：{}", msgJoin);
    //     Set roomSet = ROOM_TABLE_MAP.get(msgJoin.getRoomId());
    //     if (roomSet == null) {
    //         roomSet = new ConcurrentSkipListSet<>();
    //         ROOM_TABLE_MAP.put(msgJoin.getRoomId(), roomSet);
    //     }

    //     roomSet.add(msgJoin.getUid());
    //     if (roomSet.size() > 1) {
    //         roomSet.forEach((uid) -> {
    //             simpMessagingTemplate.conv
    //         });
    //     }

    // }
}
