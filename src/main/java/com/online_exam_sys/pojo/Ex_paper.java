package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Ex_paper {
    @TableId
    private Long ep_id;
    private Long st_id;
    private Long pa_id;
    private Date ep_begindate;
    private Date ep_finishdate;
    private String ep_state;
    private int ep_screenoff_count;
}
