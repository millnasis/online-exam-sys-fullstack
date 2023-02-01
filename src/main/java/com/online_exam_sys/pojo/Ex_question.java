package com.online_exam_sys.pojo;

import com.baomidou.mybatisplus.annotation.TableId;

import lombok.Data;
import lombok.ToString;

@ToString
@Data
public class Ex_question {
    @TableId
    private Long eq_id;
    private Long ep_id;
    private Long qu_id;
    private String eq_answer;
    private int eq_score;
}
