package com.online_exam_sys.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.online_exam_sys.pojo.Paper;
import com.online_exam_sys.pojo.Question;
import com.online_exam_sys.service.paper.PaperService;
import com.online_exam_sys.service.question.QuestionService;
import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@Api(tags = "题目接口")
@RequestMapping("/questions")
@Slf4j
public class QuestionController {
    @Autowired
    private QuestionService questionService;

    @Autowired
    private PaperService paperService;

    @ApiOperation("根据id查询")
    @GetMapping("/{id}")
    public Result queryById(@PathVariable int id) {
        Question data = questionService.queryById(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("根据考试id查询")
    @GetMapping("/paper/{id}")
    public Result queryQuestionByPaperId(@PathVariable int id) {
        List<Question> data = questionService.queryQuestionListByPaperId(id);
        return data != null ? new Result(data, "成功", Constant.code.success)
                : new Result(null, "未找到", Constant.code.not_found);
    }

    @ApiOperation("修改题目")
    @PostMapping
    public Result update(@RequestBody Question data) {
        System.out.println(data);
        Question qu = questionService.queryById(data.getQu_id());
        if (qu == null) {
            return new Result(null, "题目不存在", Constant.code.not_found);
        }
        boolean update = questionService.update(data);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("新增题目")
    @PutMapping
    public Result add(@RequestBody Question data) throws JsonMappingException, JsonProcessingException {
        System.out.println(data);
        Paper pa = paperService.queryById(data.getPa_id());
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        Question qu = new Question();
        qu.setPa_id(data.getPa_id());
        qu.setQu_answer("[]");
        qu.setQu_image("[]");
        qu.setQu_describe("输入题目描述");
        qu.setQu_score(0F);
        qu.setQu_type(data.getQu_type());
        qu.setQu_choose("[]");
        boolean add = questionService.add(qu);
        if (!add) {
            return new Result(null, "添加失败，请联系管理员", Constant.code.error);
        }
        ObjectMapper om = new ObjectMapper();
        List<Integer> order = om.readValue(pa.getPa_order(), new TypeReference<List<Integer>>() {
        });
        order.add(qu.getQu_id());
        pa.setPa_order(om.writeValueAsString(order));
        boolean update = paperService.update(pa);
        return update ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "更新失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("根据id删除题目")
    @DeleteMapping("/{id}")
    public Result delete(@PathVariable int id) throws JsonMappingException, JsonProcessingException {
        Question qu = questionService.queryById(id);
        if (qu == null) {
            return new Result(null, "题目不存在", Constant.code.not_found);
        }
        Paper pa = paperService.queryById(qu.getPa_id());
        if (pa == null) {
            return new Result(null, "考试不存在", Constant.code.not_found);
        }
        ObjectMapper om = new ObjectMapper();
        List<Integer> order = om.readValue(pa.getPa_order(), new TypeReference<List<Integer>>() {
        });
        order.remove(order.indexOf(qu.getQu_id()));
        pa.setPa_order(om.writeValueAsString(order));
        boolean update = paperService.update(pa);
        if (!update) {
            return new Result(null, "删除失败，请联系管理员", Constant.code.error);
        }
        boolean delete = questionService.delete(id);
        return delete ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "删除失败，请联系管理员", Constant.code.error);
    }

    @ApiOperation("批量删除题目")
    @DeleteMapping("/paper/{id}")
    public Result deleteMany(@PathVariable int id) {
        List<Question> data = questionService.queryQuestionListByPaperId(id);
        List<Integer> ids = new ArrayList<>();
        data.forEach((v) -> {
            ids.add(v.getQu_id());
        });
        boolean deleteMany = questionService.deleteMany(ids);
        return deleteMany ? new Result(null, "成功", Constant.code.success)
                : new Result(null, "删除失败，请联系管理员", Constant.code.error);
    }

}
