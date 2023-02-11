package com.online_exam_sys.controller;

import java.sql.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "学生接口")
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;

    @ApiOperation("根据id查询学生")
    @GetMapping("/{id}")
    public Result queryById(@PathVariable int id) {
        // DigestUtils.md5DigestAsHex("1234".getBytes());
        Student st = studentService.queryOne(id);
        return st != null ? new Result(st, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("注册新学生")
    @PostMapping
    public Result register(@RequestBody Student data) {
        Student st = studentService.queryByCard(data.getSt_card());
        if (st != null) {
            return new Result(null, "学号已存在，无法重复注册", Constant.code.account_exist);
        }
        data.setSt_password(DigestUtils.md5DigestAsHex(data.getSt_password().getBytes()));
        data.setSt_registerdate(new Date(System.currentTimeMillis()));
        boolean add = studentService.add(data);
        return add ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "注册失败，请联系管理员", Constant.code.error);
    }

}
