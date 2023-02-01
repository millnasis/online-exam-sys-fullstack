package com.online_exam_sys.pojo;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;

import lombok.ToString;

@Data
@ToString

public class Question {
    @TableId
    private Long qu_id;
    private Long pa_id;
    private String qu_type;
    private String qu_answer;
}
