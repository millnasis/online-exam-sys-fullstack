package com.online_exam_sys;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.ResourceUtils;

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

	// @Test
	void timeTest() {
		Paper paper = paperService.queryById(6);

	}

	// @Test
	void mathTest() {
		System.out.println(10F / (float) 3);
	}

	// @Test
	void uuidTest() {
		String[] split = UUID.randomUUID().toString().split("-");

		System.out.println(split[split.length - 1]);
	}

	@Test
	void pathTest() throws FileNotFoundException {
		String path = ResourceUtils.getURL("classpath:").getPath();
		System.out.println(path);
		Pattern compile = Pattern.compile("(file:)?/?(.+)/online_exam_sys.+");
		Matcher matcher = compile.matcher(path);
		if (matcher.find()) {
			System.out.println(matcher.group(0));
		}
	}

}
