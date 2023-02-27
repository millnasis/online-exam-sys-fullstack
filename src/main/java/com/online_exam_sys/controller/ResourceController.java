package com.online_exam_sys.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ResourceController {
    @RequestMapping("/login")
    public String login() {
        return "login.html";
    }

    @RequestMapping("/register")
    public String register() {
        return "register.html";
    }

    @RequestMapping("/success")
    public String success() {
        return "success.html";
    }

    @RequestMapping("/student")
    public String student() {
        return "student.html";
    }

}
