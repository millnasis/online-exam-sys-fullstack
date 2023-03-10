package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Grade_student {
    @TableId(type = IdType.AUTO)
    private int gs_id;
    private Long gr_id;
    private Long st_id;
    private Date gs_founddate;
}
