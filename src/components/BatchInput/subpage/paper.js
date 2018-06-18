import React from 'react';
import {Select, Button,DatePicker} from 'antd';
import {Get} from '../../../fetch/data.js';
const {Option} = Select;
class Paper extends React.Component{
    constructor(props){
        super();
        this.state={
            papers : props.papers,
            learnID : props.learnID,
            paperID : '',
        }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
        papers : nextProps.papers,
        learnID : nextProps.learnID
      })
    }
    dateChange(date,dateString){
        let str = dateString.replace(/-/g,'/')
        let time = new Date(str).getTime()/1000;
        this.props.getPaperDate(time);
    }
    paperChange(value){
        this.setState({
            paperID : value
        })
    }
    sureHandle(){
        const {paperID ,time,learnID} = this.state;
        const msg = `paperID=${paperID}`;
        Get(`/api/v3/staffs/students/${learnID}/paperProblems/?${msg}`).then(resp=>{
            this.props.getPaperData(resp.data)
        }).catch(err=>{

        })
    }
    render(){
        const {papers} = this.state;
        console.log(papers)
        let children = [];
        papers.map((item,index)=>{
            children.push(
                <Option key={index} value={item.paperID}>{item.name}</Option>
            )
        })
        return(
            <div style={{marginTop:40}}>
                <div>
                    <span className='common-title'>做题时间:</span>
                    <DatePicker placeholder='大概什么时候做的卷子？'
                                style={{width:240,marginLeft:10}}
                                onChange={this.dateChange.bind(this)}/>
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'>试卷名称:</span>
                    <Select style={{width:240,marginLeft:10}} onChange={this.paperChange.bind(this)}>
                        {children}
                    </Select>
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'></span>
                    <Button type='primary' 
                    style={{width:240,marginLeft:10}}
                    onClick={this.sureHandle.bind(this)}
                    >确定</Button>
                </div>
            </div>
        )
    }
}

export default Paper;