package com.online_exam_sys.pojo;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Grade {
    @TableId
    private int gr_id;
    private String gr_info;
    private String gr_name;
    private int te_id;
    private String gr_avatar;
    private Date gr_founddate;
    private Date gr_lastupdate;
    @TableField(exist = false)
    private Date gr_joindate;
}
