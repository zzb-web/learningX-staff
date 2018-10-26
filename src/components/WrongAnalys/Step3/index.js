import React from 'react';
import {Row,Col,DatePicker, Select, Button,Table,Switch} from 'antd';
import {Get,Post} from '../../../fetch/data.js';
import moment from 'moment';
const {Option} = Select;
export default class Step3 extends React.Component{
    constructor(props){
        super();
        this.state={
            allStudentNum : props.allStudentNum,
            schoolID : props.schoolID,
            schoolMsg : props.schoolMsg,
            grade : props.grade,
            classNum : props.classNum,
            requestData : props.requestData,
            paperData : props.paperData,
            bookIdName : props.bookIdName,  
            paperIdName : props.paperIdName,
            cityMsg : props.cityMsg,
            categoryType : props.categoryType,
            totalLevel : 0,
            time : 0,
            level : -1,
            test : '',
            showTable : false,
            allData : [],
            date : new Date().toLocaleDateString() 
        }
    }
    componentWillMount(){
        const {schoolID,grade,classNum} = this.state;
        let putMsg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
        Get(`/api/v3/staffs/classes/totalLevel/?${putMsg}`).then(resp=>{
            if(resp.status === 200){
                this.setState({
                    totalLevel : resp.data.totalLevel
                })
            }
        }).catch(err=>{

        })
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            allStudentNum : nextProps.allStudentNum,
            schoolMsg : nextProps.schoolMsg,
            schoolID : nextProps.schoolID,
            grade : nextProps.grade,
            classNum : nextProps.classNum,
            requestData : nextProps.requestData,
            paperData : nextProps.paperData,
            bookIdName : nextProps.bookIdName,
            paperIdName : nextProps.paperIdName,
            cityMsg : nextProps.cityMsg,
            categoryType : nextProps.categoryType
        })
    }
    chooseDate(date, dateString){
        let time = Date.parse(date._d)/1000;
        this.setState({
            time : time,
            date : dateString
        })
    }
    chooseLevel(value){
        this.setState({
            level : Number(value)
        })
    }
    chooseTest(value){
        this.setState({
            test : value
        })
    }
    analysHandle(){
        const {categoryType,schoolID,grade,classNum,requestData,paperData,level,test,time} = this.state;
        let paperIDs = [];
        paperData.map((item,index)=>{
            paperIDs.push(item.paperID)
        })
        let postMsg = {
            wrongProblemStatus : categoryType,
            bookPage : requestData,
            paperIDs : paperIDs,
            schoolID : schoolID,
            grade : grade,
            class : classNum,
            level: level,
            exam: test,
            dateBefore: time
        }
        Post(`/api/v3/staffs/classes/getErrorRateAnalysis/`,postMsg).then(resp=>{
            if(resp.status === 200){
                resp.data.map((item,index)=>{
                    item.train = false
                })
                this.setState({
                    allData : resp.data,
                    showTable : true
                })
            }
        }).catch(err=>{

        })
    }
    operaHandle(index,value){
        console.log(index,value)
        const {allData} = this.state;
        allData[index].train = value;
        this.setState({
            allData : allData
        })
    }
    render(){
        const {allStudentNum,schoolMsg,grade,classNum,cityMsg,showTable,allData,date,
                requestData,paperData,bookIdName,paperIdName,totalLevel,level,test} = this.state;
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
        let levelChildren = []
        for(var i=1; i<=totalLevel;i++){
            levelChildren.push(
                <Option key={i} value={i}>{i}</Option>
            )
        }
        levelChildren.unshift(<Option key={0} value={-1}>全部</Option>)
        const tests =['单元考试','期中考试','期末考试']

        let columns = [
            {
                title : '题目',
                dataIndex : 'topic',
                key : 'topic',
                width : '20%'
            },
            {
                title : '错误率',
                dataIndex : 'wrong',
                key : 'wrong',
                width : '10%'
            },,
            {
                title : '错误学生数',
                dataIndex : 'wrongStudentNum',
                key : 'wrongStudentNum',
                width : '10%'
            },
            {
                title : '题目和答案',
                dataIndex : 'topicAnswer',
                key : 'topicAnswer',
                width : '25%'
            },
            {
                title : `${test}概率`,
                dataIndex : 'test',
                key : 'test',
                width : '15%'
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : '20%'
            },
        ]

        let dataSource = [];
        allData.map((item,index)=>{
            dataSource.push({
                key : index,
                topic : item.subIdx === -1 ? `${item.source}/P${item.page}/${item.column}/${item.idx}` : `${item.source}/P${item.page}/${item.column}/${item.idx}(${item.subIdx})`,
                wrong : item.errorRate,
                wrongStudentNum : item.totalStudents,
                topicAnswer : '',
                test : '',
                operation : <Switch style={{width:100}} 
                                    checkedChildren="训练" 
                                    unCheckedChildren="不练" 
                                    onChange={this.operaHandle.bind(this,index)} 
                                    checked={item.train}
                                />,
                wrongStudents : item.wrongStudents,
                train : item.train
            })
        })
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
                                    placeholder='要分析哪一天的情况?'
                                    value={moment(date, "YYYY-MM-DD")}
                                    onChange={this.chooseDate.bind(this)}/>

                        <span style={{marginLeft:50}}>层级:</span>
                        <Select style={{width:240,marginLeft:20}} 
                                value={level}
                                placeholder='请选择层级'
                                onChange={this.chooseLevel.bind(this)}>
                            {levelChildren}
                        </Select>
                    </div>
                    <div style={{marginTop:30}}>
                        <span>考试:</span>
                        <Select style={{width:240,marginLeft:20}} 
                                placeholder='请选择考试类型'
                                onChange={this.chooseTest.bind(this)}>
                            {
                                tests.map((item,index)=><Option key={index} value={item}>{item}</Option>)
                            }
                        </Select>

                        <Button type='primary'
                                size='large'
                                style={{width:240,marginLeft:400}}
                                onClick={this.analysHandle.bind(this)}>分析</Button>
                    </div>
                    <div className='underline-hr' style={{width:'100%'}}></div>
                    {
                        showTable ? <div style={{marginTop:30,textAlign:'center'}}>
                                        <Table 
                                                columns={columns}
                                                bordered={true}
                                                pagination={false}
                                                dataSource={dataSource}
                                                expandedRowRender={record => <p>{record.wrongStudents}</p>}
                                                rowClassName={(record, index)=>{
                                                    if(record.train){
                                                    return 'wrong-row'
                                                    }else{
                                                    return ''
                                                    }
                                                  }}
                                                scroll={{x:false,y:200}}/>
                                        <Button type='primary'
                                                style={{width:240,marginTop:20}}
                                                size='large'>生成统一训练文档</Button>
                                    </div> : null
                    }
                </Col>
                <Col span={1}></Col>
            </Row>
        )
    }
}