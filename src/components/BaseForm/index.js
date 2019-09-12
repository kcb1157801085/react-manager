import React from 'react'
import { Input, Select, Form, Button, Checkbox, Radio, DatePicker} from 'antd'
import Utils from '../../utils/utils';
const FormItem = Form.Item;
const Option = Select.Option;

class FilterForm extends React.Component{

    handleFilterSubmit = ()=>{
        //存储用户改变的所有表单信息
        let fieldsValue = this.props.form.getFieldsValue();
       //把用户改变的值传递给前台，前台更新
        this.props.filterSubmit(fieldsValue);
    }

    reset = ()=>{
        //表单重置时触发
        this.props.form.resetFields();
    }
//初始化表单列表
    initFormList = ()=>{
        //把双向数据绑定的list解构出来
        const { getFieldDecorator } = this.props.form;
        // 获取前台传递过来的所有表单基础信息
        const formList = this.props.formList;
        const formItemList = [];
        if (formList && formList.length>0){
            formList.forEach((item,i)=>{
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
                if (item.type == '时间查询'){
                    const begin_time = <FormItem label="订单时间" key={field}>
                       {/*  getFieldDecorator	用于和表单进行双向绑定，详见下方描述 */}
{/* 经过 getFieldDecorator 包装的控件，表单控件会自动添加 value（或 valuePropName 指定的其他属性） onChange（或 trigger 指定的其他属性），数据同步将被 Form 接管，这会导致以下结果：
你不再需要也不应该用 onChange 来做同步，但还是可以继续监听 onChange 等事件。
你不能用控件的 value defaultValue 等属性来设置表单域的值，默认值可以用 getFieldDecorator 里的 initialValue。
你不应该用 setState，可以使用 this.props.form.setFieldsValue 来动态改变表单值。 */}
            {
                getFieldDecorator('begin_time')(
                    <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss"/>
                )
            }
        </FormItem>;
        formItemList.push(begin_time)
        const end_time = <FormItem label="~" colon={false} key={field}>
            {
                getFieldDecorator('end_time')(
                    <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD HH:mm:ss" />
                )
            }
        </FormItem>;
        formItemList.push(end_time)
    }else if(item.type == 'INPUT'){
        const INPUT = <FormItem label={label} key={field}>
            {
                getFieldDecorator([field],{
                    initialValue: initialValue
                })(
                    <Input type="text" placeholder={placeholder} />
                )
            }
        </FormItem>;
        formItemList.push(INPUT)
    } else if (item.type == 'SELECT') {
        const SELECT = <FormItem label={label} key={field}>
            {
                getFieldDecorator([field], {
                    initialValue: initialValue
                })(
                    <Select
                        style={{ width: width }}
                        placeholder={placeholder}
                    >
                        {Utils.getOptionList(item.list)}
                    </Select>
                )
            }
        </FormItem>;
        formItemList.push(SELECT)
    } else if (item.type == 'CHECKBOX') {
        const CHECKBOX = <FormItem label={label} key={field}>
            {
                getFieldDecorator([field], {
                    valuePropName: 'checked',
                    initialValue: initialValue //true | false
                })(
                    <Checkbox>
                        {label}
                    </Checkbox>
                )
            }
        </FormItem>;
        formItemList.push(CHECKBOX)
    }
    else if(item.type == '城市'){
        const city = <FormItem label='城市' colon={false} key={field}>
{
     getFieldDecorator([field], {
         initialValue: initialValue
     })(
         <Select
             style={{ width: width }}
             placeholder={placeholder}
         >
             {Utils.getOptionList(item.list)}
         </Select>
     )
 }
        </FormItem>;
        formItemList.push(city)
    }
})
        }
        return formItemList;
    }  
    render(){
        return (
            <Form layout="inline">
                { this.initFormList() }
                <FormItem>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>查询</Button>
                    <Button onClick={this.reset}>重置</Button>
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);
