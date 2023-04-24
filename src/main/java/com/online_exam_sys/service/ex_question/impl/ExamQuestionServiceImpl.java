package com.online_exam_sys.service.ex_question.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.Ex_questionDao;
import com.online_exam_sys.pojo.Ex_question;
import com.online_exam_sys.service.ex_question.ExamQuestionService;

@Service
public class ExamQuestionServiceImpl implements ExamQuestionService {
    @Autowired
    private Ex_questionDao ex_questionDao;

    @Override
    public List<Ex_question> queryExamQuestionListByExamPaperId(int ep_id) {
        LambdaQueryWrapper<Ex_question> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_question::getEp_id, ep_id);
        List<Ex_question> data = ex_questionDao.selectList(lqw);
        return data;
    }

    @Override
    public Ex_question queryById(int eq_id) {
        LambdaQueryWrapper<Ex_question> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_question::getEq_id, eq_id);
        Ex_question data = ex_questionDao.selectOne(lqw);
        return data;
    }

    @Override
    public boolean update(Ex_question ex_question) {
        int ret = ex_questionDao.updateById(ex_question);
        return ret > 0;
    }

}
