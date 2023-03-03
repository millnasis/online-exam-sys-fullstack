package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Grade {
    @TableId
    private Long gr_id;
    private String gr_info;
    private String gr_name;
    private Long te_id;
    private String gr_avatar;
    private Date gr_founddate;
    private Date gr_lastupdate;
    @TableField(exist = false)
    private Date gr_joindate;
}
