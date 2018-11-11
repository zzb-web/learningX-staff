import React from 'react';
import {Row,Col,Table,Button} from 'antd';
import {Post, Get} from '../../fetch/data.js';

export default class MarkSituation extends React.Component{
    constructor(){
        super();
        this.state={
            studentMarks : [],
            showMarkDetail : false,
            markName : '',
            postStudents :[]
        }
    }

    componentWillMount(){
        const {selectedLearnIDs} = this.props;
        let selectIdArr = [],postStudents=[];
        for(var k=0;k<selectedLearnIDs.length;k++){
            if(selectedLearnIDs[k].status){
                selectIdArr.push(selectedLearnIDs[k].learnID);
                postStudents.push({
                    name : selectedLearnIDs[k].name,
                    learnID : selectedLearnIDs[k].learnID
                })
            }
        }
        this.setState({
            postStudents : postStudents
        })

        Post(`/api/v3/staffs/students/getProblemRecords/`,selectIdArr).then(resp=>{
            let data = resp.data;
            let {learnIDName} = this.props;
            data.map((item,index)=>{
                item.name = learnIDName[item.learnID];
            })
            this.setState({
                studentMarks : data
            })
        })
    }

    _sortBy(way){
        return function(a,b){
           return  a[way] - b[way]
        }
    }
    getMarkDetail(data){
        this.setState({
            showMarkDetail : true,
            markDetailData : data,
            markName : data.name
        })
    }
    _getNoMarking(data){
        return data.wrongProblemStatus === 0 && data.paperStatus === 0
    }
    _getMarkingEvaluation(data){
        let status0 = 0;
        if(data.wrongProblemStatus === 0){
            status0 = status0 +1;
        }
        if(data.paperStatus === 0){
            status0 = status0 +1;
        }
        data.bookStatus.map((item,index)=>{
            if(item.status === 0){
                status0 = status0 +1;
            }
        })
        let allNum = data.bookStatus.length +2;
        let evaluation =  Math.round(status0/allNum* 10) ;
        return evaluation;
    }

    sureParam(){
        const {postStudents} = this.state;
         this.props.nextStep(postStudents)
    }

    render(){
        const {studentMarks,markDetailData,showMarkDetail,markName} = this.state;
        const columns_mark = [
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width:'20%',
                sorter: (a, b) => a.learnID - b.learnID
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width:'20%'
            },
            {
                title : '未标记',
                dataIndex : 'noMarking',
                key : 'noMarking',
                width:'20%',
                sorter: (a, b) => a.noMarking.length - b.noMarking.length
            },
            {
                title : '标记评估',
                dataIndex : 'markingEvaluation',
                key : 'markingEvaluation',
                width:'20%',
                sorter: (a, b) => a.markingEvaluation - b.markingEvaluation
            },
            {
                title : '标记详情',
                dataIndex : 'markingDetail',
                key : 'markingDetail',
                width:'20%'
            }
        ]
        let dataSource_mark = [];
        studentMarks.map((item,index)=>{
            dataSource_mark.push({
                key : index,
                learnID : item.learnID,
                name : item.name,
                noMarking : this._getNoMarking(item) ? '/' : <span style={{color:'red'}}>未标记</span>,
                markingEvaluation : this._getMarkingEvaluation(item),
                markingDetail : <span style={{color:'#108ee9',cursor:'pointer'}} onClick={this.getMarkDetail.bind(this,item)}>详情</span>
            })
        })


        dataSource_mark.sort(this._sortBy('markingEvaluation'));
        return(
            <Row>
                        <Col span={1}></Col>   
                        <Col span={14}>
                            <div >
                                <h2 style={{width:'100%',
                                    textAlign:'center',
                                    color: '#108ee9',
                                    paddingBottom:20}}>标记情况</h2>
                            </div>
                            <div style={{height:360}}>
                                <Table columns={columns_mark}
                                                    bordered={true}
                                                    pagination={false}
                                                    dataSource={dataSource_mark}
                                                    scroll={{x:false,y:300}}/>
                            </div>
                            <div style={{width:'100%',textAlign:'center',marginTop:20}}>
                                <Button type='primary'
                                        size='large' 
                                        style={{width:240,height:35}} onClick={this.sureParam.bind(this)}>下一步</Button>
                            </div>
                        </Col>   
                        <Col span={1}></Col>   
                        <Col span={7}>
                            {
                                showMarkDetail ? <div>
                                                    <h3 style={{padding:'20px 0 10px 0'}}><span className='markName'>{markName}</span>标记详情</h3>
                                                    <MarkDetail problemRecords={markDetailData}/>
                                                </div> : null
                            }
                        </Col>   
                        <Col span={1}></Col>   
                    </Row>
        )
    }
}

class MarkDetail extends React.Component{
    constructor(props){
        super();
        this.state={
            problemRecords : props.problemRecords
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
         problemRecords : nextProps.problemRecords
        })
    }
     render(){
         const {problemRecords} = this.state;
         let error = problemRecords.wrongProblemStatus === 0 ? true : false;
         let paper = problemRecords.paperStatus === 0 ? true : false;
         const booksArr = problemRecords.bookStatus || [];
         let booksStatus = [];
         booksArr.map((item,index)=>{
             booksStatus.push({
                 key : index+2,
                 number : item.book,
                 errorMark : <span style={item.status === 0 ?{color:'#49a9ee'}:{color:'#c0c0c0'}}>
                                      在近一周内{item.status === 0?'有':'无'}错题标记</span>
             })
         })
         const columns = [{
             title: '学习资料',
             dataIndex: 'number',
             key: 'number',
             width:'30%'
           }, {
             title: '错题标记情况',
             dataIndex: 'errorMark',
             key: 'errorMark',
             width:'70%'
           }];
         let dataSource = [
             { 
                 key: 0,
                 number: '纠错本',
                 errorMark: <span style={error?{color:'#49a9ee'}:{color:'red'}}>
                                 {error?'已':'未'}标记</span>
             },
             { 
                 key: 1,
                 number: '试卷',
                 errorMark:<span style={paper?{color:'#49a9ee'}:{color:'red'}}>
                                 {paper?'已':'未'}标记</span>
             },
         ]
         dataSource = dataSource.concat(booksStatus);
         return(
             <div className='errorTable'>
                 <Table  columns={columns}
                         dataSource={dataSource}
                         bordered
                         scroll={{ y: 300 }}
                         pagination={false}/>
             </div>
         )
     }
 }