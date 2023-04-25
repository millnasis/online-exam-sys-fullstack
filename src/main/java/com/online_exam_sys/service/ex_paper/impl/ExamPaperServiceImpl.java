package com.online_exam_sys.service.ex_paper.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    public Ex_paper queryExamPaperByPaperIdAndStudentId(int pa_id, int st_id) {
        LambdaQueryWrapper<Ex_paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_paper::getPa_id, pa_id);
        lqw.eq(Ex_paper::getSt_id, st_id);
        Ex_paper data = ex_paperDao.selectOne(lqw);

        if (data.getEp_begindate() == null) {
            data.setEp_begindate(new Date(System.currentTimeMillis()));
            ex_paperDao.updateById(data);
        }

        LambdaQueryWrapper<Ex_question> lqwQ = new LambdaQueryWrapper<>();
        lqwQ.eq(Ex_question::getEp_id, data.getEp_id());
        List<Ex_question> question = ex_questionDao.selectList(lqwQ);
        AtomicDouble score = new AtomicDouble(0D);
        question.forEach((e) -> {
            Float f = e.getQu_score();
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
                eq.setQu_answer(qu.getQu_answer());
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

    @Override
    public Ex_paper queryById(int id) {
        LambdaQueryWrapper<Ex_paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_paper::getEp_id, id);
        Ex_paper data = ex_paperDao.selectOne(lqw);
        return data;
    }

    @Override
    public boolean handInPaperByPaper(Paper paper) {
        LambdaQueryWrapper<Ex_paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_paper::getPa_id, paper.getPa_id());
        List<Ex_paper> eplist = ex_paperDao.selectList(lqw);
        eplist.forEach((ep) -> {
            if (Constant.exam_paper_state.ongoing.equals(ep.getEp_state())) {
                ep = autoCorrectPaperByPaper(ep);
                ep.setEp_finishdate(new Date(System.currentTimeMillis()));
                ex_paperDao.updateById(ep);
            }
        });
        return true;
    }

    @Override
    public List<Ex_paper> queryListByPaperId(int pa_id) {
        LambdaQueryWrapper<Ex_paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_paper::getPa_id, pa_id);
        List<Ex_paper> data = ex_paperDao.selectList(lqw);
        return data;
    }

    @Override
    public boolean updateById(Ex_paper data) {
        int ret = ex_paperDao.updateById(data);
        return ret > 0;
    }

    @Override
    public Ex_paper autoCorrectPaperByPaper(Ex_paper ex_paper) {
        List<Question> qulist = questionService.queryQuestionListByPaperId(ex_paper.getPa_id());
        LambdaQueryWrapper<Ex_question> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Ex_question::getEp_id, ex_paper.getEp_id());
        List<Ex_question> eqlist = ex_questionDao.selectList(lqw);
        Map<Integer, String> map = new HashMap<>();
        qulist.forEach((qu) -> {
            if (!Constant.question_type.subject.equals(qu.getQu_type())) {
                map.put(qu.getQu_id(), qu.getQu_answer());
            }
        });
        int[] finish = { 1 };
        eqlist.forEach((eq) -> {
            if (Constant.question_type.subject.equals(eq.getQu_type())) {
                finish[0] = 0;
            } else {
                switch (eq.getQu_type()) {
                    case Constant.question_type.choose: {
                        String answer = map.get(eq.getQu_id());
                        if (answer.equals(eq.getEq_answer())) {
                            eq.setEq_score(eq.getQu_score());
                        } else {
                            eq.setEq_score(0F);
                        }
                    }
                        break;
                    case Constant.question_type.fill: {
                        float score = 0F;
                        ObjectMapper om = new ObjectMapper();
                        String answerS = map.get(eq.getQu_id());
                        try {
                            List<String> answerArr = om.readValue(answerS, new TypeReference<List<String>>() {
                            });
                            List<String> inputArr = om.readValue(eq.getEq_answer(), new TypeReference<List<String>>() {
                            });
                            float scoreUnit = eq.getQu_score() / (float) answerArr.size();
                            for (int x = 0; x < answerArr.size(); x++) {
                                if (answerArr.get(x).equals(inputArr.get(x))) {
                                    score += scoreUnit;
                                }
                            }
                            eq.setEq_score(score);
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }
                    }
                        break;
                    default:
                        break;
                }
                ex_questionDao.updateById(eq);
            }
        });
        if (finish[0] == 1) {
            ex_paper.setEp_state(Constant.exam_paper_state.finished);
        } else {
            ex_paper.setEp_state(Constant.exam_paper_state.correcting);
        }
        return ex_paper;
    }

}
