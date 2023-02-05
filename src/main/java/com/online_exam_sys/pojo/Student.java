package com.online_exam_sys.pojo;

import java.sql.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class Student {
    @TableId
    private Long st_id;
    private String st_name;
    private String st_sex;
    private int st_age;
    private Date st_registerdate;
    @TableField(select = false)
    private String st_password;
    private String st_card;
}
