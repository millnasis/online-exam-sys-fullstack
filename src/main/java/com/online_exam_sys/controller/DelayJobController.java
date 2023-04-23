package com.online_exam_sys.controller;

import java.util.Date;

import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleScheduleBuilder;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.TestDelayJob;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Api(tags = "延时任务接口")
@RequestMapping("/quartz")
@Slf4j
public class DelayJobController {
    @Autowired
    private Scheduler scheduler;

    @ApiOperation("测试延时任务")
    @PostMapping("/test")
    public Result testDelay() throws SchedulerException {
        Date start = new Date(System.currentTimeMillis() + 7 * 1000);
        JobDetail jobDetail = JobBuilder.newJob(TestDelayJob.class)
                .usingJobData("name", "zy")
                .usingJobData("age", 23)
                .withIdentity("fuck")
                .build();
        Trigger trigger = TriggerBuilder.newTrigger()
                .usingJobData("orderNo", "fuck")
                .withIdentity("fuck")
                // .startNow()
                .startAt(start)
                // .endAt(start)
                .withSchedule(SimpleScheduleBuilder
                        .simpleSchedule())
                .build();
        scheduler.scheduleJob(jobDetail, trigger);
        if (!scheduler.isShutdown()) {
            scheduler.start();
        }
        return new Result(null, "成功", Constant.code.success);
    }

}
