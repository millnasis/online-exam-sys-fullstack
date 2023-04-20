package com.online_exam_sys.pojo;

import java.util.Date;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Grade_student {
    @TableId(type = IdType.AUTO)
    private int gs_id;
    private int gr_id;
    private int st_id;
    private Date gs_founddate;
}
