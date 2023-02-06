package com.online_exam_sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

@RestController
@RequestMapping("/session")
public class SessionController {
    @Autowired
    private StudentService studentService;

    @PostMapping("/student")
    public Result studentLogin(@RequestBody Student data) {
        Student st = studentService.queryByCard(data.getSt_card());
        if (st == null) {
            return new Result(null, "用户不存在", Constant.code.error);
        }
        if (!st.getSt_password().equals(data.getSt_password())) {
            return new Result(null, "密码错误", Constant.code.error);
        }
        return new Result("good", null, Constant.code.success);
    }
}
