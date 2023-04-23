package com.online_exam_sys.pojo;

import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Ex_paper {
    @TableId
    private int ep_id;
    private int st_id;
    private int pa_id;
    private Date ep_begindate;
    private Date ep_finishdate;
    private String ep_state;
    private int ep_screenoff_count;
    @TableField(exist = false)
    private Float ep_score;
    @TableField(exist = false)
    private List<Ex_question> ep_question;
    private String pa_order;
}
