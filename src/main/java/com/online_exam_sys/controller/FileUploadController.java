package com.online_exam_sys.controller;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.FilenameUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.online_exam_sys.util.Constant;
import com.online_exam_sys.util.Result;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api
@RequestMapping("/upload")
public class FileUploadController {

    private String staticPathHome = "D:/javaWorkSpace/online-exam-sys-fullstack/src/main/resources/static";

    @ApiOperation("上传单个文件")
    @PostMapping("/single")
    // MultipartFile的形参名img对应input标签中的name属性
    public Result singleUpload(MultipartFile img) throws IllegalStateException, IOException {

        System.out.println(img.getName()); // 获取上传文件的表单名称
        System.out.println(img.getContentType()); // MIME类型
        System.out.println(img.getSize()); // 文件大小
        System.out.println(img.getOriginalFilename()); // 获取上传文件的真实名称

        File destFile = new File("D:/javaWorkSpace/online-exam-sys-fullstack/src/main/resources/static/img");
        if (!destFile.exists()) {
            destFile.mkdir();
        }
        // 使用uuid作为文件随机名称
        String fileName = UUID.randomUUID().toString().replaceAll("-", "");
        // 使用FileNameUtils获取上传文件名的后缀
        String extension = FilenameUtils.getExtension(img.getOriginalFilename());// jpg , png 等等
        // 创建新的文件名称
        String newFileName = fileName + "." + extension;

        // 创建要保存文件的File对象
        File file = new File(destFile, newFileName);
        // 保存文件到本地磁盘
        img.transferTo(file);
        return new Result(null, "上传成功", Constant.code.success);
    }

    @ApiOperation("上传用户头像")
    @PostMapping("/avatar")
    public Result avatar(MultipartFile avatar, HttpServletRequest req) throws IllegalStateException, IOException {
        HttpSession session = req.getSession();
        if (session.getAttribute("user_id") == null) {
            return new Result(null, "无权限", Constant.code.success);
        }
        File destFile = new File(staticPathHome + "/avatar/" + session.getAttribute("user_id"));
        if (!destFile.exists()) {
            destFile.mkdir();
        }
        String fileName = UUID.randomUUID().toString().replaceAll("-", "");
        String extension = FilenameUtils.getExtension(avatar.getOriginalFilename());
        String newFileName = fileName + "." + extension;
        File file = new File(destFile, newFileName);
        avatar.transferTo(file);
        return new Result("/avatar/" + session.getAttribute("user_id") + "/" + newFileName, "上传成功",
                Constant.code.success);

    }
}
