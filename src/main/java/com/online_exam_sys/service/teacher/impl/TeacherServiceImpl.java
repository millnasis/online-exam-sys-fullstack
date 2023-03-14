package com.online_exam_sys.service.teacher.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.TeacherDao;
import com.online_exam_sys.pojo.Teacher;
import com.online_exam_sys.service.teacher.TeacherService;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherDao teacherDao;

    @Override
    public Teacher queryOne(int id) {
        Teacher data = teacherDao.selectById(id);
        return data;
    }

    @Override
    public List<Teacher> queryAll() {
        List<Teacher> data = teacherDao.selectList(null);
        return data;
    }

    @Override
    public boolean delete(int id) {
        int ret = teacherDao.deleteById(id);
        return ret > 0;
    }

    @Override
    public boolean add(Teacher teacher) {
        int ret = teacherDao.insert(teacher);
        return ret > 0;
    }

    @Override
    public boolean update(Teacher teacher) {
        int ret = teacherDao.update(teacher, null);
        return ret > 0;
    }

    @Override
    public Teacher queryByCard(String card) {
        LambdaQueryWrapper<Teacher> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Teacher::getTe_card, card);
        Teacher data = teacherDao.selectOne(lqw);
        return data;
    }

    @Override
    public String getPwd(int id) {
        
        return teacherDao.getPwd(id);
    }

}
