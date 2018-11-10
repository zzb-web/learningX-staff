import React from 'react';
import {Row,Col,Select,InputNumber,Button,Table,Switch,Input,Radio} from 'antd';
import {Get} from '../../fetch/data.js';
const {Option} = Select;


export default class SelectStudents extends React.Component{
    constructor(){
        super();
        this.state={
            schools : [],
            grade : '',
            classNum : 0,
            schoolID : '',
            schoolName : '',
            selectSchoolValue : '',
            selectAllStundent : true,
            learnIDs : [],
            showStudentDetail : false,
            learnIDName : {},
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/')
        .then(resp=>{
          if(resp.status === 200){
            this.setState({
                schools : resp.data
            })
          }else{
            this.setState({
                schools : []
            })
          }
        }).catch(err=>{
            this.setState({
                schools : []
            })
        })
    }
    schoolSelect(value){
        let currentId = value.split('_')[1]
        let currentName = value.split('_')[0]
        this.setState({
            selectSchoolValue : value,
            schoolID : currentId,
            schoolName : currentName
        })
    }
    gradeSelect(value){
        this.setState({
            grade : value
        })
    }
    classInput(value){
        this.setState({
            classNum : value
        })
    }
    selectStudentSure(){
        const {learnIDs,learnIDName,schoolID,grade,classNum} = this.state;
        let selectedLearnIDs = [];
        learnIDs.map((item,index)=>{
            if(item.status){
                selectedLearnIDs.push(item)
            }
        })
        this.setState({
            selectedLearnIDs : selectedLearnIDs,
            allStudentNum : selectedLearnIDs.length,
            showStudentDetail : false,
            showTipMsg : false
        })
        this.props.selectStudentSure(selectedLearnIDs,learnIDName,schoolID,grade,classNum)
    }

    chooseAllStudent(value){
        const {learnIDs} = this.state;
            learnIDs.map((item,index)=>{
                item.status = value
            })
            // console.log(learnIDs)
        this.setState({
            learnIDs:learnIDs ,
            selectAllStundent : value
        })
    }
    chooseStudent(index,value){
        const {learnIDs} = this.state;
        learnIDs[index].status = value;
        this.setState({
            learnIDs
        })
    }
    getStudentMsg(){
        const {schoolID, grade, classNum,learnIDName} = this.state;
        if(schoolID === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择学校'
            })
        }else if(grade === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择年级'
            })
        }else if(classNum === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择班级'
            })
        }else if(schoolID !=='' && grade !=='' && classNum !==''){
            const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
        Get(`/api/v3/staffs/students/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                resp.data.learnIDs.map((item,index)=>{
                    learnIDName[item.learnID] = item.name
                })
              
                let learnIDsHandle = resp.data.learnIDs;
                learnIDsHandle.map((item,index)=>{
                    item.status = true;
                })
                this.setState({
                    showStudentDetail : true,
                    showTipMsg : true,
                    showLeftLine : true,
                    allStudentNum : resp.data.total,
                    learnIDs : learnIDsHandle,
                    learnIDName : learnIDName,
                    showFail : false,
                })
            }
        }).catch(err=>{

        })
    }
    }

    render(){
        const {selectSchoolValue,schools,allStudentNum,selectAllStundent,learnIDs,showStudentDetail} = this.state;
        const allGrage = ['一','二','三','四','五','六','七','八','九','高一','高二','高三','高复'];
        const columns_student = [
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width:'30%',
                sorter: (a, b) => a.learnID - b.learnID
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width:'30%'
            },
            {
                title : <Switch style={{width:60}} checkedChildren="全 选" unCheckedChildren="全不选" onChange={this.chooseAllStudent.bind(this)} checked={selectAllStundent}/>,
                dataIndex : 'status',
                key : 'status',
                width:'40%'
            },
        ]
        let dataSource_student = [];
        learnIDs.map((item,index)=>{
            dataSource_student.push({
                key : index,
                learnID : item.learnID,
                name : item.name,
                status : <Switch style={{width:60}} checkedChildren="√" unCheckedChildren="×" onChange={this.chooseStudent.bind(this,index)} checked={item.status}/>,
            })
        })
        return(
            <Row>
            <Col span={8}>
                <div className='select-info'>
                        <h2 className='select-info-h2'>选择班级</h2>
                        <div className='select-info-content'>
                            <div className='select-category-1'>
                                <span>学校&nbsp;&nbsp;:</span>
                                <Select style={{ width: 240, marginLeft:'10px' }} 
                                    onChange={this.schoolSelect.bind(this)}
                                    combobox
                                    value={selectSchoolValue.split('_')[0]}
                                    placeholder="填写学校的规范全称"
                                    tabIndex={0}>
                                    {schools.map((item,index)=><Option value={`${item.name}_${item.schoolID}`} key={index}>{item.name}</Option>)}
                                 </Select>
                            </div>
                            <div className='select-category-1'>
                                <span>年级&nbsp;&nbsp;:</span>
                                <Select placeholder='选择年级' style={{ width: 240, marginLeft:'10px' }} onChange={this.gradeSelect.bind(this)}>
                                    {allGrage.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
                                </Select>
                            </div>
                            <div className='select-category-1'>
                                <span>班级&nbsp;&nbsp;:</span>
                                <InputNumber placeholder='输入班级' style={{ width: 240, marginLeft:'10px' }} onChange={this.classInput.bind(this)}/>
                            </div>
                            <div className='select-category-1'>
                                <span></span>
                                <Button type="primary" 
                                        size='large' 
                                        style={{width:240,height:35,marginLeft:'10px'}} 
                                        onClick={this.getStudentMsg.bind(this)}>选择学生</Button>
                            </div>
                        </div>
                        {
                            this.state.showFail? <div className='save-success'>
                                                    <span style={{color:'red'}}>{this.state.failMsg}</span>
                                                    </div> : null
                        }
                         {
                            this.state.showTipMsg ?<div className='save-success'>
                                                        <span style={{color:'#108ee9'}}>学生总数:{allStudentNum}</span>
                                                    </div> : null
                        }
                    </div>
            </Col>
            <Col span={2}></Col>
            <Col span={13}>
                {
                    showStudentDetail ? <div>
                        <Table columns={columns_student}
                                        bordered={true}
                                        pagination={false}
                                        dataSource={dataSource_student}
                                        scroll={{x:false,y:300}}/>
                        <div className='sureBtn'>
                            <Button type="primary" 
                                    size='large' 
                                    style={{width:240,height:35,marginLeft:'10px'}}
                                    onClick={this.selectStudentSure.bind(this)}>确定</Button>
                        </div>
                        
                    </div> : null
                }
            </Col>
            <Col span={1}></Col>
        </Row> 
        )
    }
}