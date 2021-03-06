import React from 'react'
import { Card, Button, Table, Form, Input, Checkbox,Select,Radio, Icon, message, Modal, DatePicker } from 'antd'
import axios from './../../axios'
import Utils from './../../utils/utils'
import BaseForm from './../../components/BaseForm'
import ETable from './../../components/ETable'
import Moment from 'moment'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
//const TextArea = Input.TextArea;

export default class User extends React.Component{
    state = {
        list:[],
        isVisible :false
    }

    params = {
        page:1
    }
    formList = [
        {
            type:'INPUT',
            label:'用户名',
            field:'user_name',
            placeholder:'请输入用户名称',
            width:100,        
        },
        {
            type:'INPUT',
            label:'手机号',
            field:'user_mobile',
            placeholder:'请输入手机号',
            width:80,        
        },
        {
            type:'DATE', 
            label:'入职日期',
            field:'user_date',
            placeholder:'请选择入职日期',
            width:80, 
        }

    ]
    componentDidMount(){
        this.requestList()
    }

    handleFilter = (params)=>{
        this.params = params;
        this.requestList()
    }

    requestList = ()=>{
       axios.requestList(this,'/user/list',this.params)
    }


    handleOperator= (type)=>{
        let item = this.state.selectedItem
     if(type=='create'){
         this.setState({
             type,
             isVisible:true,
             title:'创建员工'
         })
     }else if (type=='edit' || type== 'detail'){
        if(!item){
           Modal.info({
            title: '信息',
            content: '请选择一个用户'
           }) 
           return;
        }
        this.setState({
            title:type=='edit'?'编辑用户':'查看详情',
            isVisible:true,
            userInfo:item,
            type
        })
     }else if(type=='delete'){
        if(!item){
            Modal.info({
                title: '信息',
                content: '请选择一个用户'
            })
            return;
        } 
        Utils.ui.confirm({
            text:'确定要删除此用户吗？',
            onOk:()=>{
                axios.ajax({
                    url:'/user/delete',
                    data:{
                        params:{
                            id:item.id
                        }
                    }
                }).then((res)=>{
                    if(res.code ==0){
                        this.setState({
                            isVisible:false
                        })
                        this.requestList();
                    }
                })  
            }
        })
     }
    }
//创建员工提交
    handleSubmit = ()=>{
    let type = this.state.type;
   // getFieldsValue	获取一组输入控件的值，如不传入参数，则获取全部组件的值
    let data = this.userForm.props.form.getFieldsValue();
    axios.ajax({
        url:type == 'create'?'/user/add':'/user/edit',
        data:{
            params:{
                ...data
            }    
        }
    }).then((res)=>{
       if(res.code==0){
           this.setState({
               isVisible:false
           })
           this.requestList(); 
       }
    })
    }



    render(){
    
        const columns = [{
            title: 'id',
            dataIndex: 'id'
          }, {
            title: '用户名',
            dataIndex: 'username'
          }, {
            title: '性别',
            dataIndex: 'sex',
            render(sex){
                return sex ==1 ?'男':'女'
            }
          }, {
            title: '状态',
            dataIndex: 'state',
            render(state){
                let config = {
                    '1':'咸鱼一条',
                    '2':'风华浪子',
                    '3':'北大才子一枚',
                    '4':'百度FE',
                    '5':'创业者'
                }
                return config[state];
            }
          },{
            title: '爱好',
            dataIndex: 'interest',
            render(interest){
                let config = {
                    '1':'游泳',
                    '2':'打篮球',
                    '3':'踢足球',
                    '4':'跑步',
                    '5':'爬山',
                    '6':'骑行',
                    '7':'桌球',
                    '8':'麦霸'
                }
                return config[interest];
            }
          },{
            title: '婚姻状况',
            dataIndex: 'isMarried',
            render(isMarried){
                return isMarried?'已婚':'未婚'
            }
          },{
            title: '生日',
            dataIndex: 'birthday'
          },{
            title: '联系地址',
            dataIndex: 'address'
          },{
            title: '早起时间',
            dataIndex: 'time'
          }
        ];
  
        return (
            <div>
         <Card>
<BaseForm formList= {this.formList} filterSubmit = {this.handleFilter}/>
         </Card> 
         <Card style={{marginTop: 10}}>
     <Button type='primary' icon='plus' onClick={()=>this.handleOperator('create')}>创建员工</Button>
     <Button type='primary' icon='edit' onClick={()=>this.handleOperator('edit')}>编辑员工</Button>
     <Button type='primary' onClick={()=>this.handleOperator('detail')}>员工详情</Button>
     <Button type='primary' icon='delete' onClick={()=>this.handleOperator('delete')}>删除员工</Button>
         </Card>
         <div className='content-wrap'>
    <ETable
      columns={columns}
      dataSource={this.state.list}
      selectedRowKeys={this.state.selectedRowKeys}
      pagination={this.state.pagination}
      updateSelectedItem= {Utils.updateSelectedItem.bind(this)}
      /* selectedIds={this.state.selectedIds}*/
     // selectedItem = {this.state.selectedItem} 
        />
             </div>  
<Modal
title={this.state.title}
visible={this.state.isVisible}
onOk= {this.handleSubmit}
onCancel = {()=>{
    this.userForm.props.form.resetFields();
    this.setState({
       isVisible:false,
       userInfo:''
    })
}} 
width={800}
>
<UserForm type={this.state.type} userInfo={this.state.userInfo} wrappedComponentRef ={(inst)=>this.userForm = inst}/>
</Modal>



            </div>
        )
    }
}





class UserForm extends React.Component{
    getState = (state)=>{
        return {
            '1':'咸鱼一条',
            '2':'风华浪子',
            '3':'北大才子一枚',
            '4':'百度FE',
            '5':'创业者'
        }[state]
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol:{span:3},
            wrapperCol:{span:19}
        }
        const userInfo = this.props.userInfo || {};
        const type = this.props.type;
        return (
            <Form layout='horizontal'>
<FormItem label="姓名" {...formItemLayout}>
           {
               userInfo && type=='detail'?userInfo.username:
               getFieldDecorator('user_name',{
                   initialValue:userInfo.username
               })(
                   <Input type="text" placeholder="请输入姓名"/>
               )
           }
       </FormItem>
    <FormItem label="性别" {...formItemLayout}>
        {
            userInfo && type=='detail'?userInfo.sex==1?'男':'女':
          //  getFieldDecorator	用于和表单进行双向绑定，详见下方描述
            getFieldDecorator('sex',{
                initialValue:userInfo.sex
            })(
            <RadioGroup>
                <Radio value={1}>男</Radio>
                <Radio value={2}>女</Radio>
                     </RadioGroup>
         )}
 </FormItem>

   <FormItem label="状态" {...formItemLayout}>
    {
        userInfo && type=='detail'?this.getState(userInfo.state):
        getFieldDecorator('state',{
            initialValue:userInfo.state
        })(
        <Select>
            <Option value={1}>咸鱼一条</Option>
            <Option value={2}>风华浪子</Option>
            <Option value={3}>北大才子一枚</Option>
            <Option value={4}>百度FE</Option>
            <Option value={5}>创业者</Option>
        </Select>
    )}
                </FormItem>
  <FormItem label="生日" {...formItemLayout}>
      {
          userInfo && type=='detail'?userInfo.birthday:
          getFieldDecorator('birthday',{
              initialValue:Moment(userInfo.birthday)
          })(
          <DatePicker />
      )}
  </FormItem>
  <FormItem label="联系地址" {...formItemLayout}>
      {
          userInfo && type=='detail'?userInfo.address:
          getFieldDecorator('address',{
/*             options.initialValue	子节点的初始值，类型、可选值均由子节点决定
(注意：由于内部校验时使用 === 判断是否变化，建议使用变量缓存所需设置的值而非直接使用字面量)) */
              initialValue:userInfo.address
          })(
          <Input.TextArea rows={3} placeholder="请输入联系地址"/>
      )}  
  </FormItem>
            </Form>
        )
    }
}

UserForm = Form.create({})(UserForm);











