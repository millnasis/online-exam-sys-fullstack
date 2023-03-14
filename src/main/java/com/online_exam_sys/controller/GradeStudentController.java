package com.online_exam_sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.online_exam_sys.pojo.Student;
import com.online_exam_sys.service.grade_student.GradeStudentService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api(tags = "学生-班级接口")
@RequestMapping("/grade-student")
public class GradeStudentController {
    @Autowired
    private GradeStudentService gradeStudentService;

    @ApiOperation("学生加入班级")
    @PostMapping("/grade/{gr_id}")
    public Result studentJoinGradeByGrId(@PathVariable int gr_id, @RequestBody Student student) {
        boolean ret = gradeStudentService.studentJoinGradeByGradeId(gr_id, student.getSt_id());
        return ret ? new Result(ret, "成功", Constant.code.success)
                : new Result(null, "加入失败，请检查班级是否存在，或者您已在班级中", Constant.code.error);
    }

    @ApiOperation("学生退出班级")
    @DeleteMapping("/{gs_id}")
    public Result studentQuitGradeByGsId(@PathVariable int gs_id) {
        boolean ret = gradeStudentService.studentQuitGradeByGsId(gs_id);
        return ret ? new Result(ret, "成功", Constant.code.success)
                : new Result(null, "加入失败，请检查班级是否存在", Constant.code.error);
    }

}
