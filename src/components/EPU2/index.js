import React from 'react';
import {Row,Col,Select,InputNumber,Button,Table,Switch,Input,Radio,Checkbox,Popconfirm} from 'antd';
import {Get,Post} from '../../fetch/data.js';
const {Option} = Select;
class EPU2 extends React.Component{
    constructor(){
        super();
        this.state={
            schools : [],
            grade : '',
            mode : 'error',
            classNum : 0,
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
            showSure : true
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
        Get(`/api/v3/staffs/students/?${msg}`)
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
                    allStudentNum : resp.data.total
                })
            }
        }).catch(err=>{

        })
    }
    }
    selectStudentSure(){
        const {learnIDs} = this.state;
        let selectedLearnIDs = [] ,selectIdArr = [];
        for(var k=0;k<learnIDs.length;k++){
            if(learnIDs[k].status){
                selectedLearnIDs.push(learnIDs[k].learnID);
                selectIdArr.push(learnIDs[k]);
            }
        }

        Post(`/api/v3/staffs/students/getProblemRecords/`,selectedLearnIDs).then(resp=>{
            let data = resp.data;
            data.map((item,index)=>{
                item.learnID = selectIdArr[index].learnID;
                item.name = selectIdArr[index].name;
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
            showSecondPage : true
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
        let evaluation =  Math.round(status0/allNum) * 10;
        return evaluation;
    }
    getMarkDetail(data){
        console.log(data)
        this.setState({
            showMarkDetail : true,
            markDetailData : data
        })
    }
    nextStep(){
        this.setState({
            showThirdPage : true,
            showSecondPage : false
        })
    }
    maxNumChange(value){
        this.setState({
            maxNum : value
        })
    }
    changePaper(value){
        this.setState({
            paper:Number(value)
        })
    }
    sureParam(){
        this.setState({
            showFourthPage : true,
            showThirdPage : false
        })

        this.setState({showSure : false})
            setTimeout(()=>{
                this.setState({showSure:true})
        },500)
        const {requestData, maxNum,sort,paper , selectedLearnIDs, allStudentNum,paperData} = this.state;
        var requestFlag = true;
        if(requestFlag){
            var allDetailData  = {};
            var allReturnData = {};
            selectedLearnIDs.map((item,idnex)=>{
                var url = `/api/v3/staffs/students/${item}/wrongProblems/?sort=1&max=${maxNum}`;
                Get(url)
                .then((response)=>{
                if(response.status === 200){
                    var data1 = {};
                    var detailData = [];
                    var wrongProblems = response.data.wrongProblems;
                    var questionNumber = response.data.totalNum;
                    if(sort === 1){
                        wrongProblems.map((item,index)=>{
                            item.problems.map((item2,index2)=>{
                                item2.type = `${item2.book}/P${item2.page}/${item2.idx}`
                            })
                        })
                    }
                    wrongProblems.map((item,index)=>{
                        item.problems.map((item2,index2)=>{
                            if(data1[item2.problemId+'_']===undefined){
                                data1[item2.problemId+'_']=[];
                                data1[item2.problemId+'_'].push(item2)
                            }else{
                                data1[item2.problemId+'_'].push(item2)
                            }
                        })
                    })
                    for(var key in data1){
                        detailData.push(data1[key])
                    }
                
                    allDetailData[item.learnID] = {
                        data : detailData,
                        questionNum : questionNumber,
                        status : ''
                    };
                    allReturnData[item.learnID] = response.data
                    this.setState({
                        allReturnData : allReturnData,
                    })
                }else if(response.status === 404){
                    allDetailData[item.learnID] = {
                        data : [],
                        questionNum : 0,
                        status : ''
                    };
                }
                })
                .catch(function (error) {
                });
            })
            
                /*this.setState({
                        showMaterials : false,
                        chooseAgain : true,
                        showDownContent : true,
                        showDetail : true,
                        allAnswerData : {},
                        allFileData : {},
                        generateFlag: true,
                        addDataFlag : true,
                        pickDownFlag : true,
                        allDetailData : allDetailData,
                        fileFlag : true
                    })
                    const {allStudentNum} = this.state;
                    var times = (allStudentNum+10)*100;
                setTimeout(()=>{
                    var fileDataArray = [];
                    var answerDataArray = [];
                    for(var key in allDetailData){
                        var obj = {}
                        obj.learnID = key
                        obj.params = this._getFileData(allDetailData[key].data,paper)
                        fileDataArray.push(obj);

                        var obj2 = {};
                        obj2.learnID = key;
                        obj2.params = this._getAnswerData(allDetailData[key].data,paper)
                        answerDataArray.push(obj2)
                    }

                    var finalRequestArray = [];
                    fileDataArray.map((item,index)=>{
                        finalRequestArray.push(item);
                        finalRequestArray.push(answerDataArray[index])
                    })
                    this.setState({
                        fileDataArray,
                        answerDataArray
                    })
                    const {allFileData,allAnswerData,statusMsgObj,learnIDName} = this.state;
                    (async () => {
                        for(let i=0;i<finalRequestArray.length;i++) {
                            const {generateFlag,allDetailData} = this.state;
                            if(generateFlag){
                                if( allDetailData[finalRequestArray[i].learnID].questionNum !==0){
                                let type = '';
                                if(i%2 ===0 ){
                                    type = 'getProblemsFile';
                                }else{
                                    type = 'getAnswersFile';
                                }
                                await Post(`/api/v3/staffs/students/${finalRequestArray[i].learnID}/${type}/`,finalRequestArray[i].params)
                                .then(resp=>{
                                    const {addDataFlag,pickDownFlag} = this.state;
                                    if(addDataFlag){
                                    let status = resp.status;
                                    let statusMsg = ''
                                    switch(status){
                                        case 200 : statusMsg = '成功';
                                        break;
                                        case 403 : statusMsg = '纠错本未标记' ;                                 
                                        break;
                                        case 404 :  statusMsg = '题目或者答案文档缺失';                                 
                                        break;
                                        case 500 :  statusMsg = '内部未知错误';                                  
                                        break;
                                        case 504 : statusMsg = '超时需再生成';
                                        break;
                                        default :
                                    }
                                    if(statusMsgObj[finalRequestArray[i].learnID] === undefined){
                                        statusMsgObj[finalRequestArray[i].learnID]=[];
                                        statusMsgObj[finalRequestArray[i].learnID].push(statusMsg)
                                    }else{
                                        statusMsgObj[finalRequestArray[i].learnID].push(statusMsg)
                                    }
                                    this.setState({
                                        statusMsgObj : statusMsgObj
                                    })
                                    let {haslearnIDs,fileSuccesNum,answerSuccessNum} = this.state;
                                        if(i%2 === 0){
                                            allFileData[finalRequestArray[i].learnID] = resp.data.pdfurl;
                                        
                                            if(status === 200){
                                                fileSuccesNum = fileSuccesNum+1
                                                if(haslearnIDs.indexOf(Number(finalRequestArray[i].learnID)) ===-1){
                                                    haslearnIDs.push(Number(finalRequestArray[i].learnID))
                                                }
                                            }
                                            let showMsg = `${finalRequestArray[i].learnID}号 ${learnIDName[finalRequestArray[i].learnID]} 正在请求`
                                            this.setState({
                                                allFileData : allFileData,
                                                currentMsg : showMsg,
                                                fileSuccesNum : fileSuccesNum
                                            })
                                        }else{
                                            if(status === 200){
                                                // for(var key in allFileData){
                                                //     if(allFileData[key] !== undefined){
                                                //         if(haslearnIDs.indexOf(Number(key))===-1){
                                                //             haslearnIDs.push(Number(key))
                                                //         }
                                                //     }
                                                // }
                                                answerSuccessNum = answerSuccessNum +1
                                                if(haslearnIDs.indexOf(Number(finalRequestArray[i].learnID)) ===-1){
                                                    haslearnIDs.push(Number(finalRequestArray[i].learnID))
                                                }
                                            }
                                            allAnswerData[finalRequestArray[i].learnID] = resp.data.pdfurl;
                                            this.setState({
                                                allAnswerData : allAnswerData,
                                                answerSuccessNum :answerSuccessNum
                                            })
                                        }
                                        this.setState({
                                            haslearnIDs : haslearnIDs
                                        })
                                        if(i<finalRequestArray.length-1){
                                            this.setState({
                                                pickDownFlag : true,
                                            })
                                        }else{
                                            this.setState({
                                                pickDownFlag : false,
                                                currentMsg : '所有学生请求完成',
                                            })
                                        }
                                    }
                                }).catch(err=>{
                                    const {addDataFlag} = this.state;
                                    if(addDataFlag){
                                        if(i%2 === 0){
                                            allFileData[finalRequestArray[i].learnID] = '';
                                                this.setState({
                                                    allFileData : allFileData,
                                                })
                                        }else{
                                            allAnswerData[finalRequestArray[i].learnID] = '';
                                                this.setState({
                                                    allAnswerData : allAnswerData
                                                })
                                        }
                                        if(i<finalRequestArray.length-1){
                                            this.setState({
                                                pickDownFlag : true
                                            })
                                        }else{
                                            this.setState({
                                                pickDownFlag : false
                                            })
                                        }
                                }
                                })
                            }else{
                                allAnswerData[finalRequestArray[i].learnID] = undefined;
                                allFileData[finalRequestArray[i].learnID] = undefined;
                                this.setState({
                                    allFileData,
                                    allAnswerData
                                })
                                if(i<finalRequestArray.length-1){
                                    this.setState({
                                        pickDownFlag : true
                                    })
                                }else{
                                    this.setState({
                                        pickDownFlag : false
                                    })
                                }
                            }
                        }
                        }
                    })();

                },times)*/
        }else{
            this.setState({
                showFail : true,
                showDetail : false,
                failMsg : '页码不正常'
            })
        }
        


    }
    pickDown(){
        const {markFlag,haslearnIDs,grade,classNum} = this.state;
        if(markFlag){
            const {allReturnData} = this.state;
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
                                    // console.log(resp.data.URL)
                                    // window.open(resp.data.URL);
                                    // this._downloadFile(resp.data.URL)
                                    // 创建隐藏的可下载链接
                                    
                                    var eleLink = document.createElement('a');
                                    eleLink.download = resp.data.URL;
                                    eleLink.href = resp.data.URL;
                                    eleLink.style.display = 'none';  
                                    document.body.appendChild(eleLink);

                                    eleLink.click();
                                    // 然后移除
                                    document.body.removeChild(eleLink);
                                }).catch(err=>{
                                   
                                })
    }
    stopGenerate(){
        this.setState({
            generateFlag : false,
            pickDownFlag : false,
            addDataFlag : false
        })
    }
    markChange(e){
        this.setState({
            markFlag : e.target.checked
        })
    }
    render(){
        const {schools,learnIDs,showStudentDetail,selectAllStundent,showFirstPage,showSecondPage,mode,
            errorQues,name,learnID,showMarkMsg,wrongProblems,errDate,materials,homeworkData,
            papers,paperData,showWarning,warningMsg,paperDate,showErrorTable,showHomeworkTable,
        bookID,page,showPaperTable,paperID,bookType,selectSchoolValue,studentMarks,markDetailData,
        showMarkDetail,showThirdPage,showFourthPage,pickDownFlag,showSure} = this.state;
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
                width:'20%'
            },
            {
                title : '标记评估',
                dataIndex : 'markingEvaluation',
                key : 'markingEvaluation',
                width:'20%'
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

        return(
            <div>
            { showFirstPage ?
                <Row>
                    <Col span={8}>
                        <div className='select-info'>
                                <h2 className='select-info-h2'>选择班级</h2>
                                <div className='select-info-content'>
                                    <div className='select-category-1'>
                                        <span>学校&nbsp;&nbsp;:</span>
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
                                        <span>年级&nbsp;&nbsp;:</span>
                                        <Select placeholder='选择年级' style={{ width: 240, marginLeft:'10px' }} onChange={this.gradeSelect.bind(this)}>
                                            {allGrage.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
                                        </Select>
                                    </div>
                                    <div className='select-category-1'>
                                        <span>班级&nbsp;&nbsp;:</span>
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
                            <div style={{width:'100%',textAlign:'center',marginTop:20}}>
                                <Button type='primary'
                                        size='large' 
                                        style={{width:240,height:35}} onClick={this.nextStep.bind(this)}>下一步</Button>
                            </div>
                        </Col>   
                        <Col span={1}></Col>   
                        <Col span={7}>
                            {
                                showMarkDetail ? <div>
                                                    <h3 style={{padding:'20px 0 10px 0'}}>标记详情</h3>
                                                    <MarkDetail problemRecords={markDetailData}/>
                                                </div> : null
                            }
                        </Col>   
                        <Col span={1}></Col>   
                    </Row> : null
                }
                {
                    showThirdPage ? <Row>
                                        <Col span={1}></Col>
                                        <Col span={8}>
                                           <div>
                                                <h2 style={{width:'100%',
                                                            textAlign:'center',
                                                            color: '#108ee9',
                                                            paddingBottom:20,
                                                            marginLeft:-30}}>设置参数</h2>
                                           </div>
                                            <div className='select-category-1'>
                                                <span>题量控制&nbsp;&nbsp;:</span>
                                                <InputNumber placeholder='控制题目数量的最大值'
                                                            defaultValue = {10} 
                                                            min={1} 
                                                            style={{ width: 240, marginLeft:'10px'}} 
                                                            onChange={this.maxNumChange.bind(this)}/>
                                            </div>
                                            <div className='select-category-1'>
                                                <span>纸张大小&nbsp;&nbsp;:</span>
                                                <Select defaultValue='2' placeholder='选择输出纸张的大小' style={{ width: 240, marginLeft:'10px' }} onChange={this.changePaper.bind(this)}>
                                                    <Option value='1'>A3</Option>
                                                    <Option value='2'>A4</Option>
                                                </Select>
                                            </div>
                                            <div className='select-category-1' style={{marginTop:100}}>
                                                    <span></span>
                                                    <Button type="primary" 
                                                        size='large' 
                                                        style={{width:240,height:35,marginLeft:'10px'}} 
                                                        onClick={this.sureParam.bind(this)}
                                                        disabled={!showSure}>>确定</Button>
                                            </div>
                                        </Col>
                                        <Col span={15}></Col>
                                    </Row> : null
                }
                {
                    showFourthPage ?<Row>
                                        <Col span={1}></Col>
                                        <Col span={22}>
                                                    <div className='studentTable'>
                                                    <div style={{height:370}}>
                                                        <Table 
                                                            columns={columns_download}
                                                            bordered={true}
                                                            pagination={false}
                                                            // dataSource={dataSource}
                                                            scroll={{x:false,y:300}}
                                                            // rowClassName={(record, index)=>{
                                                            //     if(record.isCorrect){
                                                            //         return ''
                                                            //     }else{
                                                            //         return 'wrong-row'
                                                            //     }  
                                                            // }}
                                                            />
                                                    </div>

                                                    <div style={{textAlign:'center',marginTop:50}}>
                                                        
                                                    <span style={{position:'relative',display:'inline-block'}}>
                                                        <div className='mark-position'><Checkbox onChange={this.markChange.bind(this)}>生成标记</Checkbox></div>
                                                            <Popconfirm title="你确定吗？" onConfirm={this.pickDown.bind(this)} okText="确认" cancelText="取消">
                                                                <Button type='primary' size='large' style={{width:230,marginRight:10}}
                                                                    disabled={pickDownFlag}>
                                                                    合并下载
                                                                </Button>
                                                            </Popconfirm>
                                                    </span>
                                                        <Popconfirm title="你确定吗？" onConfirm={this.stopGenerate.bind(this)} okText="确认" cancelText="取消">
                                                            <Button size='large'
                                                                style={{width:230,marginLeft:10,background:'#FF0000',color:'#fff'}}>停止</Button>
                                                        </Popconfirm>
                                                    </div>
                                                
                                            </div>
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                      : null
                }
                </div>
        )
    }
}
export default EPU2;

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
