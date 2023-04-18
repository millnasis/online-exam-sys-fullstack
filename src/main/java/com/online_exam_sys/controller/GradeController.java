package com.online_exam_sys.controller;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
    public Result queryByStudentId(@PathVariable int st_id) {
        List<Grade> grade = gradeService.queryGradeListByStudentId(st_id);
        return grade != null ? new Result(grade, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("根据老师id查班级")
    @GetMapping("/teacher/{te_id}")
    public Result queryByTeacherId(@PathVariable int te_id) {
        List<Grade> grade = gradeService.queryGradeListByTeacherId(te_id);
        return grade != null ? new Result(grade, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("修改班级信息")
    @PutMapping
    public Result update(@RequestBody Grade data) {
        System.out.println(data);
        Grade gr = gradeService.queryGradeById(data.getGr_id());
        if (gr == null) {
            return new Result(null, "班级不存在", Constant.code.not_found);
        }
        boolean update = gradeService.update(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("创建班级")
    @PostMapping
    public Result add(@RequestBody Grade data) {
        data.setGr_founddate(new Date(System.currentTimeMillis()));
        data.setGr_lastupdate(new Date(System.currentTimeMillis()));
        boolean add = gradeService.add(data);
        return add ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "创建失败，请联系管理员", Constant.code.error);
    }
}
