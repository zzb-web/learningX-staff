import React from 'react';
import {Row ,Col, Input,Button, Select ,InputNumber, Table, Modal,Popconfirm, Radio} from 'antd';
import { withRouter } from 'react-router';
import {Get ,Post ,Delete} from '../../fetch/data.js'
import CityCommon from '../Common/cityCommon.js';
import GradeClassCommon from '../Common/gradeclassCommon.js';
const {Option} = Select;
class StudentInfoEntry extends React.Component{
    constructor(){
        super();
        this.state={
            schools : [],
            schoolsNames : [],
            name_schoolID : {},
            gradeWarning : false,
            classWarning : false,
            cityMsg :['','','','',''],
            schoolMsg :'',
            classMsg : ['',''],
            cityWarning : false,
            schoolWarning : false,
            showTable : false,
            data : [],
            studentName : ''
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
        this.setState({
                    schools : schools,
                    schoolsNames : schoolsNames,
                    name_schoolID : name_schoolID
                })
    }
    schoolNameInput(value){
        const {name_schoolID} = this.state;
        if(value !== ''){
            this.setState({
                schoolWarning :false
            })
        }
        this.setState({
            schoolMsg : name_schoolID[value]
        })
    }
    classMsgInput(classMsg){
        this.setState({
            classMsg : classMsg
        })
    }
    studentInput(e){
        this.setState({
            studentName : e.target.value
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
    searchHandle(){
        const {cityMsg, schoolMsg, classMsg,studentName} = this.state;
        if(cityMsg[1] === ''){
            this.setState({
                cityWarning : true
            })
        }else if(schoolMsg === ''){
            this.setState({
                schoolWarning : true
            })
        }else if(classMsg[0] === ''){
            this.setState({
                gradeWarning : true
            })
        }else if(classMsg[1] === '' || classMsg[1] === undefined){
            this.setState({
                classWarning : true
            })
        }else{
            const msg = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}&studentName=${studentName}`;
            Get(`/api/v3/staffs/classes/students/?${msg}`).then(resp=>{
                if(resp.status === 200){
                    this.setState({
                        data : resp.data.learnIDs,
                        showTable : true
                    })
                }
            }).catch(err=>{
                
            })            
        }
    }
    confirm(learnID){
            const {cityMsg, schoolMsg, classMsg,studentName} = this.state;
            Delete(`/api/v3/staffs/students/${learnID}/`).then(resp=>{
                if(resp.status === 200){
                    const msg = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}&studentName=${studentName}`;
                    Get(`/api/v3/staffs/classes/students/?${msg}`).then(resp=>{
                        if(resp.status === 200){
                            this.setState({
                                data : resp.data.learnIDs
                            })
                        }
                    }).catch(err=>{
                        
                    })  
                }
            }).catch(err=>{
    
            })
    }
    cancel(){
    }
    _add(m){return m<10?'0'+m:m }  
    _getDate(timeStamp) {   
      var time = new Date(timeStamp*1000);  
      var y = time.getFullYear();  
      var m = time.getMonth()+1;  
      var d = time.getDate();  
      return y +'-'+this._add(m)+'-'+this._add(d); 
    }
    render(){
        const {mode,data,dataPaper ,showTable ,schools ,schoolWarning,cityWarning,gradeWarning,classWarning} = this.state;
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].name}>{schools[i].name}</Option>);
        }
        const columns = [
            {
                title : '录入时间',
                dataIndex : 'createTime',
                key : 'createTime',
                width : '10%'
            },
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width : '10%'
            },
            {
                title : '年级',
                dataIndex : 'grade',
                key : 'grade',
                width : '10%'
            },
            {
                title : '班级',
                dataIndex : 'class',
                key : 'class',
                width : '10%'
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width : '10%'
            },
            {
                title : '性别',
                dataIndex : 'gender',
                key : 'gender',
                width : '10%'
            },
            {
                title : '预留一',
                dataIndex : 'aa',
                key : 'aa',
                width : '10%'
            },
            {
                title : '预留二',
                dataIndex : 'bbp',
                key : 'bb',
                width : '10%'
            },
            {
                title : '预留三',
                dataIndex : 'cc',
                key : 'cc',
                width : '10%'
            },
            {
                title : '操作',
                dataIndex : 'opera',
                key : 'opera',
                width : '10%'
            },
        ]
        const dataSource = [];
        data.map((item,index)=>{
            dataSource.push({
                keyc : index,
                createTime : this._getDate(item.createTime),
                learnID : item.learnID,
                grade : item.grade,
                class : item.class,
                name : item.name,
                gender : item.gender,
                aa : '',
                bb : '',
                cc : '',
                opera : <Popconfirm title="你确定要删除这个学生吗?" 
                                    onConfirm={this.confirm.bind(this,item.learnID)}
                                    onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                            <div className='picName'>删除</div>
                        </Popconfirm>
            })
        })
        return(
            <div>
                <div>
                    <Row>
                        <Col span={9}>
                            <CityCommon dataMsgInput={this.dataMsgInput.bind(this)}
                                        schoolMsg={this.schoolMsg.bind(this)}
                                        cityWarning={cityWarning}
                                        cityWarningHandle={this.cityWarningHandle.bind(this)}/>
                            <div style={{marginTop:30}}>
                                <span className='book-title'><span style={{color:'red'}}>*</span>学校全称:</span>
                                <Select
                                    combobox
                                    style={schoolWarning ? {width:300,marginLeft:20,border:'1px solid red'}:{width:300,marginLeft:20}}
                                    placeholder="填写学校的规范全称"
                                    onChange={this.schoolNameInput.bind(this)}
                                    tabIndex={0}
                                >
                                    {children}
                                </Select>
                            </div>
                        </Col>
                        <Col span={9}>
                            <GradeClassCommon classMsgInput={this.classMsgInput.bind(this)}
                                            gradeWarning = {gradeWarning}
                                            classWarning = {classWarning}
                                            gradeWarningHandle = {this.gradeWarningHandle.bind(this)}
                                            classWarningHandle = {this.classWarningHandle.bind(this)}/>
                            <div style={{marginTop:30}}>
                                <span className='book-title'>学生:</span>
                                <Input style={{width:300,marginLeft:20}}
                                        onChange={this.studentInput.bind(this)}/>
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className='search-btn-content'>
                                <Button type='primary'
                                        className='search-btn'
                                        onClick={this.searchHandle.bind(this)}>搜索</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='underline-hr'></div>
                { showTable ?

                        <div style={{marginTop:40}}>
                          <Table columns={columns}
                                                    bordered={true}
                                                    pagination={false}
                                                    dataSource={dataSource}
                                                    scroll={{x:false,y:300}}
                                                    /> 
                            
                        </div> : null
                }
            </div>
        )
    }
}

export default withRouter(StudentInfoEntry);