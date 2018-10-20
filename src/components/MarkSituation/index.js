import React from 'react';
import {Row,Col,Select,InputNumber,Button,Table,Switch,Input,Radio,Checkbox,Popconfirm,Modal} from 'antd';
import {Get,Post} from '../../fetch/data.js';
const {Option} = Select;
class MarkSituation extends React.Component{
    constructor(){
        super();
        this.state={
            schools : [],
            grade : '',
            mode : 'error',
            classNum : '',
            schoolID : '',
            schoolName : '',
            showFail :false,
            showStudentDetail : false,
            showLeftLine : false,
            allStudentNum : 0,
            selectAllStundent : true,
            learnIDs : [],
            selectedLearnIDs :[],
            learnIDName : {},
            showFirstPage : true,
            showSecondPage : false,
            name : '',
            learnID : '',
            errorQues : [],
            showMarkMsg : false,
            wrongProblems :[],
            errDate : '',
            materials : [],
            homeworkData : [],
            papers : [],
            paperData : [],
            paperDate : '',
            showErrorTable : false,
            showHomeworkTable : false,
            showPaperTable : false,
            bookID : '',
            page : '',
            paperID : '',
            bookType : 0,
            selectSchoolValue : '',
            studentMarks : [],
            showMarkDetail : false,
            showThirdPage : false,
            showFourthPage : false,
            maxNum : 10,
            paper : 2,
            pickDownFlag : true,
            showSure : true,
            statusMsgObj : {},
            currentMsg : '',
            fileSuccesNum : 0,
            answerSuccessNum : 0,
            tableData : [],
            showDetailTable : false,
            haslearnIDs : [],
            showTipMsg : false,
            allDetailData : {},
            markName : '',
            batchID : '',
            postStudents : []
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/')
        .then(resp=>{
          if(resp.status === 200){
            this.setState({
                schools : resp.data
            })
          }else{
            this.setState({
                schools : []
            })
          }
        }).catch(err=>{
            this.setState({
                schools : []
            })
        })
    }
    schoolSelect(value){
        let currentId = value.split('_')[1]
        let currentName = value.split('_')[0]
        this.setState({
            selectSchoolValue : value,
            schoolID : currentId,
            schoolName : currentName
        })
    }
    gradeSelect(value){
        this.setState({
            grade : value
        })
    }
    classInput(value){
        this.setState({
            classNum : value
        })
    }
    getStudentMsg(){
        const {schoolID, grade, classNum,learnIDName} = this.state;
        if(schoolID === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择学校'
            })
        }else if(grade === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择年级'
            })
        }else if(classNum === ''){
            this.setState({
                showFail : true,
                failMsg : '请选择班级'
            })
        }else if(schoolID !=='' && grade !=='' && classNum !==''){
            const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
        Get(`/api/v3/staffs/classes/students/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                resp.data.learnIDs.map((item,index)=>{
                    learnIDName[item.learnID] = item.name
                })
                let learnIDsHandle = resp.data.learnIDs;
                learnIDsHandle.map((item,index)=>{
                    item.status = true;
                })
                this.setState({
                    learnIDs : learnIDsHandle,
                    showFail : false,
                    showStudentDetail : true,
                    showLeftLine : true,
                    allStudentNum : resp.data.total,
                    showTipMsg : true
                })
            }
        }).catch(err=>{

        })
    }
    }
    selectStudentSure(){
        const {learnIDs} = this.state;
        let selectedLearnIDs = [] ,selectIdArr = [],postStudents=[];
        for(var k=0;k<learnIDs.length;k++){
            if(learnIDs[k].status){
                selectedLearnIDs.push(learnIDs[k]);
                selectIdArr.push(learnIDs[k].learnID);
                postStudents.push({
                    name : learnIDs[k].name,
                    learnID : learnIDs[k].learnID
                })
            }
        }

        Post(`/api/v3/staffs/students/getProblemRecords/`,selectIdArr).then(resp=>{
            let data = resp.data;
            let {learnIDName} = this.state;
            data.map((item,index)=>{
                // item.learnID = selectedLearnIDs[index].learnID;
                // item.name = selectedLearnIDs[index].name;
                item.name = learnIDName[item.learnID];
            })
            this.setState({
                studentMarks : data
            })
        })

       

        this.setState({
            selectedLearnIDs : selectedLearnIDs,
            allStudentNum : selectedLearnIDs.length,
            showStudentDetail : false,
            showFirstPage : false,
            showSecondPage : true,
            showTipMsg : false,
            postStudents : postStudents
        })
    }
    chooseAllStudent(value){
        const {learnIDs} = this.state;
            learnIDs.map((item,index)=>{
                item.status = value
            })
            // console.log(learnIDs)
        this.setState({
            learnIDs:learnIDs ,
            selectAllStundent : value
        })
    }
    chooseStudent(index,value){
        const {learnIDs} = this.state;
        learnIDs[index].status = value;
        this.setState({
            learnIDs
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
    getMarkDetail(data){
        console.log(data)
        this.setState({
            showMarkDetail : true,
            markDetailData : data,
            markName : data.name
        })
    }

    handleCancel = () => {
        this.setState({
            showDetailTable: false,
        });
      }
    _sortBy(way){
        return function(a,b){
           return  a[way] - b[way]
        }
    }
    render(){
        const {schools,learnIDs,showStudentDetail,selectAllStundent,showFirstPage,showSecondPage,
           selectSchoolValue,studentMarks,markDetailData,detailData,showDetailTable
            ,showMarkDetail,allStudentNum,markName} = this.state;
        const allGrage = ['一','二','三','四','五','六','七','八','九','高一','高二','高三','高复'];
        const columns_student = [
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width:'30%',
                sorter: (a, b) => a.learnID - b.learnID
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width:'30%'
            },
            {
                title : <Switch style={{width:60}} checkedChildren="全 选" unCheckedChildren="全不选" onChange={this.chooseAllStudent.bind(this)} checked={selectAllStundent}/>,
                dataIndex : 'status',
                key : 'status',
                width:'40%'
            },
        ]
        let dataSource_student = [];
        learnIDs.map((item,index)=>{
            dataSource_student.push({
                key : index,
                learnID : item.learnID,
                name : item.name,
                status : <Switch style={{width:60}} checkedChildren="√" unCheckedChildren="×" onChange={this.chooseStudent.bind(this,index)} checked={item.status}/>,
            })
        })

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
        // dataSource_mark.sort((a,b)=>{a.dataSource_mark-b.dataSource_mark})

        return(
            <div>
            { showFirstPage ?
                <Row>
                    <Col span={8}>
                        <div className='select-info'>
                                <h2 className='select-info-h2'>选择班级</h2>
                                <div className='select-info-content'>
                                    <div className='select-category-1'>
                                        <span><span style={{color:'red'}}>*</span>学校&nbsp;&nbsp;:</span>
                                        <Select style={{ width: 240, marginLeft:'10px' }} 
                                            onChange={this.schoolSelect.bind(this)}
                                            combobox
                                            value={selectSchoolValue.split('_')[0]}
                                            placeholder="填写学校的规范全称"
                                            tabIndex={0}>
                                            {schools.map((item,index)=><Option value={`${item.name}_${item.schoolID}`} key={index}>{item.name}</Option>)}
                                         </Select>
                                    </div>
                                    <div className='select-category-1'>
                                        <span><span style={{color:'red'}}>*</span>年级&nbsp;&nbsp;:</span>
                                        <Select placeholder='选择年级' style={{ width: 240, marginLeft:'10px' }} onChange={this.gradeSelect.bind(this)}>
                                            {allGrage.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
                                        </Select>
                                    </div>
                                    <div className='select-category-1'>
                                        <span><span style={{color:'red'}}>*</span>班级&nbsp;&nbsp;:</span>
                                        <InputNumber placeholder='输入班级' style={{ width: 240, marginLeft:'10px' }} onChange={this.classInput.bind(this)}/>
                                    </div>
                                    <div className='select-category-1'>
                                        <span></span>
                                        <Button type="primary" 
                                                size='large' 
                                                style={{width:240,height:35,marginLeft:'10px'}} 
                                                onClick={this.getStudentMsg.bind(this)}>选择学生</Button>
                                    </div>
                                </div>
                                {
                                    this.state.showFail? <div className='save-success'>
                                                            <span style={{color:'red'}}>{this.state.failMsg}</span>
                                                            </div> : null
                                }
                                {
                                    this.state.showTipMsg ?<div className='save-success'>
                                                                <span style={{color:'#108ee9'}}>学生总数:{allStudentNum}</span>
                                                            </div> : null
                                }
                            </div>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={13}>
                        {
                            showStudentDetail ? <div>
                                <div >
                                    <h2 style={{width:'100%',
                                        textAlign:'center',
                                        color: '#108ee9',
                                        paddingBottom:20}}>选择学生</h2>
                                </div>
                                <Table columns={columns_student}
                                                bordered={true}
                                                pagination={false}
                                                dataSource={dataSource_student}
                                                scroll={{x:false,y:300}}/>
                                <div className='sureBtn'>
                                    <Button type="primary" 
                                            size='large' 
                                            style={{width:240,height:35,marginLeft:'10px'}}
                                            onClick={this.selectStudentSure.bind(this)}>确定</Button>
                                </div>
                                
                            </div> : null
                        }
                    </Col>
                    <Col span={1}></Col>
                </Row> : null}
                {
                    showSecondPage ?<Row>
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
                    </Row> : null
                }
                                 <Modal
                                        title='选题详情'
                                        wrapClassName="vertical-center-modal"
                                        visible={showDetailTable}
                                        onCancel={this.handleCancel}
                                        footer={null}
                                        >
                                        <DownloadDetail detailData={detailData}/>
                                 </Modal>
                </div>
        )
    }
}
export default MarkSituation;

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
