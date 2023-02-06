package com.online_exam_sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

@RestController
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @GetMapping("/{id}")
    public Result queryById(@PathVariable int id) {
        // DigestUtils.md5DigestAsHex("1234".getBytes());
        Student st = studentService.queryOne(id);
        return st != null ? new Result(st, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    // RESTful风格的登陆请求是/cookies 因为登陆动作是请求这个资源

    

}
