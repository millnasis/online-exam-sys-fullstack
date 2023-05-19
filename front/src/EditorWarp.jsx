import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { Progress } from "antd";

function EditorWarp(props) {
  const { quid, value, onChange } = props;
  // editor 实例
  const [editor, setEditor] = useState(null); 
  const [progress, setProgress] = useState(-1);

  // 工具栏配置
  const toolbarConfig = {};

  // 编辑器配置
  const editorConfig = {
    placeholder: "请输入内容...",
    MENU_CONF: {},
  };
  // 配置图片上传服务器
  editorConfig.MENU_CONF["uploadImage"] = {
    server: `/upload/questions/subject/${quid}`,
    fieldName: "img",
    maxNumberOfFiles: 1,
    onProgress(progress) {
      setProgress(progress);
    },
    customInsert(res, insertFn) {
      setTimeout(() => {
        insertFn(res.data.url, res.data.alt, res.data.href);
      }, 1000);
    },
  };
  editorConfig.MENU_CONF["uploadVideo"] = {
    server: `/upload/questions/subject/${quid}`,
    fieldName: "video",
    maxNumberOfFiles: 1,
    maxFileSize: 512 * 1024 * 1024,
    onProgress(progress) {
      setProgress(progress);
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        {progress !== -1 && <Progress percent={progress}></Progress>}
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={(editor) => {
            onChange(editor.getHtml());
          }}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
    </>
  );
}

export default EditorWarp;
