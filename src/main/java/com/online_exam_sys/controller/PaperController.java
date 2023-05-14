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
import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Question;
import com.online_exam_sys.pojo.Teacher;
import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.grade.GradeService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.service.question.QuestionService;
import com.online_exam_sys.service.teacher.TeacherService;
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

    @Autowired
    private ExamPaperService examPaperService;


    @ApiOperation("根据id查询考试及其详细信息")
    @GetMapping("/join/{id}")
    public Result joinQueryPaperById(@PathVariable int id) {
        Paper pa = paperService.joinQueryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        return new Result(pa, "成功", Constant.code.success);
    }

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
        data.forEach(pa -> {
            if (Constant.paper_state.correcting.equals(pa.getPa_state())) {
                List<Ex_paper> eplist = examPaperService.queryListByPaperId(pa.getPa_id());
                pa.setEp_list(eplist);
            }
        });

        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("根据id查询考试以及附属考卷")
    @GetMapping("/ep/{pa_id}")
    public Result queryPaperAndEpListById(@PathVariable int pa_id) {
        Paper data = paperService.queryById(pa_id);
        List<Ex_paper> eplist = examPaperService.queryExamPaperListByPaperId(pa_id);
        data.setEp_list(eplist);
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
        if (ids.size() > 0) {
            boolean deleteMany = questionService.deleteMany(ids);
            if (!deleteMany) {
                return new Result(null, "删除失败，请联系管理员", Constant.code.error);
            }
        }
        boolean delete = paperService.delete(id);
        return delete ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "删除失败，请联系管理员", Constant.code.error);
    }

    // 发布考试相关接口，考试发布后开始时间就不可修改，想修改只能删除该考试
    @ApiOperation("发布考试")
    @PostMapping("/waiting/{id}")
    public Result waiting(@PathVariable int id) throws SchedulerException {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        Date start = pa.getPa_begintime();
        // Date start = new Date(System.currentTimeMillis() + 30 * 1000);
        // 设置延时任务任务的标识
        JobDetail jobDetail = JobBuilder.newJob(BoardPaperDelayJob.class)
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa.getPa_id()))
                .build();
        // 延时任务的触发器，里面设置了开始时间
        Trigger trigger = TriggerBuilder.newTrigger()
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa.getPa_id()))
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

    @ApiOperation("获取考试信息")
    @GetMapping("/exam/{id}")
    public Result queryTeacherExamPaperByPaperId(@PathVariable int id) {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        List<Ex_paper> eplist = examPaperService.queryExamPaperListByPaperId(pa.getPa_id());
        pa.setEp_list(eplist);
        return new Result(pa, "成功", Constant.code.success);

    }

    @ApiOperation("立刻开启考试（仅管理员）")
    @GetMapping("/exam/admin/start/{id}")
    public Result startExamNow(@PathVariable int id) {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        examPaperService.generateExamPaperByPaper(pa);
        pa.setPa_state(Constant.paper_state.starting);
        paperService.update(pa);
        System.out.println("考试开始啦！！！");
        return new Result(pa, "成功", Constant.code.success);
    }

    @ApiOperation("立刻结束考试（仅管理员）")
    @GetMapping("/exam/admin/end/{id}")
    public Result endExamNow(@PathVariable int id) {
        Paper pa = paperService.queryById(id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        pa.setPa_state(Constant.paper_state.correcting);
        paperService.update(pa);
        examPaperService.handInPaperByPaper(pa);
        System.out.println("交卷啦！！！");
        return new Result(pa, "成功", Constant.code.success);
    }

    @ApiOperation("结束考试的批改")
    @PostMapping("/finish/{pa_id}")
    public Result finishExamCorrect(@PathVariable int pa_id) {
        Paper pa = paperService.queryById(pa_id);
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        pa.setPa_state(Constant.paper_state.end);
        paperService.update(pa);
        return new Result(pa, "成功", Constant.code.success);
    }
}
