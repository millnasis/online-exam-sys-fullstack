package com.online_exam_sys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.service.grade.GradeService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "班级接口")
@RequestMapping("/grades")
public class GradeController {
    @Autowired
    private GradeService gradeService;

    @ApiOperation("根据学生id查班级")
    @GetMapping("/student/{st_id}")
    public Result queryByStudentId(@PathVariable int st_id){
        List<Grade> grade = gradeService.queryGradeListByStudentId(st_id);
        return grade != null ? new Result(grade, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }
}
