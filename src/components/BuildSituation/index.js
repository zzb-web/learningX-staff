import React from 'react';
import {Row,Col,Table, Button,Modal,Popconfirm,Checkbox} from 'antd';
import {Get,Post,Delete} from '../../fetch/data.js';
class BuildSituation extends React.Component{
    constructor(){
        super();
        this.state={
            data :　[],
            schoolIdName : {},
            showFirst : true,
            showSecond : false,
            detailData : [],
            detailData_2 : [],
            showDetailTable : false,
            markFlag : false,
            grade : '',
            classNum : ''
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/').then(resp=>{
            if(resp.status === 200){
                let schoolIdName = {}
                resp.data.map((item,index)=>{
                    schoolIdName[item.schoolID] = item.name;
                })
                this.setState({
                    schoolIdName : schoolIdName
                })
            }
        }).catch(err=>{

        })
        this.initial()
    }
    initial(){
        Get('/api/v3/staffs/batchDownloads/').then(resp=>{
            if(resp.status === 200){
                let timeArr = [];
                let dataObj = {};
                resp.data.map((item,index)=>{
                    timeArr.push(item.createTime);
                    dataObj[item.createTime] = item;
                })
                timeArr = timeArr.sort();

                let data = [];
                timeArr.map((item,index)=>{
                    data.push(dataObj[item])
                })
                this.setState({
                    data : data
                })
            }
        }).catch(err=>{

        })
    }
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var m = date.getMinutes() + ':';
        var s = date.getSeconds();
        return [Y+M+D,h+m+s];
    }
    getStatus(all,file,answer){
        let status = false;
        if(file === all && answer === all){
            status = true;
        }
        return status;
    }
    getRate(all,num){
        let rate = num/all * 100;
        return `${Math.round(rate)}%`;
    }
    detailHandle(data){
        this.setState({
            showFirst : false,
            showSecond : true,
            grade : data.grade,
            classNum : data.class,
            detailData : data.students
        })
    }
    deleteHandle(batchID){
        console.log(batchID)
        Delete(`/api/v3/staffs/batchDownloads/${batchID}/`).then(resp=>{
            if(resp.status === 200){
                this.initial();
            }
        }).catch(err=>{

        })
    }
    downloadDetail(data){
        this.setState({
            showDetailTable : true,
            detailData_2 : this._handleDetailData(data)
        })
    }
    _handleDetailData(data){
        if(data.length !== 0){
            let returnData = []
            data.map((item,index)=>{
                    item.problems.map((item2,index2)=>{
                        returnData.push({
                            titleNumber : item2.subIdx === -1 ? `${item2.index}` : `${item2.index}(${item2.subIdx})`,
                            titleSource : item2.subIdx === -1 ? `${item2.book}/P${item2.page}/T${item2.idx}` : `${item2.book}/P${item2.page}/T${item2.idx}/(${item2.subIdx})`,
                            titleBasic : item2.reason
                        })
                    })
            })
            console.log(returnData)
            return returnData;
        }
    }
    handleCancel = () => {
        this.setState({
            showDetailTable: false,
        });
      }
      goBack(){
        this.setState({
            showFirst : true,
            showSecond : false
        })
      }
    markChange(e){
        this.setState({
            markFlag : e.target.checked
        })
    }
    pickDown(){
        const {markFlag,grade,classNum,detailData} = this.state;
        let haslearnIDs = [];
        detailData.map((item,index)=>{
            haslearnIDs.push(item.learnID)
        })
        if(markFlag){
            let allReturnData = {}
            detailData.map((item,index)=>{
                allReturnData[item.learnID] = item.problems
            })
            let postData = [];
            var timestamp = Date.parse(new Date())/1000
            haslearnIDs.map((item,index)=>{
                postData.push({
                    time: timestamp,
                    type: 1,
                    learnID: item,
                    detail: JSON.stringify(allReturnData[item])
                })
            })
            Post('/api/v3/staffs/students/uploadTasks/',postData)
            }
            let postMsg_ = {
                grade: grade,	
                class: classNum,
                learnIDs: haslearnIDs
            }
        Post('/api/v3/staffs/students/getProbsAnsFilesZip/',postMsg_)
                                .then(resp=>{                                    
                                    var eleLink = document.createElement('a');
                                    eleLink.download = resp.data.URL;
                                    eleLink.href = resp.data.URL;
                                    eleLink.style.display = 'none';  
                                    document.body.appendChild(eleLink);

                                    eleLink.click();
                                    
                                    document.body.removeChild(eleLink);
                                }).catch(err=>{
                                   
                                })
    }
    render(){
        const {data,schoolIdName,showFirst,showSecond,detailData,detailData_2,showDetailTable} = this.state;
        const columns = [
            {
                title : '发起日期',
                dataIndex : 'date',
                key : 'date',
                width:'10%',
            },
            {
                title : '发起时间',
                dataIndex : 'time',
                key : 'time',
                width:'10%',
            },
            {
                title : '班级',
                dataIndex : 'class',
                key : 'class',
                width:'20%',
            },
            {
                title : '人数',
                dataIndex : 'people',
                key : 'people',
                width:'7%',
            },
            {
                title : '文档状态',
                dataIndex : 'status',
                key : 'status',
                width:'10%',
            },
            {
                title : '完成时间',
                dataIndex : 'endTime',
                key : 'endTime',
                width:'13%',
            },
            {
                title : '完成率',
                dataIndex : 'rate',
                key : 'rate',
                width:'10%',
            },
            {
                title : '文档批量处理',
                dataIndex : 'docHandle',
                key : 'docHandle',
                width:'10%',
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width:'10%'
            }
        ];
        let dataSource = [];
        data.map((item,index)=>{
            let status = this.getStatus(item.students.length,item.problemFilesFinished,item.answerFilesFinished);
            dataSource.push({
                key : index,
                date : this.timestampToTime(item.createTime)[0],
                time : this.timestampToTime(item.createTime)[1],
                class : `${schoolIdName[item.school]}${item.grade}(${item.class})班`,
                people : item.students.length,
                status : status ? 
                            <span style={{color:'#49a9ee'}}>已完成</span> : <span style={{color:'red'}}>未完成</span>,
                endTime : `${this.timestampToTime(item.finishTime)[0]} ${this.timestampToTime(item.finishTime)[1]}`,
                rate : <div>
                            <div>题目:{this.getRate(item.students.length,item.problemFilesFinished)}</div>
                            <div>答案:{this.getRate(item.students.length,item.answerFilesFinished)}</div>
                        </div>,
                docHandle : status ? <span style={{color:'#49a9ee',cursor:'pointer'}} onClick={this.detailHandle.bind(this,item)}>详情</span> :
                                    <span>详情</span>,
                operation : <span style={{color:'#49a9ee',cursor:'pointer'}} 
                                  onClick={this.deleteHandle.bind(this,item.batchID)}>删除记录</span>
            })
        })
        const columns_download = [
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width : '15%'
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width : '15%'
            },
            {
                title : '生成',
                dataIndex : 'download',
                key : 'download',
                width : '25%'
            },
            {
                title : '实际题量',
                dataIndex : 'trueNum',
                key : 'trueNum',
                width:'15%'
            },
            {
                title : '选题详情',
                dataIndex : 'selectDetail',
                key : 'selectDetail',
                width:'15%'
            },
            {
                title : '问题说明',
                dataIndex : 'question',
                key : 'question',
                width:'15%'
            }
        ]
        let dataSource_download = [];
        detailData.map((item,index)=>{
            let statusMsg = '';
            switch(item.answerStatusCode){
                case 200 : statusMsg = '正常生成文档';
                break;
                case 400 : statusMsg = '没有找到错题';
                break;
                case 403 : statusMsg = '存在未标记的纠错本，不允许生成新文档' ;                                 
                break;
                case 404 :  statusMsg = '题目或者答案文档缺失';                                 
                break;
                case 500 :  statusMsg = '内部未知错误';                                  
                break;
                case 504 : statusMsg = '处理超时';
                break;
                default :
            }

            let statusMsg2 = '';
            switch(item.problemStatusCode){
                case 200 : statusMsg2 = '正常生成文档';
                break;
                case 400 : statusMsg2 = '没有找到错题';
                break;
                case 403 : statusMsg2 = '存在未标记的纠错本，不允许生成新文档' ;                                 
                break;
                case 404 :  statusMsg2 = '题目或者答案文档缺失';                                 
                break;
                case 500 :  statusMsg2 = '内部未知错误';                                  
                break;
                case 504 : statusMsg2 = '处理超时';
                break;
                default :
            }

            dataSource_download.push({
                key : index,
                learnID : item.learnID,
                name : item.name,
                download : <div>
                                <span style={item.problemFileStatus ? {color:'#49a9ee'}:{color:'red'}}>纠错本</span>
                                <span style={item.answerFileStatus ? {color:'#49a9ee',marginLeft:20}:{color:'red',marginLeft:20}}>答案</span>
                            </div>,
                trueNum :item.problems.totalNum,
                selectDetail : <span style={{color:'#49a9ee',cursor:'pointer'}} onClick={this.downloadDetail.bind(this,item.problems.wrongProblems)}>详情</span> ,
                question : <div>
                                <div>纠错本:{statusMsg}</div>
                                <div>答案:{statusMsg2}</div>
                            </div>
            })
        })
        return(
            <div>
                <Row>
                    <Col span={1}></Col>
                    <Col span={22}>
                        {showFirst ? <Table columns={columns}
                                bordered={true}
                                pagination={false}
                                dataSource={dataSource}
                                scroll={{x:false,y:300}}/> : null}
                        {showSecond ? <div style={{width:'100%'}}>
                                    <Table columns={columns_download}
                                            bordered={true}
                                            pagination={false}
                                            dataSource={dataSource_download}
                                            style={{height:390}}
                                            scroll={{x:false,y:300}}/>
                                    <Button onClick={this.goBack.bind(this)}
                                            type='primary'
                                            size='large'
                                            style={{width:120,position:'relative',left:'30%',top:60}}>
                                            返回
                                    </Button>
                                    <div style={{marginLeft:'45%'}}><Checkbox onChange={this.markChange.bind(this)}>生成标记</Checkbox></div>
                                    <Popconfirm title="你确定吗？" onConfirm={this.pickDown.bind(this)} okText="确认" cancelText="取消">
                                        <Button type='primary' size='large' style={{width:230,marginLeft:'45%',marginTop:10}}>
                                            合并下载
                                        </Button>
                                    </Popconfirm>
                                 <Modal
                                        title='选题详情'
                                        wrapClassName="vertical-center-modal"
                                        visible={showDetailTable}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                        >
                                        <DownloadDetail detailData={detailData_2}/>
                                 </Modal>
                                                                                </div> : null}
                               
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        )
    }
}

export default BuildSituation;

class DownloadDetail extends React.Component{
    constructor(props){
        super();
        this.state={
           detailData : props.detailData
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
           detailData : nextProps.detailData
        })
    }
    render(){
        const {detailData} = this.state;
       const columns = [{
           title: '题目序号',
           dataIndex: 'titleNumber',
           key: 'titleNumber',
           width:'20%'
         }, {
           title: '题目来源',
           dataIndex: 'titleSource',
           key: 'titleSource',
           width:'30%'
         },{
           title: '选题依据',
           dataIndex: 'titleBasic',
           key: 'titleBasic',
           width:'50%'
         }];
         let dataSource = []
         if(detailData !== undefined){
           detailData.map((item,index)=>{
               dataSource.push({
                   key : index,
                   titleNumber : item.titleNumber,
                   titleSource : item.titleSource,
                   titleBasic : item.titleBasic
               })
           })
       }
        return(
           <Table  columns={columns}
           dataSource={dataSource}
           bordered
           scroll={{ y:400 }}
           pagination={false}/>
        )
    }
}