import React from 'react';
import {Select, Button ,InputNumber} from 'antd';
import {Get} from '../../../fetch/data.js';
const {Option} = Select;
class HomeWork extends React.Component{
    constructor(props){
        super();
        this.state={
            materials : props.materials,
            bookID : '',
            page : 0,
            learnID : props.learnID
        }
    }
    componentWillReceiveProps(nextProps){
      this.setState({
        materials : nextProps.materials,
        learnID : nextProps.learnID
      })
    }
    bookChange(value){
        this.setState({
            bookID : value
        })
    }
    pageChange(value){
        this.setState({
            page : value
        })
    }
    sureHandle(){
        const {bookID ,page,learnID} = this.state;
        const msg = `book=${bookID}&page=${page}`;
        Get(`/api/v3/staffs/students/${learnID}/bookProblems/?${msg}`).then(resp=>{
            this.props.getHomeworkData(resp.data)
        }).catch(err=>{

        })
    }
    render(){
        const {materials} = this.state;
        let children = [];
        materials.map((item,index)=>{
            children.push(
                <Option key={index} value={item.bookID}>{item.name}</Option>
            )
        })
        return(
            <div style={{marginTop:40}}>
                <div>
                    <span className='common-title'>学习资料名称:</span>
                    <Select style={{width:240,marginLeft:10}} onChange={this.bookChange.bind(this)}>
                       {children}
                    </Select>
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'>页码:</span>
                    <InputNumber style={{width:240,marginLeft:10}} onChange={this.pageChange.bind(this)}/>
                </div>
                <div style={{marginTop:30}}>
                    <span className='common-title'></span>
                    <Button type='primary' 
                    style={{width:240,marginLeft:10}}
                    onClick={this.sureHandle.bind(this)}
                    >确定</Button>
                </div>
            </div>
        )
    }
}

export default HomeWork;