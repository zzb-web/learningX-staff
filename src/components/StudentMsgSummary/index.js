import React from 'react';
import {Row ,Col, Input,Button, Icon ,Upload, Select ,InputNumber, Table} from 'antd';
import { withRouter } from 'react-router';
import {Get ,Post ,Delete} from '../../fetch/data.js'
import CityCommon from '../Common/cityCommon.js';
import GradeClassCommon from '../Common/gradeclassCommon.js';
const {Option} = Select;
class StudentMsgSummary extends React.Component{
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
        console.log(schools ,schoolsNames, name_schoolID)
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
        const {cityMsg, schoolMsg, classMsg} = this.state;
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
            console.log(schoolMsg)
            const msg = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}`;
            Get(`/api/v3/staffs/classes/books/?${msg}`).then(resp=>{
                if(resp.status === 200){

                }
            }).catch(err=>{
                
            })
        }
    }

    render(){
        const {schools ,schoolWarning,cityWarning,gradeWarning,classWarning} = this.state;
        console.log(cityWarning)
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].name}>{schools[i].name}</Option>);
        }
        return(
            <div>
                <Row>
                    <Col span={9}>
                        <CityCommon dataMsgInput={this.dataMsgInput.bind(this)}
                                    schoolMsg={this.schoolMsg.bind(this)}
                                    cityWarning={cityWarning}
                                    cityWarningHandle={this.cityWarningHandle.bind(this)}/>
                        <div style={{marginTop:30}}>
                            <span><span style={{color:'red'}}>*</span>学校全称:</span>
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
                    </Col>
                    <Col span={9}>
                        <GradeClassCommon classMsgInput={this.classMsgInput.bind(this)}
                                          gradeWarning = {gradeWarning}
                                          classWarning = {classWarning}
                                          gradeWarningHandle = {this.gradeWarningHandle.bind(this)}
                                          classWarningHandle = {this.classWarningHandle.bind(this)}/>
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
        )
    }
}

export default withRouter(StudentMsgSummary);