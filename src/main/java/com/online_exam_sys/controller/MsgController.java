package com.online_exam_sys.controller;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import com.online_exam_sys.pojo.Hello;
import com.online_exam_sys.pojo.HelloMessage;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(tags = "socket")
@RestController
public class MsgController {

    @MessageMapping("/hello")
    @SendTo("/topic/greet")
    public Hello hello(HelloMessage msg) throws InterruptedException {
        Hello h = new Hello();
        h.setContent("HELLO ！！！" + HtmlUtils.htmlEscape(msg.getName()));
        h.setDate(LocalDateTime.now().toString());
        return h;
    }
}
