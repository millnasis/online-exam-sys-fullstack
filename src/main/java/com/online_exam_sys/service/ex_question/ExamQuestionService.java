package com.online_exam_sys.service.ex_question;

import java.util.List;

import com.online_exam_sys.pojo.Ex_question;

public interface ExamQuestionService {
    public List<Ex_question> queryExamQuestionListByExamPaperId(int ep_id);

    public Ex_question queryById(int eq_id);

    public boolean update(Ex_question ex_question);

}
