import React from "react";
import {Row,Col} from 'antd';
import Step1Component from './Step1Component.js'
import {Get} from '../../../fetch/data.js'
export default class Step1 extends React.Component{
    state={
        gradeWarning : false,
        classWarning : false,
        cityWarning : false,
        schoolWarning : false,
        schools : [],
        cityMsg :['','','',''],
        schoolMsg : '',
        classMsg : ['',''],
        name_schoolID : {}
    }

    schoolNameInput(value){
        if(value !== ''){
            this.setState({
                schoolWarning :false
            })
        }
        this.setState({
            schoolMsg : value
        })
    }
    dataMsgInput(cityMsg){
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
        this.setState({
                    schools : schools,
                    schoolsNames : schoolsNames,
                    name_schoolID : name_schoolID
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
    classSure(){
        const {cityMsg,schoolMsg,classMsg,name_schoolID} = this.state;
        console.log(cityMsg,schoolMsg,classMsg)
        let flag = true;
       if(cityMsg[1] === ''){
           this.setState({
            cityWarning : true
           })
           flag = false;
       }
       if(schoolMsg === ''){
           this.setState({
               schoolWarning : true
           })
           flag = false;
       }
       if(classMsg[0] === ''){
           this.setState({
             gradeWarning : true
           })
           flag = false;
       }
       if(classMsg[1] === ''){
            this.setState({
                classWarning : true
            })
            flag = false;
       }
       if(flag){
        let schoolID = name_schoolID[schoolMsg];
        let grade = classMsg[0];
        let msgClass = classMsg[1];
        let msg = `schoolID=${schoolID}&grade=${grade}&class=${msgClass}`
        Get(`/api/v3/staffs/classes/students/?${msg}`).then(resp=>{
            if(resp.status === 200){
                this.props.classSureHandle(resp.data,schoolID,schoolMsg,grade,msgClass)
            }
        }).catch(err=>{

        })
       }
    }
    render(){
        console.log(this.state)
            return(
                <Step1Component schoolNameInput={this.schoolNameInput.bind(this)}
                                    dataMsgInput={this.dataMsgInput.bind(this)}
                                    cityWarningHandle={this.cityWarningHandle.bind(this)}
                                    schoolMsg={this.schoolMsg.bind(this)}
                                    classMsgInput={this.classMsgInput.bind(this)}
                                    gradeWarningHandle={this.gradeWarningHandle.bind(this)}
                                    classWarningHandle={this.classWarningHandle.bind(this)}
                                    classSure={this.classSure.bind(this)}
                                    data={this.state}/>
            )
        
    }
}