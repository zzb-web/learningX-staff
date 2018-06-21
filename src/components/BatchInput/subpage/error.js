import React from 'react';
import {Select, Button} from 'antd';
import {Get} from '../../../fetch/data.js';
const {Option} = Select;
class Error extends React.Component{
    constructor(props){
        super();
        this.state={
            errorQues : props.errorQues,
            learnID : props.learnID,
            errDate :props.errDate,
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            errorQues : nextProps.errorQues,
            errDate : nextProps.errDate
        })
    }
    _timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return Y+M+D+h+m+s;
    }
    errDateChange(value){
        console.log(value)
        this.setState({
            errDate : value
        })
        this.props.getDate(value)
    }
    errorSure(){
        const {errDate,learnID} = this.state;
        if(errDate !== '' && errDate !== undefined && errDate !== null){
            Get(`/api/v3/staffs/students/${learnID}/uploadTasks/${errDate}/`).then(resp=>{
                if(resp.status ===200){
                    let wrongProblems = resp.data.wrongProblems;
                    if(resp.data.length ===0){
                        this.props.getWrongProblems(wrongProblems,true)
                    }else{
                        this.props.getWrongProblems(wrongProblems,true)
                        this.props.showWarningHandle(10)
                    }

                }
            }).catch(err=>{
                
            })
        }else{
            this.props.showWarningHandle(0)
        }
    }
    render(){
        const {errorQues,errDate} = this.state;
        let children = [];
        errorQues.map((item,index)=>{
            children.push(
                <Option value={item.time} key={index}>{this._timestampToTime(item.time)}</Option>
            )
        })
        return(
            <div style={{marginTop:40}}>
                <div>
                    <span className='common-title'>纠错本日期:</span>
                    <Select style={{width:240,marginLeft:10}} 
                            placeholder='选择纠错本的日期'
                            onChange={this.errDateChange.bind(this)}
                            value={errDate}>
                        {children}
                    </Select>
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'></span>
                    <Button type='primary' 
                    style={{width:240,marginLeft:10}}
                    onClick={this.errorSure.bind(this)}>确定</Button>
                </div>
            </div>
        )
    }
}

export default Error;