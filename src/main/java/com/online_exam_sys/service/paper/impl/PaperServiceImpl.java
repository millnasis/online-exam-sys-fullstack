package com.online_exam_sys.service.paper.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.dao.Grade_studentDao;
import com.online_exam_sys.dao.PaperDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Grade_student;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.util.Constant;

@Service
public class PaperServiceImpl implements PaperService {

    @Autowired
    private PaperDao paperDao;

    @Autowired
    private Grade_studentDao grade_studentDao;

    @Autowired
    private GradeDao gradeDao;

    @Override
    public List<Paper> queryPaperListByStudentId(int st_id) {
        LambdaQueryWrapper<Grade_student> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Grade_student::getSt_id, st_id);
        List<Grade_student> gslist = grade_studentDao.selectList(lqw);
        List<Paper> ret = new ArrayList<Paper>();
        gslist.forEach(gs -> {
            LambdaQueryWrapper<Grade> lqwg = new LambdaQueryWrapper<>();
            lqwg.eq(Grade::getGr_id, gs.getGr_id());
            Grade gr = gradeDao.selectOne(lqwg);
            LambdaQueryWrapper<Paper> lqwp = new LambdaQueryWrapper<>();
            lqwp.eq(Paper::getGr_id, gs.getGr_id()).and(i -> {
                i.gt(Paper::getPa_begintime, gs.getGs_founddate()).or().eq(Paper::getPa_state,
                        Constant.paper_state.preparing);
            });
            List<Paper> pa_list = paperDao.selectList(lqwp);
            pa_list.forEach(pa -> {
                pa.setGr_name(gr.getGr_name());
                ret.add(pa);
            });

        });
        return ret;
    }

    @Override
    public List<Paper> queryPaperListByGradeId(int gr_id) {
        LambdaQueryWrapper<Paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Paper::getGr_id, gr_id);
        List<Paper> data = paperDao.selectList(lqw);
        return data;
    }

    @Override
    public Paper queryById(int id) {
        LambdaQueryWrapper<Paper> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Paper::getPa_id, id);
        Paper data = paperDao.selectOne(lqw);
        return data;
    }

    @Override
    public boolean delete(int id) {
        int ret = paperDao.deleteById(id);
        return ret > 0;
    }

    @Override
    public boolean add(Paper paper) {
        int ret = paperDao.insert(paper);
        return ret > 0;
    }

    @Override
    public boolean update(Paper paper) {
        int ret = paperDao.updateById(paper);
        return ret > 0;
    }

    @Override
    public List<Paper> queryPaperListByTeacherId(int te_id) {
        return paperDao.queryPaperListByTeacherId(te_id);
    }

    @Override
    public Paper joinQueryById(int id) {
        return paperDao.joinQueryPaperByPaperId(id);
    }

}
