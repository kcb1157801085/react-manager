import React from 'react'
import {Card,Button,Modal} from 'antd'
import {Editor} from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftjs from 'draftjs-to-html'
import { thisExpression } from '@babel/types'
export default class RichText extends React.Component{
    state= {
        showRichText:false,
        editorContent:'',
        editorState:''
    }
    //清空内容
    handleClearContent =()=>{
        this.setState({
            editorState:'',
        })
    }

//控制是否要弹出modal框
    handleGetText = ()=>{
        this.setState({
            showRichText:true
        })
    }
//内容的状态
    onEditorChange = (editorContent)=>{
        this.setState({
            editorContent
        })
    }
    //监听编辑器的状态  
    onEditorStateChange=(editorState)=>{
         this.setState({
             editorState,
         })
    }
    render(){
        const {editorState} = this.state
        return(
            <div>
                 <Card style={{marginTop:10}}>
                    <Button type="primary" onClick={this.handleClearContent}>清空内容</Button>
                    <Button type="primary" onClick={this.handleGetText}>获取HTML文本</Button>
                </Card>
     <Card title='富文本编辑器'>
     <Editor
     //绑定富文本编辑器的状态
             editorState={editorState}
             onContentStateChange={this.onEditorChange}
             //当富文本编辑器状态改变时触发
             onEditorStateChange={this.onEditorStateChange}
         />
     </Card>
     <Modal
      title="富文本"
      visible={this.state.showRichText}
      onCancel={()=>{
          this.setState({
              showRichText:false
          })
      }}
      /* 控制确定与取消按钮 */
      footer={null}
  >
      {/* 通过监听用户输入的内容把它转换为html */}
    {draftjs(this.state.editorContent)}
                </Modal>
            </div>
        )
    }
}