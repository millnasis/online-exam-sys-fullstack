package com.online_exam_sys.controller;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.service.grade.GradeService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Api(tags = "考试接口")
@RequestMapping("/papers")
@Slf4j
public class PaperController {
    @Autowired
    private PaperService paperService;

    @Autowired
    private GradeService gradeService;

    @ApiOperation("根据学生id查询考试")
    @GetMapping("/student/{id}")
    public Result queryByStudentId(@PathVariable int id) {
        List<Paper> data = paperService.queryPaperListByStudentId(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("创建考试")
    @PutMapping
    public Result add(@RequestBody Paper data) {
        log.info(data.toString());

        Grade gr = gradeService.queryGradeById(data.getGr_id());
        if (gr == null) {
            return new Result(null, "班级不存在，无法创建考试", Constant.code.not_found);
        }
        data.setPa_state(Constant.paper_state.preparing);
        data.setPa_founddate(new Date(System.currentTimeMillis()));
        data.setPa_order("[]");
        boolean add = paperService.add(data);
        return add ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }
}
