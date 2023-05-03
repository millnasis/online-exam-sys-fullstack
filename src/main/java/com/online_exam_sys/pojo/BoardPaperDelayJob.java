package com.online_exam_sys.pojo;

import java.util.Date;

import org.quartz.Job;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.springframework.beans.factory.annotation.Autowired;

import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.util.Constant;

public class BoardPaperDelayJob implements Job {

    @Autowired
    private PaperService paperService;

    @Autowired
    private ExamPaperService examPaperService;

    @Autowired
    private Scheduler scheduler;

    @Override
    public void execute(JobExecutionContext arg0) throws JobExecutionException {
        int pa_id = (int) arg0.getJobDetail().getJobDataMap().get("pa_id");
        Paper pa = paperService.queryById(pa_id);
        if (pa == null) {
            return;
        }
        examPaperService.generateExamPaperByPaper(pa);
        pa.setPa_state(Constant.paper_state.starting);
        paperService.update(pa);
        // 延时任务默认是重复执行，所以需要先删除原先的延迟任务
        try {
            scheduler.pauseTrigger(TriggerKey.triggerKey(Integer.toString(pa_id)));
            scheduler.unscheduleJob(TriggerKey.triggerKey(Integer.toString(pa_id)));
            scheduler.deleteJob(JobKey.jobKey(Integer.toString(pa_id)));
        } catch (SchedulerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        // 开启考试到点停止的延迟任务
        // Date start = new Date(pa.getPa_begintime().getTime() + (pa.getPa_duringtime()
        // * 1000 * 60));
        Date start = new Date(System.currentTimeMillis() + 1000 * 60 * 30);
        JobDetail jobDetail = JobBuilder.newJob(EndPaperDelayJob.class)
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa_id))
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .usingJobData("pa_id", pa.getPa_id())
                .withIdentity(Integer.toString(pa_id))
                .startAt(start)
                .withSchedule(SimpleScheduleBuilder.simpleSchedule())
                .build();
        try {
            scheduler.scheduleJob(jobDetail, trigger);
            if (!scheduler.isShutdown()) {
                scheduler.start();
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        System.out.println("考试开始啦！！！");
    }

}
