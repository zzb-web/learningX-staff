import React from 'react';
import {Get} from '../../fetch/data.js';
export default class SelectProduct extends React.Component{
    componentWillMount(){
        const {schoolID,grade,classNum} = this.props;
        //获取班级的产品
        let msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
       Get(`/api/v3/staffs/classes/productID/?${msg}`).then(resp=>{
           if(resp.status ===200){
            //    this.setState({
            //        curProductID :resp.data.productID
            //    })
           }
       }).catch(err=>{

       })
    }
    render(){
        return(
            <div>11111</div>
        )
    }
}