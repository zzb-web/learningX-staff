import React from 'react';
import {Select ,InputNumber} from 'antd';
const {Option} = Select;
class GradeClassCommon extends React.Component{
    constructor(props){
        super();
        this.state = {
            classMsg : ['',''],
            gradeWarning : props.gradeWarning,
            classWarning : props.classWarning
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            gradeWarning : nextProps.gradeWarning,
            classWarning : nextProps.classWarning
        })
    }
    classMsgInput(index,value){
        const {classMsg} = this.state;
        classMsg[index] = value;
        if(index === 0 && value !== ''){
            this.props.gradeWarningHandle(false)
        }
        if(index === 1 && value !== ''){
            this.props.classWarningHandle(false)
        }
        this.setState({
            classMsg
        })
        this.props.classMsgInput(classMsg)
    }
    render(){
        const calss = ['一','二','三','四','五','六','七','八','九','高一','高二','高三','高复']
        const {gradeWarning,classWarning} = this.state;
        return(
           <div>
               <div>
                    <span className='book-title'><span style={{color:'red'}}>*</span>年级:</span>
                    <Select style={gradeWarning ? {width:300,marginLeft:20,border:'1px solid red'}:{width:300,marginLeft:20}} 
                                            onChange={this.classMsgInput.bind(this,0)}>
                        {calss.map((item,index)=><Option key={index} value={item}>{item}</Option>)}
                    </Select>
                </div>
                <div style={{marginTop:30}}>
                    <span className='book-title'><span style={{color:'red'}}>*</span>班级:</span>
                    <InputNumber max={1000} min={0} style={classWarning ?{width:300,marginLeft:20,borderColor:'red'}:{width:300,marginLeft:20}}
                                                 onChange={this.classMsgInput.bind(this,1)}/>
                </div>
           </div>
        )
    }
}

export default GradeClassCommon;     