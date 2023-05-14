package com.online_exam_sys.pojo;

import java.util.Date;
import java.util.List;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Paper {
    @TableId
    private int pa_id;
    private int gr_id;
    private String pa_name;
    private Date pa_founddate;
    private String pa_state;
    private Date pa_begintime;
    private int pa_duringtime;
    private String pa_order;
    @TableField(exist = false)
    private List<Ex_paper> ep_list;
    @TableField(exist = false)
    private String te_name;
    @TableField(exist = false)
    private String te_card;
    @TableField(exist = false)
    private String gr_name;
}
