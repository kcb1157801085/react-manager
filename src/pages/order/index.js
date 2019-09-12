import React from 'react'
import {Card,Button,Table,Form,Select,Modal,message,DatePicker} from 'antd'
import axios from '../../axios/index'
import Utils from '../../utils/utils'
import BaseForm from '../../components/BaseForm'
import ETable from '../../components/ETable'
const FormItem = Form.Item
const Option = Select.Option
export default class Order extends React.Component {
  state = {
      orderInfo:{},
      //默认模态框的显示与影藏
    orderConfirmVisble:false
  }
  params={
      page:1
  }
  //存储所有的表单基础信息
  formList = [
    {
        type:'SELECT',
        label:'城市',
        field:'city',
        placeholder:'全部',
        initialValue:'1',
        width:80,
        list: [{ id: '0', name: '全部' }, { id: '1', name: '北京' }, { id: '2', name: '天津' }, { id: '3', name: '上海' }]
    },
    {
        type: '时间查询'
    },
    {
        type: 'SELECT',
        label: '订单状态',
        field:'order_status',
        placeholder: '全部',
        initialValue: '1',
        width: 80,
        list: [{ id: '0', name: '全部' }, { id: '1', name: '进行中' }, { id: '2', name: '结束行程' }]
    }
]
  componentDidMount(){  //钩子函数--- 当页面渲染完成时加载
        this.requestList()
  }

//从后台获取改变的值，然后刷新列表
  handleFilter = (params)=>{
    this.params = params;
    this.requestList();
}



  requestList=()=>{
      let _this =this;
      axios.requestList(this,'/order/list',this.params,true)
  /*   axios.ajax({
        url:'/order/list',
        data:{
         params:{
            page:this.params.page
         }  
        }
    }).then((res)=>{
        let list = res.result.item_list.map((item, index) => {
            item.key = index;
            return item;
        });
        this.setState({
            list:list,  //给list数组赋值
            pagination:Utils.pagination(res,(current)=>{
                _this.params.page = current;
                _this.requestList()
            })
        })
    }) */
  }


//结束订单
handleConfirm=()=>{
    let item = this.state.selectedItem;
    if (!item) {
        Modal.info({
            title: '信息',
            content: '请选择一条订单进行结束'
        })
        return;
    }
    axios.ajax({
        url:'/order/ebike_info',
        data:{
            params:{
                orderId: item.id
            }
        }
    }).then((res)=>{
        if(res.code==0){
            this.setState({
                orderInfo:res.result,
                orderConfirmVisble:true
            })
        }
    })
        
  }
//结束订单模态框确认的处理函数
  handleFinishOrder=()=>{
    let item = this.state.selectedItem;
    axios.ajax({
        url:'/order/finish_order',
        data:{
            params:{
                orderId: item.id  
            }
        }
    }).then((res)=>{
        if(res.code==0){
            message.success('订单结束成功')
            this.setState({
                orderConfirmVisble:false
            })
         this.requestList()   
        }
    })
  }

/*   onRowClick = (record, index) => {
    let selectKey = [index];
    this.setState({
        selectedRowKeys: selectKey,
        selectedItem: record
    })
}
 */

openOrderDetail = ()=>{
    let item = this.state.selectedItem;
    if (!item) {
        Modal.info({
            title: '信息',
            content: '请先选择一条订单'
        })
        return;
    }
    window.open(`/#/common/order/detail/${item.id}`,'_blank')
}

  render(){
/*       表头信息 */
const columns = [
    {
        title:'订单编号',
        dataIndex:'order_sn'
    },
    {
        title: '车辆编号',
        dataIndex: 'bike_sn'
    },
    {
        title: '用户名',
        dataIndex: 'user_name'
    },
    {
        title: '手机号',
        dataIndex: 'mobile'
    },
    {
        title: '里程',
        dataIndex: 'distance',
        render(distance){
            return distance/1000 + 'Km';
        }
    },
    {
        title: '行驶时长',
        dataIndex: 'total_time'
    },
    {
        title: '状态',
        dataIndex: 'status'
    },
    {
        title: '开始时间',
        dataIndex: 'start_time'
    },
    {
        title: '结束时间',
        dataIndex: 'end_time'
    },
    {
        title: '订单金额',
        dataIndex: 'total_fee'
    },
    {
        title: '实付金额',
        dataIndex: 'user_pay'
    }
]

//定义结束订单栅格的宽度，在标签中解构出来
const formItemLayout = {
    labelCol:{ span:5 },
    wrapperCol:{ span:19 }
}
/* const selectedRowKeys = this.state.selectedRowKeys;
const rowSelection = {
    type:'radio',
    selectedRowKeys
} */
      return (
          <div>
<Card>
<BaseForm formList={this.formList} filterSubmit={this.handleFilter}/>
</Card>

<Card style={{marginTop:10}}>
    <Button type='primary' onClick={this.openOrderDetail}>订单详情</Button> 
    <Button type='primary' style={{marginLeft:10}} onClick={this.handleConfirm}>结束订单</Button>
</Card>
<div className ='content-wrap'>
    <ETable
      columns={columns}
      dataSource={this.state.list}
      selectedRowKeys={this.state.selectedRowKeys}
      pagination={this.state.pagination}
      updateSelectedItem= {Utils.updateSelectedItem.bind(this)}
      selectedIds={this.state.selectedIds}
      selectedItem = {this.state.selectedItem}
    />
  {/*  <Table 
   bordered
    表头信息 
    columns={columns}
     表格数据 
    dataSource={this.state.list}
    //分页信息
    pagination={this.state.pagination}
    rowSelection={rowSelection}
    onRow={(record, index) => {
        return {
            onClick: () => {
                this.onRowClick(record, index);
            }
        };
    }} 
  /> */}
</div>
<Modal
title='结束订单'
visible={this.state.orderConfirmVisble}
onCancel = { ()=>{
this.setState({
    orderConfirmVisble:false
})
}}
onOk = {this.handleFinishOrder}
width = {600}
>
{/* layout	表单布局 */}
<Form  layout="horizontal">
<FormItem label="车辆编号" {...formItemLayout}>
{this.state.orderInfo.bike_sn}
</FormItem>
 <FormItem label="剩余电量" {...formItemLayout}>
     {this.state.orderInfo.battery + '%'}
 </FormItem>
 <FormItem label="行程开始时间" {...formItemLayout}>
     {this.state.orderInfo.start_time}
 </FormItem>
 <FormItem label="当前位置" {...formItemLayout}>
     {this.state.orderInfo.location}
 </FormItem>
</Form>
</Modal>
          </div> 
      )
  }
}
