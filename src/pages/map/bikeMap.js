import React from 'react'
import { Card, Button, Table, Form, Input, Checkbox,Select,Radio, Icon, message, Modal, DatePicker } from 'antd'
import axios from './../../axios'
import BaseForm from '../../components/BaseForm'

export default class BikeMap extends React.Component{
  state = {}
  
map = '';
  
    //表单封装，通过构建表单对象，在baseform中进行统一渲染
    formList= [
        {   
            width:80,
            type:'城市',
            //默认值
            initialValue: '0',
            list:[{id:'0',name:'全部'},{id:'1',name:'北京'},{id:'2',name:'上海'},{id:'3',name:'天津'},{id:'4',name:'杭州'},]
        },
        {
            type:'时间查询'
        },
        {
            type: 'SELECT',
            label: '订单状态',
            field: 'order_status',
            placeholder: '全部',
            initialValue: '0',
            width: 150,
            list: [{id: '0', name: '全部'}, {id: '1', name: '进行中'}, {id: '2', name: '行程结束'}]
        }
    ]
    componentWillMount(){
        this.requestList()
    }
 
    requestList = ()=>{
        axios.ajax({
            url:'/map/bike_list',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.code==0){
                this.setState({
                    total_count:res.result.total_count
                })
                this.renderMap(res);
            }
        })
    }

    //查询表单
    handleFilterSubmit = (filterParams)=>{
        this.params = filterParams;
        this.requestList();
    }


    //渲染地图数据
    renderMap = (res)=>{
       let list = res.result.route_list;
       //要控制的区域渲染到这个区域
       this.map = new window.BMap.Map('container');
       //提取起点数据
       let gps1 = list[0].split(',');
       //起点坐标值
       let startPoint = new window.BMap.Point(gps1[0],gps1[1])
       //提取终点数据
       let gps2 = list[list.length-1].split(',')
       //终点坐标值
       let endPoint = new window.BMap.Point(gps2[0],gps2[1])
       //地图以终点坐标进行居中展示
       this.map.centerAndZoom(endPoint,11);
       //调用地图控件
       this.addMapControl()

       //添加起始图标
       let startPointIcon = new window.BMap.Icon("/assets/start_point.png", new window.BMap.Size(36, 42), {
        imageSize: new window.BMap.Size(36, 42),
        anchor: new window.BMap.Size(18, 42)
    });
       
    var bikeMarkerStart = new window.BMap.Marker(startPoint, { icon: startPointIcon });
    this.map.addOverlay(bikeMarkerStart);

         //添加终点图标
        let endPointIcon = new window.BMap.Icon("/assets/end_point.png", new window.BMap.Size(36, 42), {
            imageSize: new window.BMap.Size(36, 42),
            //图标偏移量
            anchor: new window.BMap.Size(18, 42)
        });

    var bikeMarkerEnd = new window.BMap.Marker(endPoint, { icon: endPointIcon });
    this.map.addOverlay(bikeMarkerEnd);

    //绘制车辆行驶路线
let routeList = [];
list.forEach((item)=>{
    //提取坐标信息
    let p = item.split(',')
    routeList.push(new window.BMap.Point(p[0],p[1])) 
})
/* Polyline 使用浏览器的矢量制图工具（如果可用）在地图上绘制折线的地图叠加层。 */
 let polyline=new window.BMap.Polyline(routeList,{
    strokeColor:'#ef4136',
    strokeWeight:2,
    strokeOpacity:0.7
}) 

this.map.addOverlay(polyline);


        // 绘制服务区路线
        let serviceList = res.result.service_list;
        let servicePointist = [];
        serviceList.forEach((item) => {
            let point = new window.BMap.Point(item.lon, item.lat);
            servicePointist.push(point);
        })
        // 画线
        var polyServiceLine = new window.BMap.Polyline(servicePointist, {
            strokeColor: "#ef4136",
            strokeWeight: 3,
            strokeOpacity: 1
        });
        this.map.addOverlay(polyServiceLine);

        //添加地图中的自行车停放位置坐标点
           let bikeList = res.result.bike_list;
           let bikeIcon = new window.BMap.Icon("/assets/bike.jpg", new window.BMap.Size(36, 42), {
               imageSize: new window.BMap.Size(36, 42),
               anchor: new window.BMap.Size(18, 42)
           });
           bikeList.forEach((item) => {
               let p = item.split(",");
               let point = new window.BMap.Point(p[0], p[1]);
               var bikeMarker = new window.BMap.Marker(point, { icon: bikeIcon });
               this.map.addOverlay(bikeMarker);
           })

    }

    



    /* 3、添加地图控件 */
addMapControl = ()=>{
    let map = this.map;
   /*  BMap前面一定要加window要不然会报未定义 */
    map.addControl(new window.BMap.ScaleControl({anchor:window.BMAP_ANCHOR_TOP_RIGHT}));  
    map.addControl(new window.BMap.NavigationControl({anchor:window.BMAP_ANCHOR_TOP_RIGHT}));
 }


    render(){
        return (
            <div>
            <Card>
              <BaseForm formList = {this.formList} filterSubmit = {this.handleFilterSubmit} />  
            </Card>
            <Card style={{ marginTop:10 }}>
                <div>共{this.state.total_count}辆车</div>
                <div id='container' style={{height:500}}></div>
            </Card>      
            </div>
        )
    }
}