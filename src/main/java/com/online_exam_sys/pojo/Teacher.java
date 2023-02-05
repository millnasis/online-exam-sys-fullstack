package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Teacher {
    @TableId
    private Long te_id;
    private String te_name;
    private String te_sex;
    private int te_age;
    private Date te_registerdate;
    @TableField(select = false)
    private String te_password;
    private String te_card;
}
