package com.online_exam_sys.service.grade_student.impl;

import org.springframework.beans.factory.annotation.Autowired;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.online_exam_sys.dao.Grade_studentDao;
import com.online_exam_sys.pojo.Grade_student;
import com.online_exam_sys.service.grade_student.GradeStudentService;

public class GradeStudentServiceImpl implements GradeStudentService {

    @Autowired
    private Grade_studentDao grade_studentDao;

    @Override
    public boolean studentQuitGradeByGradeId(Long gs_id) {
        LambdaUpdateWrapper<Grade_student> luw = new LambdaUpdateWrapper<>();
        luw.eq(Grade_student::getGs_id, gs_id);
        return grade_studentDao.delete(luw) > 0;
    }
    
    @Override
    public boolean studentJoinGradeByGradeId(Long gr_id, Long st_id) {
        Grade_student grade_student = new Grade_student();
        grade_student.setSt_id(st_id);
        grade_student.setGr_id(gr_id);
        return grade_studentDao.insert(grade_student) > 0;
        
    }

}
