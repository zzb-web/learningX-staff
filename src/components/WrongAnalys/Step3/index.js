import React from 'react';
import {Row,Col,DatePicker, Select} from 'antd';
const {Option} = Select;
export default class Step3 extends React.Component{
    constructor(props){
        super();
        this.state={
            allStudentNum : props.allStudentNum,
            schoolMsg : props.schoolMsg,
            grade : props.grade,
            classNum : props.classNum,
            requestData : props.requestData,
            paperData : props.paperData,
            bookIdName : props.bookIdName,  
            paperIdName : props.paperIdName,
            cityMsg : props.cityMsg     
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            allStudentNum : nextProps.allStudentNum,
            schoolMsg : nextProps.schoolMsg,
            grade : nextProps.grade,
            classNum : nextProps.classNum,
            requestData : nextProps.requestData,
            paperData : nextProps.paperData,
            bookIdName : nextProps.bookIdName,
            paperIdName : nextProps.paperIdName,
            cityMsg : nextProps.cityMsg
        })
    }
    render(){
        const {allStudentNum,schoolMsg,grade,classNum,cityMsg,
                requestData,paperData,bookIdName,paperIdName} = this.state;
        console.log(paperData)
        let bookMsg = []
        requestData.map((item,index)=>{
            bookMsg.push(
                <span style={{marginLeft:10}}>{`${bookIdName[item.bookID]}P${item.startPage}~P${item.endPage}`}</span>    
            )
        })
        paperData.map((item,index)=>{
            bookMsg.push(
                <span style={{marginLeft:10}}>{paperIdName[item.paperID]}</span>
            )
        })

        const tests =['单元考试','期中考试','期末考试']
        return(
            <Row>
                <Col span={1}></Col>
                <Col span={22}>
                    <div style={{color:'#49a9ee'}}>
                        <span>{cityMsg}市</span>
                        <span>{schoolMsg}学校</span>
                        <span>{grade}（{classNum}）班，</span>
                        <span>{allStudentNum}人</span>
                        <span style={{marginLeft:30}}>分析内容:{bookMsg}</span>
                    </div>
                    <div style={{marginTop:30}}>
                        <span>日期:</span>
                        <DatePicker style={{width:240,marginLeft:20}}
                                    placeholder='要分析哪一天的情况?'/>

                        <span style={{marginLeft:50}}>层级:</span>
                        <Select style={{width:240,marginLeft:20}} placeholder='请选择层级'>
                            
                        </Select>
                    </div>
                    <div style={{marginTop:30}}>
                        <span>考试:</span>
                        <Select style={{width:240,marginLeft:20}} placeholder='请选择考试类型'>
                            {
                                tests.map((item,index)=><Option key={index} value={item}>{item}</Option>)
                            }
                        </Select>
                    </div>
                </Col>
                <Col span={1}></Col>
            </Row>
        )
    }
}