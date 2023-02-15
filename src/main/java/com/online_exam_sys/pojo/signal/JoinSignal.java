package com.online_exam_sys.pojo.signal;

import lombok.Data;

@Data
public class JoinSignal {
    private String cmd ;
    private int roomId;
    private String uid;
}
