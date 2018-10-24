import React from 'react';
import {Select,Button} from 'antd';
import CityCommon from '../../Common/cityCommon.js'
import GradeClassCommon from '../../Common/gradeclassCommon.js';
const {Option} = Select;
class Step1 extends React.Component {
    constructor(props){
        super();
        this.state = {
            gradeWarning : props.data.gradeWarning,
            classWarning : props.data.classWarning,
            cityWarning : props.data.cityWarning,
            schoolWarning : props.data.schoolWarning,
            schools : props.data.schools,
            cityMsg :props.data.cityMsg,
            schoolMsg : props.data.schoolMsg,
            classMsg : props.data.classMsg,
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            gradeWarning : nextProps.data.gradeWarning,
            classWarning : nextProps.data.classWarning,
            cityWarning : nextProps.data.cityWarning,
            schoolWarning : nextProps.data.schoolWarning,
            schools : nextProps.data.schools,
            cityMsg :nextProps.data.cityMsg,
            schoolMsg : nextProps.data.schoolMsg,
            classMsg : nextProps.data.classMsg,
        })
    }
    render(){
        const {gradeWarning,classWarning, cityWarning,schoolWarning,schools} = this.state;
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].name}>{schools[i].name}</Option>);
        }
        return(
                <div>
                    <h2 className='select-info-h2'>选择班级</h2>
                    <div style={{marginTop:30}}>
                        <CityCommon dataMsgInput={this.props.dataMsgInput}
                                        schoolMsg={this.props.schoolMsg}
                                        cityWarning={cityWarning}
                                        cityWarningHandle={this.props.cityWarningHandle}/>
                    </div>
                    <div style={{marginTop:30}}>
                                        <span className='book-title'><span style={{color:'red'}}>*</span>学校全称:</span>
                                        <Select
                                            combobox
                                            style={schoolWarning ? {width:300,marginLeft:20,border:'1px solid red'}:{width:300,marginLeft:20}}
                                            placeholder="填写学校的规范全称"
                                            onChange={this.props.schoolNameInput}
                                            tabIndex={0}
                                        >
                                            {children}
                                        </Select>
                                    </div>
                    <div style={{marginTop:30}}>
                        <GradeClassCommon classMsgInput={this.props.classMsgInput}
                                            gradeWarning = {gradeWarning}
                                            classWarning = {classWarning}
                                            gradeWarningHandle = {this.props.gradeWarningHandle}
                                            classWarningHandle = {this.props.classWarningHandle}/>
                    </div>
                    <div style={{marginTop : 30}}>
                        <span className='book-title'></span>
                        <Button type='primary' 
                                size='large' 
                                style={{width:300,marginLeft:20}}
                                onClick={this.props.classSure}>确认</Button>
                    </div>
                </div>
        )
    }
}

export default Step1;