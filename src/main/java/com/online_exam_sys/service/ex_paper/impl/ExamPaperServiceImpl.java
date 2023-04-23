package com.online_exam_sys.service.ex_paper.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.google.common.util.concurrent.AtomicDouble;
import com.online_exam_sys.dao.Ex_paperDao;
import com.online_exam_sys.dao.Ex_questionDao;
import com.online_exam_sys.pojo.Ex_paper;
import com.online_exam_sys.pojo.Ex_question;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Question;
import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.ex_paper.ExamPaperService;
import com.online_exam_sys.service.question.QuestionService;
import com.online_exam_sys.service.student.StudentService;
import com.online_exam_sys.util.Constant;

@Service
public class ExamPaperServiceImpl implements ExamPaperService {

    @Autowired
    private Ex_paperDao ex_paperDao;

    @Autowired
    private Ex_questionDao ex_questionDao;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private StudentService studentService;

    @Override
    public Ex_paper queryExamPaperByPaperId(int pa_id) {
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

    @Override
    public boolean generateExamPaperByPaper(Paper paper) {

        List<Question> qulist = questionService.queryQuestionListByPaperId(paper.getPa_id());
        List<Student> stlist = studentService.queryStudentByGrId(paper.getGr_id());
        stlist.forEach((st) -> {
            Ex_paper ep = new Ex_paper();
            ep.setSt_id(st.getSt_id());
            ep.setPa_id(paper.getPa_id());
            ep.setEp_state(Constant.exam_paper_state.ongoing);
            ep.setEp_screenoff_count(0);
            ep.setPa_order(paper.getPa_order());
            ex_paperDao.insert(ep);
            qulist.forEach((qu) -> {
                Ex_question eq = new Ex_question();
                eq.setEp_id(ep.getEp_id());
                eq.setQu_choose(qu.getQu_choose());
                eq.setQu_describe(qu.getQu_describe());
                eq.setQu_id(qu.getQu_id());
                eq.setQu_image(qu.getQu_image());
                eq.setQu_score(qu.getQu_score());
                eq.setQu_type(qu.getQu_type());
                ex_questionDao.insert(eq);
            });
            
        });

        return true;
    }

}
