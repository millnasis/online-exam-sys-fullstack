package com.online_exam_sys.service.question;

import java.util.List;

import com.online_exam_sys.pojo.Question;

public interface QuestionService {
    public List<Question> queryQuestionListByPaperId(int pa_id);

    public Question queryById(int id);

    public boolean delete(int id);

    public boolean add(Question question);

    public boolean update(Question question);
}
