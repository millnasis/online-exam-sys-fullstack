package com.online_exam_sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "考卷接口")
@RequestMapping("/exam-papers")
public class ExamPaperController {
    @Autowired
    private ExamPaperService examPaperService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private PaperService paperService;

    @ApiOperation("根据试卷id和学生id获取考卷与考题")
    @GetMapping
    public Result queryByPaperIdAndStudentId(int pa_id, int st_id) {
        Student st = studentService.queryOne(st_id);
        if (st == null) {
            return new Result(null, "学生不存在", Constant.code.not_found);
        }
        Paper pa = paperService.queryById(pa_id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        Ex_paper data = examPaperService.queryExamPaperByPaperIdAndStudentId(pa_id, st_id);
        if (data == null) {
            return new Result(null, "试卷尚未生成，请重试", Constant.code.not_found);
        }
        return new Result(data, "成功", Constant.code.success);

    }
}
