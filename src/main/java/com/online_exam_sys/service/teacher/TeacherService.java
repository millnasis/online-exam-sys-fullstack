package com.online_exam_sys.service.teacher;

import java.util.List;

import com.online_exam_sys.pojo.Teacher;

public interface TeacherService {
    public Teacher queryOne(int id);

    public List<Teacher> queryAll();

    public boolean delete(int id);

    public boolean add(Teacher teacher);

    public boolean update(Teacher teacher);

    public Teacher queryByCard(String card);

    public String getPwd(int id);
}
