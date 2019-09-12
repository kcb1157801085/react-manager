import React from 'react'
import {Card, Button, Form, Input, Select, Tree, Transfer, Modal} from 'antd'
import axios from '../../axios/index'
import ETable from '../../components/ETable/index'
import menuConfig from '../../config/menuConfig'
import Utils from '../../utils/utils'
const Option = Select.Option
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

export default class PermissionUser extends React.Component{
    state={}
    componentWillMount(){
    this.requestList()
    }



    requestList = ()=>{
        axios.ajax({
            url:'/role/list',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.code == 0){
                let list  = res.result.item_list.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    list
                })
            }
        })
    }


    //创建角色弹出模态框
    handleRole = ()=>{
        this.setState({
            isRoleVisible:true
        })
    }

//创建用户提交
    handleRoleSubmit = ()=>{
       let data = this.roleForm.props.form.getFieldsValue();
       axios.ajax({
           url:'/role/create',
           data:{
               params:{
                   ...data
               }
           }
       }).then((res)=>{
           if(res.code==0){
               this.setState({
                   isRoleVisible:false
               })
               //重置表单
               this.roleForm.props.form.resetFields();
               this.requestList()
             

           }
       })
    }

//权限设置
handlePermission = ()=>{
    if (!this.state.selectedItem) {
        Modal.info({
            title: '信息',
            content: '请选择一个角色'
        })
        return;
    }
    this.setState({
        isPermVisible: true,
        detailInfo: this.state.selectedItem
    });
    let menuList = this.state.selectedItem.menus;
    this.setState({
        menuInfo:menuList
    })
}

//设置权限提交
handlePermEditSubmit = ()=>{
    //获取用户表单信息中的数据
   let data = this.PermEditForm.props.form.getFieldsValue();
   data.role_id = this.state.selectedItem.id;
   data.menus= this.state.menuInfo;
   axios.ajax({
       url:'/permission/edit',
       data:{
           params:{
               ...data
           }
       }
   }).then((res)=>{
       if(res===0){
           this.setState({
               isPermVisible:false
           })
           this.requestList()
    
       }
   })
   
}

//用户授权
handleUserAuth=()=>{
   let item = this.state.selectedItem
   if(!item){
       Modal.info({
           text:'请选择一个角色'
       })
       return
   }
   this.setState({
    isUserVisible:true,
    detailInfo:item,
    isAuthClosed:false
})
   this.getRoleUserList(item.id);
    
}

//获取角色用户列表
getRoleUserList = (id)=>{
    axios.ajax({
        url:'role/user_list',
        data:{
            params:{
                id
            }
        }
    }).then((res)=>{
         if(res){
             this.getAuthUserList(res.result)
         }
    })

}


//筛选目标用户
getAuthUserList = (dataSource)=>{
    const mockData = [];
    const targetKeys = [];
    if(dataSource && dataSource.length > 0 ){
       dataSource.forEach((item)=>{
           const data = {
               key:item.user_id,
               title:item.user_name,
               status:item.status
           }
           if(data.status == 1){
               targetKeys.push(data.key);
           }
            mockData.push(data) ; 
       })
       this.setState({
           mockData,targetKeys
       })
    }
}

//存储所有选中的
patchUserInfo = (targetKeys) => {
    this.setState({
        targetKeys: targetKeys
    });
};

// 用户授权提交
handleUserSubmit = ()=>{
    let data = {};
    data.user_ids = this.state.targetKeys || [];
    data.role_id = this.state.selectedItem.id;
    axios.ajax({
        url:'/role/user_role_edit',
        data:{
            params:{
                ...data
            }
        }
    }).then((res)=>{
        if(res){
            this.setState({
                isUserVisible:false
            })
            this.requestList();
        }
    })
}



     render(){
         //定义表头信息
        const columns = [
            {
                title: '角色ID',
                dataIndex: 'id'
            }, {
                title: '角色名称',
                dataIndex: 'role_name'
            },{
                title: '创建时间',
                dataIndex: 'create_time',
                render: Utils.formatTime
            }, {
                title: '使用状态',
                dataIndex: 'status',
                render(status){
                    if (status == 1) {
                        return "启用"
                    } else {
                        return "停用"
                    }
                }
            }, {
                title: '授权时间',
                dataIndex: 'authorize_time',
                render: Utils.formatTime
            }, {
                title: '授权人',
                dataIndex: 'authorize_user_name',
            }
        ];
         return (
             <div>
                 <Card>
                     <Button type='primary' onClick={this.handleRole} style={{marginRight:10}}>创建角色</Button>
                     <Button type='primary' onClick={this.handlePermission}>设置权限</Button>
                     <Button type='primary' onClick={this.handleUserAuth}>用户授权</Button>
                 </Card>
                 <div className='content-wrap'>
              <ETable 
              selectRowKeys={this.state.selectedRowKeys}
              updateSelectedItem={Utils.updateSelectedItem.bind(this)}
              dataSource={this.state.list}
              columns={columns}
              />
              <Modal
              title= '创建角色'
              visible= {this.state.isRoleVisible}
              onOk= {this.handleRoleSubmit}
              onCancel= {()=>{
                  //重置表单
                  this.roleForm.props.form.resetFields();
                  this.setState({
                      isRoleVisible:false //隐藏模态框
                  })
              }}
              >
              <RoleForm wrappedComponentRef={(inst) => this.roleForm = inst }/>
              </Modal>
              <Modal
              title='权限设置'
              visible= {this.state.isPermVisible}
              width={600}
              onOk= {this.handlePermEditSubmit}
              onCancel= {()=>{
                  this.setState({
                      isPermVisible:false
                  })
              }}
              >
            <PermEditForm 
            wrappedComponentRef={(inst) => this.PermEditForm = inst }
            detailInfo={this.state.detailInfo}
            menuInfo = {this.state.menuInfo || []} 
            patchMenuInfo={(checkedKeys)=>{
                this.setState({
                    menuInfo: checkedKeys
                })
            }}
            />

              </Modal>
              <Modal
              title='用户授权'
              visible= {this.state.isUserVisible}
              width={800}
              onOk= {this.handleUserSubmit}
              onCancel= {()=>{
                  this.setState({
                    isUserVisible:false
                  })
              }}
              >
                  <RoleAuthForm
                  wrappedComponentRef={(inst) => this.userAuthForm = inst }
                  isColsed = {this.state.isAuthClosed}
                  detailInfo = {this.state.detailInfo}
                  targetKeys = {this.state.targetKeys}
                  mockData = {this.state.mockData}
                  patchUserInfo = {this.patchUserInfo}
                  
                  
                  />
             </Modal>
                 </div>
             </div>
         )
     }
}


// 角色创建
class RoleForm extends React.Component{

    render(){
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 16}
        };
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称" {...formItemLayout}>
                    {
                        getFieldDecorator('role_name',{
                            initialValue:''
                        })(
                            <Input type="text" placeholder="请输入角色名称"/>
                        )
                    }
                </FormItem>
                <FormItem label="状态" {...formItemLayout}>
                    {
                        getFieldDecorator('state',{
                            initialValue:1
                        })(
                        <Select>
                            <Option value={1}>开启</Option>
                            <Option value={0}>关闭</Option>
                        </Select>
                    )}
                </FormItem>
            </Form>
        );
    }
}
RoleForm = Form.create({})(RoleForm);



class PermEditForm extends React.Component{
    state = {}
   //设置选中的节点，通过父组件方法再传递过来
onCheck = (checkedKeys) => {
    this.props.patchMenuInfo(checkedKeys)
}




    renderTreeNodes=(data,key='')=>{
        return data.map((item)=>{
            let parentKey = key+item.key;
            if(item.children){
                return(
                    <TreeNode title={item.title} key={parentKey} dataRef={item} className="op-role-tree">
                    {this.renderTreeNodes(item.children,parentKey)}
                </TreeNode>
                );
            }else if (item.btnList) {
                return (
                    <TreeNode title={item.title} key={parentKey} dataRef={item} className="op-role-tree">
                        { this.renderBtnTreedNode(item,parentKey) }
                    </TreeNode>
                );
            }
            return <TreeNode {...item} />;
        })
    }

    renderBtnTreedNode = (menu,parentKey='')=> {
        const btnTreeNode = []
        menu.btnList.forEach((item)=> {
            console.log(parentKey+'-btn-'+item.key);
            btnTreeNode.push(<TreeNode title={item.title} key={parentKey+'-btn-'+item.key} className="op-role-tree"/>);
        })
        return btnTreeNode;
    }

    render(){
        const {getFieldDecorator} =this.props.form;
        const formItemLayout = {
            labelCol:{span:5},
            wrapperCol:{span:19}
        }
        //获取从父组件传递过来的值
        const detail_info = this.props.detailInfo;
        const menuInfo = this.props.menuInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称：" {...formItemLayout}>
                    <Input disabled maxLength="8" placeholder={detail_info.role_name}/>
                </FormItem>
                <FormItem label="状态：" {...formItemLayout}>
                    {getFieldDecorator('status',{
                        initialValue: '1'
                    })(
                        <Select style={{ width: 80}}
                                placeholder="启用"
                        >
                            <Option value="1">启用</Option>
                            <Option value="0">停用</Option>
                        </Select>
                    )}
                </FormItem>
                <Tree
                /* 勾选功能 */
                checkable
               /*  展开树形结构 */
                defaultExpandAl
               /*  onCheck	点击复选框触发 */
                onCheck = {(checkedKeys)=>this.onCheck(checkedKeys)}
               /*  selectedKeys	（受控）设置选中的树节点 */
                checkedKeys = {menuInfo || []}
                >
<TreeNode title='平台权限' key='platform_all'>
    {this.renderTreeNodes(menuConfig)}
</TreeNode>
                </Tree>
            </Form>
        );
    }
}
PermEditForm = Form.create({})(PermEditForm);

// 用户授权
class RoleAuthForm extends React.Component {
    filterOption = (inputValue, option) => {
        return option.title.indexOf(inputValue) > -1;
    };
    handleChange = (targetKeys) => {
        this.props.patchUserInfo(targetKeys);
    };
    render() {
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18}
        };
        const detail_info = this.props.detailInfo;
        return (
            <Form layout="horizontal">
                <FormItem label="角色名称：" {...formItemLayout}>
                    <Input disabled maxLength={8} placeholder={detail_info.role_name}/>
                </FormItem>
                <FormItem label="选择用户：" {...formItemLayout}>
                    <Transfer
                        listStyle={{width: 200,height: 400}}
                        dataSource={this.props.mockData}
                        showSearch
                        titles={['待选用户', '已选用户']}
                        searchPlaceholder='输入用户名'
                        filterOption={this.filterOption}
                        targetKeys={this.props.targetKeys}
                        onChange={this.handleChange}
                        render={item => item.title}
                    />
                </FormItem>
            </Form>
        )
    }
}
RoleAuthForm = Form.create({})(RoleAuthForm);