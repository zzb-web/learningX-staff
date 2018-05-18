import React from 'react';
import {Input} from 'antd';
import {Get} from '../../fetch/data.js';
class CityCommon extends React.Component{
    constructor(props){
        super();
        this.state={
            schools : [],
            schoolsNames : [],
            name_schoolID : {},
            gradeWarning : false,
            classWarning : false,
            cityMsg :['','','','',''],
            classMsg : ['',''],
            cityWarning : props.cityWarning
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            cityWarning : nextProps.cityWarning
        })
    }
    dataMsgInput(index,e){
        const {cityMsg} = this.state;
        cityMsg[index] = e.target.value;
        if(index === 1 && e.target.value !== ''){
            this.setState({
                cityWarning : false
            })
            this.props.cityWarningHandle(false)
        }
        this.setState({
            cityMsg
        })
        this.props.dataMsgInput(cityMsg)
        const msg = `province=${cityMsg[0]}&city=${cityMsg[1]}&district=${cityMsg[2]}&county=${cityMsg[3]}`;
        Get(`/api/v3/staffs/schools/?${msg}`)
            .then(resp=>{
                        var schoolsNames = [];
                        const {name_schoolID} = this.state;
                        resp.data.map((item,index)=>{
                            schoolsNames.push(item.name)
                            name_schoolID[item.name] = item.schoolID
                        })
                        this.props.schoolMsg(resp.data,schoolsNames,name_schoolID)
                }).catch(err=>{
        
                })
    }
    render(){
        const {cityWarning} = this.state;
        console.log(cityWarning)
        return(
            <div>
                <div>
                    <span className='book-title'>省市:</span>
                    <Input style={{width:120,marginLeft:20}} onChange={this.dataMsgInput.bind(this,0)}/><span style={{marginLeft:10}}>省</span>
                    <Input style={cityWarning?{width:120,marginLeft:20,borderColor:'red'}:{width:120,marginLeft:20}} onChange={this.dataMsgInput.bind(this,1)}/><span style={{marginLeft:10}}>市</span>
                </div>
                <div style={{marginTop:30}}>
                    <span className='book-title'>区县:</span>
                    <Input style={{width:120,marginLeft:20}} onChange={this.dataMsgInput.bind(this,2)}/><span style={{marginLeft:10}}>区</span>
                    <Input style={{width:120,marginLeft:20}} onChange={this.dataMsgInput.bind(this,3)}/><span style={{marginLeft:10}}>县</span>
                </div>
            </div>
        )
    }
}
export default CityCommon;