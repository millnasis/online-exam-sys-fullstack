package com.online_exam_sys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "考试接口")
@RequestMapping("/papers")
public class PaperController {
    @Autowired
    private PaperService paperService;

    @ApiOperation("根据学生id查询考试")
    @GetMapping("/student/{id}")
    public Result queryByStudentId(@PathVariable int id) {
        List<Paper> data = paperService.queryPaperListByStudentId(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }
}
