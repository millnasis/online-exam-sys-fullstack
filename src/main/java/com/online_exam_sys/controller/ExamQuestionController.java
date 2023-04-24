package com.online_exam_sys.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Ex_question;
import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.ex_question.ExamQuestionService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "考题接口")
@RequestMapping("/exam-questions")
public class ExamQuestionController {
    @Autowired
    private ExamQuestionService examQuestionService;

    @Autowired
    private ExamPaperService examPaperService;

    @ApiOperation("根据考卷id查询考题")
    @GetMapping("/{ep_id}")
    public Result queryListByExamPaperId(@PathVariable int ep_id) {
        Ex_paper ep = examPaperService.queryById(ep_id);
        if (ep == null) {
            return new Result(null, "考卷不存在", Constant.code.not_found);
        }

        List<Ex_question> data = examQuestionService.queryExamQuestionListByExamPaperId(ep_id);
        return new Result(data, "成功", Constant.code.success);

    }

    @ApiOperation("答题")
    @PostMapping
    public Result update(@RequestBody Ex_question data) {
        boolean update = examQuestionService.update(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    

}
