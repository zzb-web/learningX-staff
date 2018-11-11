import React from 'react';
import {Get} from '../../fetch/data.js';
import { Row,Col,Table, Modal,Switch,Button} from 'antd';
import moment from 'moment';
const {confirm} = Modal;
function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D;
}
export default class SelectProduct extends React.Component{
    constructor(){
        super();
        this.state={
            productMsg : [],
            visible : false,
            productData :  {
                problemCode:'E',
                gradation:1,
                depth:1,
                name: '', 
                level: '', 
                object: '',
                epu: 0,
                problemMax: '',
                pageType: 'A4',
                problemSource : [],
                serviceType: '',
                serviceLauncher: '', 
                serviceStartTime: (moment()/1000).valueOf(),
                serviceEndTime: (moment()/1000).valueOf(), 
                serviceTimes: 0,
                serviceDuration: '',
                deliverType: '',
                deliverPriority: '', 
                deliverTime: [{
                    day: '', 
                    time:'',
                },{
                    day: '',
                },{
                    day: '',
                    time:'',
                }],
                deliverExpected: '',
                price: '',
                subject: '',
                grade: '',
                wrongProblemStatus : 0,
                problemType : [],
                sameTypeMax : 0,
                sameTypeSource :[],
                columnCount: '' ,
                borderControl: '',
                exceptionHandler : ''
            },
        }
    }
    componentWillMount(){
        const {schoolID,grade,classNum} = this.props;
        //获取班级的产品
        let msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
       Get(`/api/v3/staffs/classes/productID/?${msg}`).then(resp=>{
           if(resp.status ===200){
               const productID = resp.data.productID;
                productID.map((item,index)=>{
                    const {productMsg} = this.state;
                    Get(`/api/v3/staffs/products/${item}/`).then(response=>{
                        let data = response.data;
                        data.selected = false;
                        productMsg.push(data);
                        this.setState({
                            productMsg : productMsg
                           })
                    }).catch(error=>{

                    })
                })
           }
       }).catch(err=>{

       })
    }
    detailHandle(data){
        this.setState({
            productData : data,
            visible : true
        })
    }
    handleCancel() {
        this.setState({
          visible: false,
        });
      }
    switchOpera(idx,value){
        let {productMsg} = this.state;
        // productMsg[index].selected = value;
        productMsg.map((item,index)=>{
            if(idx === index){
                item.selected = value
            }else{
                item.selected = false
            }
        })
        this.setState({
            productMsg : productMsg
        })
    }
    createTask(){
        this.showConfirm()
    }
    showConfirm() {
        const that = this;
        confirm({
          title: '请确认检查',
          onOk() {
            that.submitOK()
          },
          onCancel() {
            
          },
        });
    }
    submitOK(){
        const {productMsg} = this.state;
        let hasEpu1 = false , hasSelectProductID=[];
        for(var i=0;i<productMsg.length;i++){
            if(productMsg[i].epu == 1 && productMsg[i].selected){
                hasEpu1 = true;
                break;
            }
        }

        productMsg.map((item,index)=>{
            if(item.selected){
                hasSelectProductID.push(item.productID)
            }
        })
        
        this.props.createTask(hasEpu1,hasSelectProductID);
    }
    render(){
        const {productMsg, visible, productData} = this.state;
        const EPUs = ['EPU1','EPU2','EPU3'];
        const gradations = ['第1层 题目','第2层 过程','第3层 引导'];
        const depths = ['第1代 错题','第2代 类型','第3代 考试'];
        const weeks = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        const errStatus = ['现在仍错的题','曾经错过的题'];
        const handles = ['全部标记为√再生成','全部标记为×再生成','不生成'];
        const columns = [
            {
                title: '产品名称',
                dataIndex: 'name',
                key: 'name',
                width:'20%'
            },
            {
                title: '服务状态',
                dataIndex: 'serviceState',
                key: 'serviceState',
                width:'10%'
            },
            {
                title: '处理器',
                dataIndex: 'cpu',
                key: 'cpu',
                width:'20%'
            },
            {
                title: '文档形式',
                dataIndex: 'document',
                key: 'document',
                width:'15%'
            },
            {
                title: '其他信息',
                dataIndex: 'otherMsg',
                key: 'otherMsg',
                width:'10%'
            },
            {
                title: '产品详情',
                dataIndex: 'detail',
                key: 'detail',
                width:'10%'
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width:'15%'
            }
        ]
        console.log('ppppppppppppp',productMsg)
        let dataSource = [];
        productMsg.map((item,index)=>{
            dataSource.push({
                key : index,
                name : item.name,
                serviceState : <span style={item.status?{color:'#48D61D'}:{color:'#FF3547'}}>{item.status?'运行':'停止'}</span>,
                cpu : <span>{EPUs[item.epu-1]}/题量控制: {item.problemMax}</span>,
                document : <span>{item.pageType}/{item.columnCount}</span>,
                otherMsg : <div>
                                <div>学科:{item.subject}</div>
                                <div>年级:{item.grade}</div>
                            </div>,
                detail : <span style={{color:'#108ee9',cursor:'pointer'}} 
                                onClick={this.detailHandle.bind(this,item)}>详情</span>,
                operation : <Switch style={{width:60}} checkedChildren="√" 
                                    unCheckedChildren="×" 
                                    checked={item.selected} onChange={this.switchOpera.bind(this,index)} />
            })
        })
        return(
            <Row>
                <Col span={2}></Col>
                <Col span={20}>
                    <Table columns={columns}
                                bordered={true}
                                pagination={false}
                                dataSource={dataSource}
                                scroll={{x:false,y:300}}
                                    />
                    <div style={{width:'100%',textAlign:'center',marginTop:30}}>
                        <Button type='primary' size='large' width={240} onClick={this.createTask.bind(this)}>发起生成任务</Button>
                    </div>
                     <Modal
                        title='详情'
                        visible={visible}
                        footer={null}
                        onCancel={this.handleCancel.bind(this)}
                        >
                        <div className='person-msg'>
                            <div>服务状态:{productData.status?<span style={{color:'#48D61D'}}>运行</span>:<span style={{color:'#FF3547'}}>停止</span>}</div>
                            <div><span>问题:错题学习</span></div>
                            <div>{`层次:${gradations[productData.gradation-1]}`}</div>
                            <div>{`深度:${depths[productData.depth-1]}`}</div>
                            <div>{`总体:产品名称:${productData.name}/产品级别:${productData.level}/产品对象:${productData.object}`}</div>
                            {
                                productData.epu === 3 ? <div>{`处理器:EPU:${EPUs[productData.epu-1]}/题量控制:${productData.problemMax}/错题状态:${errStatus[productData.wrongProblemStatus-1]}
                                /题目种类:${productData.problemType}/同类题量:${productData.sameTypeMax}/同类来源:${productData.sameTypeSource}`}</div>:
                                <div>{`处理器:EPU:${EPUs[productData.epu-1]}/题量控制:${productData.problemMax}/纸张大小:${productData.pageType}`}</div>
                            }
                            <div>{`错题源:${productData.problemSource}`}</div>
                            {
                                productData.epu === 3 ? <div>{`文档形式:纸张大小:${productData.pageType}/分数栏:${productData.columnCount}/边界控制:${productData.borderControl}`}</div> : null
                            }
                            <div>{`服务:服务类型:${productData.serviceType}/服务发起:${productData.serviceLauncher}/
        服务时段:${timestampToTime(productData.serviceStartTime)}~${timestampToTime(productData.serviceEndTime)}`}</div>
                            <div>{`文档交付:交付类型:${productData.deliverType}/${productData.deliverMsg}`}</div>
                            {
                                productData.epu === 3 ? <div>{`异常处理:${handles[productData.exceptionHandler-1]}`}</div> : null
                            }
                            <div>{`价格:${productData.price}元`}</div>
                            <div>{`其他信息:学科:${productData.subject}/年级:${productData.grade}`}</div>
                        </div>
                     </Modal>
                </Col>
                <Col span={2}></Col>
            </Row>
        )
    }
}