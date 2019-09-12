import React from 'react'
import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react';
import echartTheme from '../echartTheme'
// import echarts from 'echarts'
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入饼图
import 'echarts/lib/chart/pie'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
export default class Pie extends React.Component {

    state={}

    componentWillMount(){
        echarts.registerTheme('app',echartTheme);
    }

    getOption=()=>{
        let option={
            title:{
               text:'用户骑行订单',
               x:'center'
            },
            legend:{
                orient:'vertical',//设置控制按钮的位置
                right:10,
                top:20,
                bottom:20,
                data:[
                 '周一',
                 '周二',
                 '周三',
                 '周四',
                 '周五',
                 '周六',
                 '周日'
                ]
            },
            tooltip:{
               trigger:'item',
               formatter:'{a}<br/>{b}:{c}({d}%)'   //过滤器过滤提示信息百分比

            },
            series:[
                {
                    name:'订单量',
                    type:'pie',
                    data:[
                        {value:1000,name:'周一'},
                        {value:1000,name:'周二'},
                        {value:5000,name:'周三'},
                        {value:1500,name:'周四'},
                        {value:3000,name:'周五'},
                        {value:2000,name:'周六'},
                        {value:1200,name:'周日'}
                    ]
                }
            ]

        }
      return option
    }

    getOption2=()=>{
        let option={
            title:{
               text:'用户骑行订单',
               x:'center'
            },
            legend:{
                orient:'vertical',//设置控制按钮的位置
                right:10,
                top:20,
                bottom:20,
                data:[
                 '周一',
                 '周二',
                 '周三',
                 '周四',
                 '周五',
                 '周六',
                 '周日'
                ]
            },
            tooltip:{
               trigger:'item',
               formatter:'{a}<br/>{b}:{c}({d}%)'   //过滤器过滤提示信息百分比

            },
            series:[
                {
                    name:'订单量',
                    type:'pie',
                    radius:['50%','70%'],//控制环形图的尺寸
                    data:[
                        {value:1000,name:'周一'},
                        {value:1000,name:'周二'},
                        {value:5000,name:'周三'},
                        {value:1500,name:'周四'},
                        {value:3000,name:'周五'},
                        {value:2000,name:'周六'},
                        {value:1200,name:'周日'}
                    ]
                }
            ]

        }
      return option
    } 

    
    getOption3=()=>{
        let option={
            title:{
               text:'用户骑行订单',
               x:'center'
            },
            legend:{
                orient:'vertical',//设置控制按钮的位置
                right:10,
                top:20,
                bottom:20,
                data:[
                 '周一',
                 '周二',
                 '周三',
                 '周四',
                 '周五',
                 '周六',
                 '周日'
                ]
            },
            tooltip:{
               trigger:'item',
               formatter:'{a}<br/>{b}:{c}({d}%)'   //过滤器过滤提示信息百分比

            },
            series:[
                {
                    name:'订单量',
                    type:'pie',
                    data:[
                        {value:1000,name:'周一'},
                        {value:1000,name:'周二'},
                        {value:5000,name:'周三'},
                        {value:1500,name:'周四'},
                        {value:3000,name:'周五'},
                        {value:2000,name:'周六'},
                        {value:1200,name:'周日'}
                    ].sort((a,b)=>{
                     return a.value - b.value

                    }),
                    roseType:'radius'
                }
            ]

        }
      return option
    } 

    render(){
        return (
            <div>
                <Card title="饼图表之一">
                    <ReactEcharts option={this.getOption()} theme="app" notMerge={true} lazyUpdate={true} style={{ height: 500 }} />
                </Card>
                <Card title="饼图表之二">
                    <ReactEcharts option={this.getOption3()} theme="app" notMerge={true} lazyUpdate={true} style={{ height: 500 }} />
                </Card>
                 <Card title="环形图表之一" style={{marginTop:10}}>
                    <ReactEcharts option={this.getOption2()} theme="app" notMerge={true} lazyUpdate={true} style={{ height: 500 }} />
                </Card> 
            </div> 
        );
    }
}