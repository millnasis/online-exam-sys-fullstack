package com.online_exam_sys.service.student.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.online_exam_sys.dao.StudentDao;
import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.student.StudentService;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentDao studentDao;

    @Override
    public Student queryOne(int id) {
        Student data = studentDao.selectById(id);
        return data;
    }

    @Override
    public List<Student> queryAll() {
        List<Student> data = studentDao.selectList(null);
        return data;
    }

    @Override
    public boolean delete(int id) {
        int ret = studentDao.deleteById(id);
        return ret > 0;
    }

    @Override
    public boolean add(Student student) {
        int ret = studentDao.insert(student);
        return ret > 0;
    }

    @Override
    public boolean update(Student student) {
        int ret = studentDao.updateById(student);
        return ret > 0;
    }

    @Override
    public Student queryByCard(String card) {
        LambdaQueryWrapper<Student> lqw = new LambdaQueryWrapper<>();
        lqw.eq(Student::getSt_card, card);
        Student data = studentDao.selectOne(lqw);
        return data;
    }

    @Override
    public String getPwd(int id) {
        return studentDao.getPwd(id);
    }

}
