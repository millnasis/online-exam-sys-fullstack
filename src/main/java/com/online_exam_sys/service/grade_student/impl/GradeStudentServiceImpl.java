package com.online_exam_sys.service.grade_student.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.dao.Grade_studentDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Grade_student;
import com.online_exam_sys.service.grade_student.GradeStudentService;

@Service
public class GradeStudentServiceImpl implements GradeStudentService {

    @Autowired
    private Grade_studentDao grade_studentDao;

    @Autowired
    private GradeDao gradeDao;

    @Override
    public boolean studentJoinGradeByGradeId(Long gr_id, Long st_id) {

        LambdaQueryWrapper<Grade> gradeLQW = new LambdaQueryWrapper<>();
        gradeLQW.eq(Grade::getGr_id, gr_id);
        Grade grade = gradeDao.selectOne(gradeLQW);
        if (grade == null) {
            return false;
        }

        LambdaQueryWrapper<Grade_student> existLQW = new LambdaQueryWrapper<>();
        existLQW.eq(Grade_student::getGr_id, gr_id);
        existLQW.eq(Grade_student::getSt_id, st_id);
        Grade_student exist = grade_studentDao.selectOne(existLQW);
        if (exist != null) {
            return false;
        }

        Grade_student grade_student = new Grade_student();
        grade_student.setSt_id(st_id);
        grade_student.setGr_id(gr_id);
        return grade_studentDao.insert(grade_student) > 0;

    }

    @Override
    public boolean studentQuitGradeByGsId(Long gs_id) {
        LambdaUpdateWrapper<Grade_student> luw = new LambdaUpdateWrapper<>();
        luw.eq(Grade_student::getGs_id, gs_id);
        return grade_studentDao.delete(luw) > 0;
    }

}
