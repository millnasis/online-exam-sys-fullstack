package com.online_exam_sys.controller;

import java.util.Date;
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
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.pojo.Teacher;
import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.ex_question.ExamQuestionService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.service.teacher.TeacherService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Api(tags = "考卷接口")
@RequestMapping("/exam-papers")
@Slf4j
public class ExamPaperController {
    @Autowired
    private ExamPaperService examPaperService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private PaperService paperService;

    @Autowired
    private ExamQuestionService examQuestionService;

    @ApiOperation("根据试卷id和学生id获取考卷与考题")
    @GetMapping
    public Result queryByPaperIdAndStudentId(Integer pa_id, Integer st_id) {
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
        data.setPa_order(pa.getPa_order());
        data.setGr_id(pa.getGr_id());
        data.setPa_name(pa.getPa_name());
        data.setPa_founddate(pa.getPa_founddate());
        data.setPa_state(pa.getPa_state());
        data.setPa_begintime(pa.getPa_begintime());
        data.setPa_duringtime(pa.getPa_duringtime());
        return new Result(data, "成功", Constant.code.success);
    }

    @ApiOperation("切屏计数")
    @PostMapping("/screenoff/{id}")
    public Result screenOffCount(@PathVariable int id) {
        Ex_paper data = examPaperService.queryById(id);
        if (data == null) {
            return new Result(null, "考卷不存在", Constant.code.not_found);
        }
        data.setEp_screenoff_count(data.getEp_screenoff_count() + 1);
        boolean update = examPaperService.updateById(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("学生主动交卷")
    @PostMapping("/handin")
    public Result handInPaperByStudent(@RequestBody Ex_paper data) {
        System.out.println(data);
        data = examPaperService.autoCorrectPaperByPaper(data);
        data.setEp_finishdate(new Date(System.currentTimeMillis()));
        boolean update = examPaperService.updateById(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("判定试卷作弊")
    @PostMapping("/cheat")
    public Result cheat(@RequestBody Ex_paper data) {
        System.out.println(data);
        data.setEp_state(Constant.exam_paper_state.cheating);
        if (data.getEp_finishdate() == null) {
            data.setEp_finishdate(new Date(System.currentTimeMillis()));
        }
        boolean update = examPaperService.updateById(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }
}
