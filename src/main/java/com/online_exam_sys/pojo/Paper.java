package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Paper {
    @TableId
    private Long pa_id;
    private Long gr_id;
    private Date pa_founddate;
    private String pa_state;
    private Date pa_begintime;
    private int pa_duringtime;
    private String pa_order;
}
