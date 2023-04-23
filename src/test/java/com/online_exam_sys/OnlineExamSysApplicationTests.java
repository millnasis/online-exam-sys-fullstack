package com.online_exam_sys;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.online_exam_sys.dao.GradeDao;
import com.online_exam_sys.dao.StudentDao;
import com.online_exam_sys.pojo.Grade;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.paper.PaperService;

@SpringBootTest
class OnlineExamSysApplicationTests {
	@Autowired
	private StudentDao studentDao;

	@Autowired
	private PaperService paperService;

	@Autowired
	private GradeDao gradeDao;

	// @Test
	void firstTest() {
		Student st = new Student();
		st.setSt_age(23);
		st.setSt_name("ddd");
		st.setSt_password("123kkk");
		st.setSt_registerdate(new Date(System.currentTimeMillis()));
		st.setSt_sex("M");
		studentDao.insert(st);
	}

	// @Test
	void apiTest() {
		List<Student> data = studentDao.queryStudentByGrId(0);
		System.out.println(data);
	}

	// @Test
	void JsonTest() throws JsonMappingException, JsonProcessingException {
		// List<String> arr = ParseJson2Array.Json2Array("[1,2,3]");
		// System.out.println(arr);
		// arr.add("4");
		// System.out.println(ParseJson2Array.Array2Json(arr));

		ObjectMapper om = new ObjectMapper();
		List<Integer> arr = om.readValue("[1,2,3]", new TypeReference<List<Integer>>() {
		});
		System.out.println(arr);
		arr.add(4);
		System.out.println(om.writeValueAsString(arr));
		;
	}

	@Test
	void timeTest() {
		Paper paper = paperService.queryById(6);

	}

}
