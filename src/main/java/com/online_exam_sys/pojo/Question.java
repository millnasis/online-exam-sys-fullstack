package com.online_exam_sys.pojo;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;

import lombok.ToString;

@Data
@ToString

public class Question {
    @TableId
    private int qu_id;
    private int pa_id;
    private String qu_type;
    private String qu_answer;
    private String qu_describe;
    private int qu_score;
    private String qu_image;
}
