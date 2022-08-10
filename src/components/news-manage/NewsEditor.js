import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
// convertToRaw 这个是转出的时候用的
// EditorState 这个是从普通字符串转回来用的
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'// 将页面中的draft转换html格式
import htmlToDraft from 'html-to-draftjs' // 将页面中的html转换draft看的懂的格式
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function NewsEditor (props) {
  useEffect(() => {
    console.log(props.content);
    const html = props.content
    if (html === undefined) return
    const contentBlock = htmlToDraft(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editorState = EditorState.createWithContent(contentState)
      setEditorState(editorState)
    }
  }, [props.content])

  const [editorState, setEditorState] = useState("")

  const onEditorStateChange = (value) => {
    setEditorState(value)
  }
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        localization={{
          locale: 'zh',
        }}
        onEditorStateChange={onEditorStateChange}
        onBlur={() => {
          // 失去焦点将富文本转换成html识别的内容  
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  )
}