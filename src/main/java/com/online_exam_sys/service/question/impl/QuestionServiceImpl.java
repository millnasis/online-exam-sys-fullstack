package com.online_exam_sys.service.question.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.QuestionDao;
import com.online_exam_sys.pojo.Question;
import com.online_exam_sys.service.question.QuestionService;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionDao questionDao;

    @Override
    public Question queryById(int id) {
        LambdaQueryWrapper<Question> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Question::getQu_id, id);
        Question data = questionDao.selectOne(lqw);
        return data;

    }

    @Override
    public boolean delete(int id) {
        int ret = questionDao.deleteById(id);
        return ret > 0;
    }

    @Override
    public boolean add(Question question) {
        int ret = questionDao.insert(question);
        return ret > 0;
    }

    @Override
    public boolean update(Question question) {
        int ret = questionDao.updateById(question);
        return ret > 0;
    }

    @Override
    public List<Question> queryQuestionListByPaperId(int pa_id) {
        LambdaQueryWrapper<Question> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Question::getPa_id, pa_id);
        List<Question> data = questionDao.selectList(lqw);
        return data;
    }

}
