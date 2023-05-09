package com.online_exam_sys.pojo;

import lombok.Data;

@Data
public class WangEditorUploadFormat {
    private WangEditorInnerData data;
    private Integer errno;
    private String message;
}