import React from 'react';
import {Row ,Col, Input,Button, Icon ,Upload, Select ,InputNumber, Table} from 'antd';
import { withRouter } from 'react-router';
import {Get ,Post} from '../../fetch/data.js'
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
            schoolMsg :['','','','',''],
            classMsg : ['',''],
            cityWarning : false,
            columns : [],
            data : [],
            uid : '',
            showTable : false
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/').then(resp=>{
            var schoolsNames = [];
            var schoolID_name = {}
            resp.data.map((item,index)=>{
                schoolsNames.push(item.name)
                schoolID_name[item.name] = item.schoolID
            })
           this.setState({
               schools : resp.data,
               schoolsNames : schoolsNames,
               schoolID_name : schoolID_name
           })
        }).catch(err=>{

        })
    }
   
    dataMsgInput(index,e){
        const {schoolMsg} = this.state;
        schoolMsg[index] = e.target.value;
        this.setState({
            schoolMsg : schoolMsg
        })
    }
    schoolNameInput(index,value){
        console.log(value)
        const {schoolMsg} = this.state;
        schoolMsg[index] = value[0];
        this.setState({
            schoolMsg : schoolMsg
        })
    }
    showClassHandle(){
        const {schoolMsg,schoolsNames} = this.state;
        if(schoolMsg[1] === ''){
            this.setState({
                cityWarning : true
            })
            
        }else{
            const schoolName = schoolMsg[4];
            if(schoolsNames.indexOf(schoolName) === -1){
                Post('/api/v3/staffs/schools/',newSchool).then(resp=>{
                    
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
        var newSchool = {
            province: schoolMsg[0],
            city: schoolMsg[1],
            district: schoolMsg[2],
            county: schoolMsg[3],
            name: schoolMsg[4]
        }
      
    }

    classMsgInput(index,value){
        const {classMsg} = this.state;
        classMsg[index] = value
        console.log(classMsg)
        this.setState({
            classMsg : classMsg
        })
    }

    showStudentHandle(){
        this.setState({
            showStudent : true
        })
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
                this.setState({
                    columns :[],
                    data : [],
                    showTable : false
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
    render(){
        
        const {showClass , showStudent ,schools, cityWarning, columns, data ,showTable} = this.state;
        console.log(columns)



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
                                    <div>
                                        <span><span style={{visibility:'hidden'}}>隐藏</span>省市:</span>
                                        <Input style={{width:120,marginLeft:30}} onChange={this.dataMsgInput.bind(this,0)}/><span style={{marginLeft:30}}>省</span>
                                        <Input style={cityWarning?{width:120,marginLeft:30,borderColor:'red'}:{width:120,marginLeft:30}} onChange={this.dataMsgInput.bind(this,1)}/><span style={{marginLeft:30}}>市</span>
                                    </div>
                                    <div style={{marginTop:30}}>
                                        <span><span style={{visibility:'hidden'}}>隐藏</span>区县:</span>
                                        <Input style={{width:120,marginLeft:30}} onChange={this.dataMsgInput.bind(this,2)}/><span style={{marginLeft:30}}>区</span>
                                        <Input style={{width:120,marginLeft:30}} onChange={this.dataMsgInput.bind(this,3)}/><span style={{marginLeft:30}}>县</span>
                                    </div>
                                    <div style={{marginTop:30}}>
                                        <span>学校全称:</span>
                                        {/* <Input style={{width:360,marginLeft:30}} onChange={this.dataMsgInput.bind(this,4)}/> */}
                                        <Select
                                            mode="tags"
                                            style={{ width:360,marginLeft:30}}
                                            placeholder="填写学校的规范全称"
                                            onChange={this.schoolNameInput.bind(this,4)}
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
                                    <div>
                                        <span><span style={{visibility:'hidden'}}>隐藏</span>年级:</span>
                                        {/* <Input style={{width:360,marginLeft:30}} onChange={this.classMsgInput.bind(this,0)}/> */}
                                        <Select style={{width:360,marginLeft:30}} onChange={this.classMsgInput.bind(this,0)}>
                                            {calss.map((item,index)=><Option key={index} value={item}>{item}</Option>)}
                                        </Select>
                                    </div>
                                    <div style={{marginTop:30}}>
                                        <span><span style={{visibility:'hidden'}}>隐藏</span>班级:</span>
                                        <InputNumber max={1000} min={1} style={{width:360,marginLeft:30}} onChange={this.classMsgInput.bind(this,1)}/>
                                    </div>
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
                                        <Button style={{position:'absolute',top:0,left:'50%',width:130}}>取消</Button>
                                        <Button type='primary' style={{position:'absolute',top:0,left:'70%',width:196}}>学生账户列表下载</Button>
                                   
                                </Col>
                            </Row>
                        </div> : null}
                        {showTable ? <div style={{marginTop:30}}>
                                        <div style={{textAlign:'center'}}>预览</div>
                                        <Table columns={columns}
                                                dataSource={data}/>
                                        <div style={{textAlign:'center'}}>
                                            <Button style={{width:332}} type='primary'>保存</Button>
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