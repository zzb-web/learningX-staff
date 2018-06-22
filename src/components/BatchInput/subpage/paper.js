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
            paperID : props.paperID,
            paperDate : props.paperDate
        }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
        papers : nextProps.papers,
        learnID : nextProps.learnID,
        paperID : nextProps.paperID,
        paperDate : nextProps.paperDate
      })
    }
    dateChange(date,dateString){
        let str = dateString.replace(/-/g,'/')
        let time = new Date(str).getTime()/1000;
        this.props.getPaperDate(time);
    }
    paperChange(value){
        // this.setState({
        //     paperID : value
        // })
        this.props.getPaperID(value)
    }
    sureHandle(){
        const {paperID ,paperDate,learnID} = this.state;
        console.log(paperID , paperDate)
        //paperDate !== '' && paperDate !==undefined &&
        if( paperID !== '' && paperID !== undefined){
            const msg = `paperID=${paperID}`;
            Get(`/api/v3/staffs/students/${learnID}/paperProblems/?${msg}`).then(resp=>{
               if(resp.status === 200){
                    if(resp.data.length ===0){
                        this.props.getPaperData(true,resp.data,false);
                    }else{
                        this.props.getPaperData(true,resp.data,true);
                        this.props.showWarningHandle(10);
                    }
               }else{
                this.props.getPaperData(false,[],false);
               }

            }).catch(err=>{
            })
        }else{
            this.props.showWarningHandle(2)
        }
        
    }
    render(){
        const {papers,paperID,paperDate} = this.state;
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
                                onChange={this.dateChange.bind(this)}
                                />
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'>试卷名称:</span>
                    <Select style={{width:240,marginLeft:10}} onChange={this.paperChange.bind(this)} value={paperID}>
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