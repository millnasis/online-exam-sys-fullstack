package com.online_exam_sys.pojo;

import java.sql.Date;

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
    private Date gr_founddate;
}
