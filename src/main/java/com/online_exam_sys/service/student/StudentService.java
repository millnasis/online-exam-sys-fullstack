package com.online_exam_sys.service.student;

import java.util.List;

import com.online_exam_sys.pojo.Student;

public interface StudentService {
    public Student queryOne(int id);

    public List<Student> queryAll();

    public boolean delete(int id);

    public boolean add(Student student);

    public boolean update(Student student);

    public Student queryByCard(String card);
}
