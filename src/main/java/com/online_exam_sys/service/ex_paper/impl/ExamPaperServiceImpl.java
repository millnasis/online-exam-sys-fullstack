package com.online_exam_sys.service.ex_paper.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.google.common.util.concurrent.AtomicDouble;
import com.online_exam_sys.dao.Ex_paperDao;
import com.online_exam_sys.dao.Ex_questionDao;
import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Ex_question;
import com.online_exam_sys.service.ex_paper.ExamPaperService;

@Service
public class ExamPaperServiceImpl implements ExamPaperService {

    @Autowired
    private Ex_paperDao ex_paperDao;

    @Autowired
    private Ex_questionDao ex_questionDao;

    @Override
    public Ex_paper queryExamPaperByPaperId(Long pa_id) {
        LambdaQueryWrapper<Ex_paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_paper::getPa_id, pa_id);
        Ex_paper data = ex_paperDao.selectOne(lqw);

        LambdaQueryWrapper<Ex_question> lqwQ = new LambdaQueryWrapper<>();
        lqwQ.eq(Ex_question::getEp_id, data.getEp_id());
        List<Ex_question> question = ex_questionDao.selectList(lqwQ);
        AtomicDouble score = new AtomicDouble(0D);
        question.forEach((e) -> {
            Float f = e.getEq_score();
            score.getAndAdd(f);
        });
        data.setEp_score(score.floatValue());
        data.setEp_question(question);
        return data;
    }

}
