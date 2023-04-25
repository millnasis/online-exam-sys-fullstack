package com.online_exam_sys.pojo;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Ex_question {
    @TableId
    private int eq_id;
    private int ep_id;
    private int qu_id;
    private String eq_answer;
    private Float eq_score;
    private String qu_choose;
    private String qu_describe;
    private Float qu_score;
    private String qu_answer;
    private String qu_image;
    private String qu_type;
}
