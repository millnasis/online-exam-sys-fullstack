package com.online_exam_sys;

import java.sql.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.dao.StudentDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Student;

@SpringBootTest
class OnlineExamSysApplicationTests {
	@Autowired
	private StudentDao studentDao;

	@Autowired
	private GradeDao gradeDao;

	@Test
	void firstTest() {
		Student st = new Student();
		st.setSt_age(23);
		st.setSt_name("ddd");
		st.setSt_password("123kkk");
		st.setSt_registerdate(new Date(System.currentTimeMillis()));
		st.setSt_sex("M");
		studentDao.insert(st);
	}

	@Test
	void query() {
		Student ret = studentDao.selectById(1620786159835168770L);
		System.out.println(ret);
	}

	@Test
	void queryGrade() {
		List<Grade> data = gradeDao.queryGradeListByStudentId(1622960532008493057L);
		System.out.println(data);
	}

}
