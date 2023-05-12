package com.online_exam_sys.pojo;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.TriggerKey;
import org.springframework.beans.factory.annotation.Autowired;

import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.util.Constant;

public class EndPaperDelayJob implements Job {

    @Autowired
    private PaperService paperService;

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private ExamPaperService examPaperService;

    @Override
    public void execute(JobExecutionContext arg0) throws JobExecutionException {
        int pa_id = (int) arg0.getJobDetail().getJobDataMap().get("pa_id");
        Paper pa = paperService.queryById(pa_id);
        if (pa == null) {
            return;
        }
        pa.setPa_state(Constant.paper_state.correcting);
        paperService.update(pa);
        examPaperService.handInPaperByPaper(pa);

        try {
            scheduler.pauseTrigger(TriggerKey.triggerKey(Integer.toString(pa_id)));
            scheduler.unscheduleJob(TriggerKey.triggerKey(Integer.toString(pa_id)));
            scheduler.deleteJob(JobKey.jobKey(Integer.toString(pa_id)));
        } catch (SchedulerException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("交卷啦！！！");
    }

}
