import React from 'react';
import Step1 from './Step1Container.js';
import {Row,Col,Table,Button} from 'antd';

class Step1Final extends React.Component{
    constructor(){
        super();
        this.state={
            showTable : false,
            allStudentNum : 0,
            showTipMsg : false,
            schoolID : '',
            schoolMsg : '',
            grade : '',
            msgClass : '',
            students : {
                learnIDs : []
            },
            cityMsg : ''
        }
    }
    classSureHandle(data,schoolID,schoolMsg,grade,msgClass,cityMsg){
        this.setState({
            showStep1 : false,
            showStep2 : true,
            students : data,
            allStudentNum : data.total,
            schoolID : schoolID,
            grade : grade,
            msgClass : msgClass,
            showTipMsg : true,
            showTable : true,
            schoolMsg : schoolMsg,
            cityMsg : cityMsg
        })
    }
    nextStep(){
        const{schoolID,schoolMsg,grade,msgClass,allStudentNum,cityMsg} = this.state;
        this.props.firstPageDone(schoolID,schoolMsg,grade,msgClass,allStudentNum,cityMsg)
    }
    render(){
        const {allStudentNum,showTipMsg,students,showTable} = this.state;
        const columns = [
            {
                title:'学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width : '60%'
            },
            {
                title:'姓名',
                dataIndex : 'name',
                key : 'name',
                width : '40%'
            },
        ]
        const dataSource = [];
        students.learnIDs.map((item,index)=>{
            dataSource.push({
                key : index,
                learnID : item.learnID,
                name : item.name
            })
        })
        return(
            <div>
                <Row>
                <Col span={1}></Col>
                <Col span={10}>
                    <Step1 classSureHandle={this.classSureHandle.bind(this)}/>
                    {
                        showTipMsg ?<div className='save-success'>
                                                    <span style={{color:'#108ee9'}}>学生总数:{allStudentNum}</span>
                                                </div> : null
                            }
                </Col>
                <Col span={2}></Col>
                <Col span={10}>
                    {
                        showTable ? <div style={{marginTop:50,textAlign:'center'}}>
                                        <Table columns={columns}
                                            bordered={true}
                                            pagination={false}
                                            dataSource={dataSource}
                                            scroll={{x:false,y:300}}
                                                />
                                         <Button size='large' 
                                                 type='primary'
                                                 style={{width:300,marginTop:30}}
                                                 onClick={this.nextStep.bind(this)}>下一步</Button>
                                    </div> : null
                    }
                </Col>
                <Col span={1}></Col>
            </Row>
            </div>
        )
    }
}

export default Step1Final;