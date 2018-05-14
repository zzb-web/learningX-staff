import React from 'react';
import {Row ,Col, Input,Button, Icon ,Upload, Select ,InputNumber, Table} from 'antd';
import { withRouter } from 'react-router';
import {Get ,Post ,Delete} from '../../fetch/data.js'
import CityCommon from '../Common/cityCommon.js';
import GradeClassCommon from '../Common/gradeclassCommon.js';
const {Option} = Select;
class ClassInfoEntry extends React.Component{
    constructor(){
        super();
        this.state={
            schools : [],
            schoolsNames : [],
            name_schoolID : {},
            showClass : false,
            showStudent : false,
            gradeWarning : false,
            classWarning : false,
            cityMsg :['','','',''],
            schoolMsg : '',
            classMsg : ['',''],
            cityWarning : false,
            schoolWarning : false,
            columns : [],
            data : [],
            uid : '',
            showTable : false,
            url : '',
            downloadFlag : true
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/').then(resp=>{
            var schoolsNames = [];
            const {name_schoolID} = this.state;
            resp.data.map((item,index)=>{
                schoolsNames.push(item.name)
                name_schoolID[item.name] = item.schoolID
            })
           this.setState({
               schools : resp.data,
               schoolsNames : schoolsNames,
               name_schoolID : name_schoolID
           })
        }).catch(err=>{
            
        })
    }
    dataMsgInput(cityMsg){
        console.log(cityMsg)
        if(cityMsg[1]!== ''){
            this.setState({
                cityWarning : false
            })
        }
        this.setState({
            cityMsg : cityMsg
        })
    }
    cityWarningHandle(value){
        this.setState({
            cityWarning : value
        })
    }
    schoolMsg(schools ,schoolsNames, name_schoolID){
        console.log(schools ,schoolsNames, name_schoolID)
        this.setState({
                    schools : schools,
                    schoolsNames : schoolsNames,
                    name_schoolID : name_schoolID
                })
    }
    schoolNameInput(index,value){
        if(value !== ''){
            this.setState({
                schoolWarning :false
            })
        }
        this.setState({
            schoolMsg : value
        })
    }
    showClassHandle(){
        const {schoolMsg,schoolsNames,cityMsg} = this.state;
        if(cityMsg[1] === ''){
            this.setState({
                cityWarning : true
            })
        }else if(schoolMsg === ''){
            this.setState({
                schoolWarning : true
            })
        }else{
            const schoolName = schoolMsg;
            if(schoolsNames.indexOf(schoolName) === -1){
                var newSchool = {
                    province: cityMsg[0],
                    city: cityMsg[1],
                    district: cityMsg[2],
                    county: cityMsg[3],
                    name: schoolMsg
                }
                Post('/api/v3/staffs/schools/',newSchool).then(resp=>{
                    if(resp.status === 200){
                        const {name_schoolID} = this.state;
                        name_schoolID[schoolName] = resp.data.schoolID
                        console.log(name_schoolID)
                        this.setState({
                            name_schoolID,
                            cityWarning : false,
                            schoolWarning : false
                        })
                    }
                }).catch(err=>{
    
                })
            }else{
                console.log('55555555555555')
            }
            this.setState({
                showClass : true,
                cityWarning : false
            })
        } 
    }

    classMsgInput(classMsg){
       this.setState({
            classMsg : classMsg
        })
    }
    gradeWarningHandle(value){
        this.setState({
            gradeWarning : value
        })
    }
    classWarningHandle(value){
        this.setState({
            classWarning : value
        })
    }
    showStudentHandle(){
        const {classMsg} = this.state;
        if(classMsg[0] === ''){
            this.setState({
                gradeWarning : true
            })
        }else if(classMsg[1] === '' || classMsg[1] === undefined){
            this.setState({
                classWarning : true
            })
        }else{
            this.setState({
                showStudent : true
            })
        }  
    }
    onChange = ({ event, file, fileList }) => {
        console.log(file.status)
        console.log(file)
        console.log(fileList)
        switch (file.status) {
            case 'done':
                this.setState({
                    columns : file.response.columns,
                    data : file.response.data,
                    uid : file.response.uid,
                    showTable : true
                })
                break
            case 'uploading':
                // this.setState({ fileList })
                break
            case 'removed':
                const {uid} = this.state;
                Delete(`/api/v3/staffs/studentFile/${uid}/`)
                this.setState({
                    columns :[],
                    data : [],
                    showTable : false,
                    uid : ''
                })
                break;
            case 'error':
                this.setState({
                    columns :[],
                    data : [],
                    showTable : false
                })
                break
            default:
        }
    }
    saveHandle(){
        const {name_schoolID,schoolMsg,uid,classMsg} = this.state;
        let postMsg = {
            schoolID:name_schoolID[schoolMsg],
            grade: classMsg[0],
            class: classMsg[1],
            studentFile: uid,
        }
        console.log(postMsg)
        Post('/api/v3/staffs/students/',postMsg).then(resp=>{
            this.setState({
                url : resp.data.URL,
                downloadFlag : false
            })
        }).catch(err=>{

        })
    }
    render(){
        const {showClass , showStudent ,schools, cityWarning,schoolWarning, columns, 
            data ,showTable,url,downloadFlag,gradeWarning,classWarning} = this.state;
            const downLoadURL = url.split('xlsx/')[1];
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].name}>{schools[i].name}</Option>);
        }
        const calss = ['一','二','三','四','五','六','七','八','九','高一','高二','高三','F',]
        return(
            <div>
                <Row>
                    <Col span={4}></Col>
                    <Col span={16}>
                        <div style={{width:'100%',paddingTop:20,paddingBottom:30}}>
                            <Row>
                                <Col span={4}>
                                    <h2 className='title-font'>学校</h2>
                                </Col>
                                <Col span={16}>
                                    <CityCommon dataMsgInput={this.dataMsgInput.bind(this)}
                                        schoolMsg={this.schoolMsg.bind(this)}
                                        cityWarning={cityWarning}
                                        cityWarningHandle={this.cityWarningHandle.bind(this)}/>
                                    <div style={{marginTop:30}}>
                                        <span>学校全称:</span>
                                        <Select
                                            combobox
                                            style={schoolWarning ? {width:360,marginLeft:30,border:'1px solid red'}:{width:360,marginLeft:30}}
                                            placeholder="填写学校的规范全称"
                                            onChange={this.schoolNameInput.bind(this)}
                                            tabIndex={0}
                                        >
                                            {children}
                                        </Select>
                                    </div>
                                    <div style={{marginTop:30}}>
                                        <span style={{visibility:'hidden'}}>隐藏隐藏:</span>
                                        <Button style={{width:360,marginLeft:30}} onClick={this.showClassHandle.bind(this)}>
                                            <Icon type="plus" />添加班级
                                        </Button>
                                    </div>
                                </Col>
                                <Col span={4}></Col>
                            </Row>
                        </div>
                        <div className='underline-style'></div>
                        {showClass ? <div style={{width:'100%',paddingTop:20,paddingBottom:30}}>
                            <Row>
                                <Col span={4}>
                                    <h2 className='title-font'>班级</h2>
                                </Col>
                                <Col span={16}>
                                    <GradeClassCommon classMsgInput={this.classMsgInput.bind(this)}
                                                    gradeWarning={gradeWarning}
                                                    classWarning={classWarning}
                                                    gradeWarningHandle = {this.gradeWarningHandle.bind(this)}
                                                    classWarningHandle = {this.classWarningHandle.bind(this)}
                                                    />
                                    <div style={{marginTop:30}}>
                                        <span style={{visibility:'hidden'}}>隐藏隐藏:</span>
                                        <Button style={{width:360,marginLeft:30}} onClick={this.showStudentHandle.bind(this)}>
                                            <Icon type="plus" />添加学生
                                        </Button>
                                    </div>
                                </Col>
                                <Col span={4}></Col>
                            </Row>
                        </div> : null}
                        <div className='underline-style'></div>
                        {showStudent ?<div style={{width:'100%',paddingTop:20,paddingBottom:30}}>
                            <Row>
                                <Col span={4}>
                                    <h2 className='title-font'>学生</h2>
                                </Col>
                                <Col span={20}>
                                    
                                        <span>学生名单:</span>
                                        <Upload style={{marginLeft:30}}
                                                accept=".xlsx"
                                                action="/api/v3/staffs/studentFile/"
                                                // beforeUpload={(info)=>this.beforeUpload(info,index)}
                                                onChange={this.onChange}
                                                >
                                            <Button type='primary'>
                                            <Icon type="upload" />点击上传文件
                                            </Button>
                                        </Upload>

                                        <a href={url} download={downLoadURL} target="blank">
                                        <Button type='primary' 
                                                style={{position:'absolute',top:0,left:'70%',width:196}}
                                                disabled={downloadFlag}
                                                >学生账户列表下载</Button>
                                        </a>
                                   
                                </Col>
                            </Row>
                        </div> : null}
                        {showTable ? <div style={{marginTop:30}}>
                                        <div style={{textAlign:'center'}}>预览</div>
                                        <Table columns={columns}
                                                dataSource={data}/>
                                        <div style={{textAlign:'center'}}>
                                            <Button style={{width:332}} 
                                                    type='primary'
                                                    onClick={this.saveHandle.bind(this)}>保存</Button>
                                        </div>
                                        </div> : null}
                    </Col>
                    <Col span={4}></Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(ClassInfoEntry);