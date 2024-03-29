package com.online_exam_sys.controller;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.pojo.Teacher;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.service.teacher.TeacherService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

// RESTful风格的登陆请求是/cookies 因为登陆动作是请求这个资源
@RestController
@Api
@RequestMapping("/session")
public class SessionController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private TeacherService teacherService;

    @ApiOperation("学生登陆")
    @PostMapping("/student")
    public Result studentLogin(@RequestBody Student data, HttpServletRequest req) {
        // 检验于用户是否存在
        Student st = studentService.queryByCard(data.getSt_card());
        if (st == null) {
            return new Result(null, "用户不存在", Constant.code.error);
        }
        // 比对密码
        String pwd = studentService.getPwd(st.getSt_id());
        if (!pwd.equals(DigestUtils.md5DigestAsHex(data.getSt_password().getBytes()))) {
            return new Result(null, "密码错误", Constant.code.error);
        }
        // 将用户信息存入session
        HttpSession session = req.getSession();
        session.setAttribute("user_id", st.getSt_id());
        session.setAttribute("identity", "st");
        return new Result(st, null, Constant.code.success);
    }

    @ApiOperation("老师登陆")
    @PostMapping("/teacher")
    public Result teacherLogin(@RequestBody Teacher data, HttpServletRequest req) {
        Teacher te = teacherService.queryByCard(data.getTe_card());
        if (te == null) {
            return new Result(null, "用户不存在", Constant.code.error);
        }
        String pwd = teacherService.getPwd(te.getTe_id());
        if (!pwd.equals(DigestUtils.md5DigestAsHex(data.getTe_password().getBytes()))) {
            return new Result(null, "密码错误", Constant.code.error);
        }
        HttpSession session = req.getSession();
        session.setAttribute("user_id", te.getTe_id());
        session.setAttribute("identity", "te");
        return new Result(te, null, Constant.code.success);
    }

    @ApiOperation("退出登陆")
    @DeleteMapping
    public Result logout(HttpServletRequest req, HttpServletResponse res) throws IOException {
        HttpSession session = req.getSession();
        session.removeAttribute("user_id");
        return new Result(null, null, Constant.code.success);
    }
}
