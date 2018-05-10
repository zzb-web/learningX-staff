import React from 'react';
import {Input} from 'antd';
class CityCommon extends React.Component{
    dataMsgInput(index,e){
        this.props.dataMsgInput(index,e)
    }
    render(){
        const {cityWarning} = this.props;
        return(
            <div>
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
            </div>
        )
    }
}
export default CityCommon;