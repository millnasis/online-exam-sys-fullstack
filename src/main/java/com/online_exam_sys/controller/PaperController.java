package com.online_exam_sys.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.BoardPaperDelayJob;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Question;
import com.online_exam_sys.service.grade.GradeService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.service.question.QuestionService;
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
    private QuestionService questionService;

    @Autowired
    private GradeService gradeService;

    @Autowired
    private Scheduler scheduler;

    @ApiOperation("根据学生id查询考试")
    @GetMapping("/student/{id}")
    public Result queryByStudentId(@PathVariable int id) {
        List<Paper> data = paperService.queryPaperListByStudentId(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("根据老师id查询考试")
    @GetMapping("/teacher/{id}")
    public Result queryByTeacherId(@PathVariable int id) {
        List<Paper> data = paperService.queryPaperListByTeacherId(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);

    }

    @ApiOperation("根据id查询考试")
    @GetMapping("/{id}")
    public Result queryById(@PathVariable int id) {
        Paper data = paperService.queryById(id);
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

    @ApiOperation("修改考试")
    @PostMapping
    public Result update(@RequestBody Paper data) {
        System.out.println(data);
        Paper pa = paperService.queryById(data.getPa_id());
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        boolean update = paperService.update(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("删除考试")
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable int id) {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        List<Question> data = questionService.queryQuestionListByPaperId(id);
        List<Integer> ids = new ArrayList<>();
        data.forEach((v) -> {
            ids.add(v.getQu_id());
        });
        boolean deleteMany = questionService.deleteMany(ids);
        if (!deleteMany) {
            return new Result(null, "删除失败，请联系管理员", Constant.code.error);
        }
        boolean delete = paperService.delete(id);
        return delete ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "删除失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("发布考试")
    @PostMapping("/waiting/{id}")
    public Result waiting(@PathVariable int id) throws SchedulerException {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        Date start = pa.getPa_begintime();
        JobDetail jobDetail = JobBuilder.newJob(BoardPaperDelayJob.class)
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa.getPa_id()))
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa.getPa_id()))
                // .startAt(start)
                .startAt(start)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                .build();

        scheduler.scheduleJob(jobDetail, trigger);

        if (!scheduler.isShutdown()) {
            scheduler.start();
        }

        pa.setPa_state(Constant.paper_state.waiting);
        boolean update = paperService.update(pa);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

}
