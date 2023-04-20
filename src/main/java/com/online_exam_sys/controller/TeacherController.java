package com.online_exam_sys.controller;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.DigestUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.online_exam_sys.pojo.Teacher;
import com.online_exam_sys.service.teacher.TeacherService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Api(tags = "老师接口")
@Slf4j
@RequestMapping("/teachers")
public class TeacherController {

    @Autowired
    private TeacherService teacherService;

    @ApiOperation("根据id查老师")
    @GetMapping("/{id}")
    public Result queryById(@PathVariable int id) {
        Teacher te = teacherService.queryOne(id);
        return te != null ? new Result(te, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("注册新老师")
    @PostMapping
    public Result register(@RequestBody Teacher data) {
        log.info(data.toString());
        Teacher te = teacherService.queryByCard(data.getTe_card());
        if (te != null) {
            return new Result(null, "工号已存在，无法重复注册", Constant.code.account_exist);
        }
        data.setTe_password(DigestUtils.md5DigestAsHex(data.getTe_password().getBytes()));
        data.setTe_registerdate(new Date(System.currentTimeMillis()));
        boolean add = teacherService.add(data);
        return add ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "注册失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("修改个人信息")
    @PutMapping
    public Result update(@RequestBody Teacher data) {
        System.out.println(data);
        Teacher te = teacherService.queryByCard(data.getTe_card());
        if (te == null) {
            return new Result(null, "用户不存在", Constant.code.not_found);
        }
        boolean update = teacherService.update(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }
}
