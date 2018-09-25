import React from 'react';
import {Row,Col,Select,InputNumber,Button,Table,Switch,Input,Radio,Checkbox,Popconfirm,Modal} from 'antd';
import {Get,Post} from '../../fetch/data.js';
const {Option} = Select;
class EPU2 extends React.Component{
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
            batchID : ''
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
            const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}&epu=2&serviceType=全包`;
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

        //获取批量生成纠错本的任务ID
        const {schoolID, grade, classNum} = this.state;
        let postMsg = {
            school: schoolID,
            grade: grade,
            class: classNum,
            students : postStudents
        }
        Post(`/api/v3/staffs/batchDownloads/`,postMsg).then(resp=>{
            if(resp.status === 200){
                this.setState({
                    batchID : resp.data.batchID
                })
            }
        }).catch(err=>{

        })

        this.setState({
            selectedLearnIDs : selectedLearnIDs,
            allStudentNum : selectedLearnIDs.length,
            showStudentDetail : false,
            showFirstPage : false,
            showSecondPage : true,
            showTipMsg : false
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
            // showThirdPage : false,
            showSecondPage : false
        })
        this.setState({showSure : false})
            setTimeout(()=>{
                this.setState({showSure:true})
        },500)
        const {requestData, maxNum,paper ,batchID, selectedLearnIDs, allStudentNum,paperData} = this.state;
        var requestFlag = true;
        if(requestFlag){
            var allReturnData = {};
            var sort = 1;
            (async () => {
                for(let k =0;k<selectedLearnIDs.length;k++){
                    var url = `/api/v3/staffs/students/${selectedLearnIDs[k].learnID}/wrongProblems/?sort=1&batchID=${batchID}`;
                await Get(url)
                    .then((response)=>{
                        let {allDetailData} = this.state;
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
                    
                        allDetailData[selectedLearnIDs[k].learnID] = {
                            data : detailData,
                            questionNum : questionNumber,
                            status : ''
                        };
                        allReturnData[selectedLearnIDs[k].learnID] = response.data
                        this.setState({
                            allReturnData : allReturnData,
                        })
                    }else if(response.status === 404){
                        allDetailData[selectedLearnIDs[k].learnID] = {
                            data : [],
                            questionNum : 0,
                            status : ''
                        };
                        
                    }
                    this.setState({
                        allDetailData : allDetailData,
                    })
                    })
                    .catch(function (error) {
                    });
                    if(k >= (selectedLearnIDs.length-1)){
                        this._getPDF()
                    }
                }
            })();
            
                this.setState({
                
                        allAnswerData : {},
                        allFileData : {},
                        generateFlag: true,
                        addDataFlag : true,
                        pickDownFlag : true,
                        // allDetailData : allDetailData,
                        fileFlag : true
                    })
        }else{
            this.setState({
                showFail : true,
                showDetail : false,
                failMsg : '页码不正常'
            })
        }
    }
    _getPDF(){
        const {requestData, maxNum,paper , selectedLearnIDs, allStudentNum,paperData,allDetailData} = this.state;
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
                        finalRequestArray.push(answerDataArray[index]);
                    })
                    this.setState({
                        fileDataArray,
                        answerDataArray
                    })
                    const {allFileData,allAnswerData,statusMsgObj,learnIDName,batchID} = this.state;
                    (async () => {
                        for(let i=0;i<finalRequestArray.length;i++) {
                            const {generateFlag,allDetailData} = this.state;
                            if(generateFlag){
                                let showMsg = `${finalRequestArray[i].learnID}号 ${learnIDName[finalRequestArray[i].learnID]} 正在请求`
                                this.setState({
                                    currentMsg : showMsg
                                })
                                if( allDetailData[finalRequestArray[i].learnID].questionNum !==0){
                                let type = '';
                                if(i%2 ===0 ){
                                    type = 'getProblemsFile';
                                }else{
                                    type = 'getAnswersFile';
                                }
                                let postMsg = {
                                    batchID : batchID,
                                    problems : finalRequestArray[i].params.problems
                                };
                                await Post(`/api/v3/staffs/students/${finalRequestArray[i].learnID}/${type}/`,postMsg)
                                .then(resp=>{
                                    const {addDataFlag,pickDownFlag} = this.state;
                                    if(addDataFlag){
                                    let status = resp.status;
                                    let statusMsg = ''
                                    // switch(status){
                                    //     case 200 : statusMsg = '成功';
                                    //     break;
                                    //     case 403 : statusMsg = '纠错本未标记' ;                                 
                                    //     break;
                                    //     case 404 :  statusMsg = '题目或者答案文档缺失';                                 
                                    //     break;
                                    //     case 500 :  statusMsg = '内部未知错误';                                  
                                    //     break;
                                    //     case 504 : statusMsg = '超时需再生成';
                                    //     break;
                                    //     default :
                                    // }
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
                                            if(status === 200){
                                                allFileData[finalRequestArray[i].learnID] = 1;
                                                fileSuccesNum = fileSuccesNum+1;
                                                this.setState({
                                                    fileSuccesNum : fileSuccesNum
                                                })
                                                if(haslearnIDs.indexOf(Number(finalRequestArray[i].learnID)) ===-1){
                                                    haslearnIDs.push(Number(finalRequestArray[i].learnID))
                                                }
                                            }else{
                                                allFileData[finalRequestArray[i].learnID] = 0;
                                            }
                                            // let showMsg = `${finalRequestArray[i].learnID}号 ${learnIDName[finalRequestArray[i].learnID]} 正在请求`
                                            this.setState({
                                                allFileData : allFileData,
                                                // currentMsg : showMsg,
                                            })
                                        }else{
                                            if(status === 200){
                                                allAnswerData[finalRequestArray[i].learnID] = 1;
                                                answerSuccessNum = answerSuccessNum +1
                                                this.setState({
                                                    answerSuccessNum :answerSuccessNum
                                                })
                                                if(haslearnIDs.indexOf(Number(finalRequestArray[i].learnID)) ===-1){
                                                    haslearnIDs.push(Number(finalRequestArray[i].learnID))
                                                }
                                                
                                            }else{
                                                allAnswerData[finalRequestArray[i].learnID] = 0;
                                            }
                                            
                                            this.setState({
                                                allAnswerData : allAnswerData,
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
                                            allFileData[finalRequestArray[i].learnID] = 0;
                                                this.setState({
                                                    allFileData : allFileData,
                                                })
                                        }else{
                                            allAnswerData[finalRequestArray[i].learnID] = 0;
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
                                allAnswerData[finalRequestArray[i].learnID] = 0;
                                allFileData[finalRequestArray[i].learnID] = 0;
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
    _getFileData(currentData,paper){
        var dataObj = {};
        var dataParams = []
        currentData.map((item,i)=>{
            item.map((item2,i2)=>{
                      dataObj[item2.problemId+'_'+i2] = {
                        index : item2.index,
                        subIdx : item2.subIdx,
                        full : item2.full,
                        type : item2.type
                        }                              
            })
        })
        for(var key in dataObj){
            if(dataParams[dataObj[key].type] === undefined){
                dataParams[dataObj[key].type] = [];
                dataParams[dataObj[key].type].push({
                                    problemId: key.split('_')[0],
                                    subIdx: dataObj[key].subIdx,
                                    index: dataObj[key].index,
                                    full:dataObj[key].full,
                                })
            }else{
                dataParams[dataObj[key].type].push({
                    problemId: key.split('_')[0],
                    subIdx: dataObj[key].subIdx,
                    index: dataObj[key].index,
                    full:dataObj[key].full,
                })
            }
        }
        if(paper === ''){
            var params = [];
            for(var key in dataParams){
                params.push({
                    type : key,
                    problems : dataParams[key]
                })
            }
        }else{
            var problems = [];
            var paperString;
            if(paper === 1){
                paperString = 'A3';
            }else{
                paperString = 'A4';
            }
            for(var key in dataParams){
                problems.push({
                    type : key,
                    problems : dataParams[key]
                })
            }
            var params = {
                pageType : paperString,
                problems : problems
            }
        }
        return params;
    }
    _getAnswerData(currentData,paper){
        //  console.log(currentData)
        var dataObj = {};
        var dataParams = []
        currentData.map((item,i)=>{
            item.map((item2,i2)=>{
                dataObj[item2.problemId+'_'] = item2
            })
        })
        if(paper === ''){
            var dataParams = []
            for(var key in dataObj){
                dataParams.push({
                    problemId: key.split('_')[0],
                    index: dataObj[key],
                })
            }
        }else{
            var problems = [];
            var paperString;
            if(paper === 1){
                paperString = 'A3';
            }else{
                paperString = 'A4';
            }
            // console.log(dataObj)
            for(var key in dataObj){
                problems.push({
                    problemId: dataObj[key].problemId,
                    index: dataObj[key].index,
                    location : dataObj[key].type
                })
            }
            var dataParams = {
                pageType : paperString,
                problems : problems
            }
        }
        // console.log(dataParams)
        return dataParams;
     }
     getFileAgain(key){
        let currentId = key;
       let {fileDataArray,statusMsgObj,haslearnIDs,allFileData} = this.state;
       let data = {};
       for(var i=0;i<=fileDataArray.length;i++){
           if(fileDataArray[i].learnID === currentId){
               data = fileDataArray[i].params;
               break;
           }
        }
        Post(`/api/v3/staffs/students/${currentId}/getProblemsFile/`,data).then(resp=>{
            let status = resp.status;
            let statusMsg = ''
            // switch(status){
            //     case 200 : statusMsg = '成功';
            //     break;
            //     case 403 : statusMsg = '纠错本未标记' ;                                 
            //     break;
            //     case 404 :  statusMsg = '题目或者答案文档缺失';                                 
            //     break;
            //     case 500 :  statusMsg = '内部未知错误';                                  
            //     break;
            //     case 504 : statusMsg = '超时需再生成';
            //     break;
            //     default :
            // }
            
            statusMsgObj[currentId][0] = statusMsg;
            let {fileSuccesNum} = this.state;
            if(status === 200){
                allFileData[currentId] = 1;
                if(haslearnIDs.indexOf(Number(currentId)) === -1){
                    haslearnIDs.push(Number(currentId))
                }
                fileSuccesNum = fileSuccesNum+1
            }else{
                allFileData[currentId] = 0;
            }
            this.setState({
                statusMsgObj : statusMsgObj,
                allFileData : allFileData,
                haslearnIDs : haslearnIDs,
                fileSuccesNum : fileSuccesNum
            })

        }).catch(err=>{

        })
       
    }
    getAnswerAgain(key){
        let currentId = key;
       let {answerDataArray,statusMsgObj,haslearnIDs,allAnswerData} = this.state;
       let data = {};
       for(var i=0;i<=answerDataArray.length;i++){
           if(answerDataArray[i].learnID === currentId){
               data = answerDataArray[i].params;
               break;
           }
        }
        Post(`/api/v3/staffs/students/${currentId}/getAnswersFile/`,data).then(resp=>{
            let status = resp.status;
            let statusMsg = ''
            // switch(status){
            //     case 200 : statusMsg = '成功';
            //     break;
            //     case 403 : statusMsg = '纠错本未标记' ;                                 
            //     break;
            //     case 404 :  statusMsg = '题目或者答案文档缺失';                                 
            //     break;
            //     case 500 :  statusMsg = '内部未知错误';                                  
            //     break;
            //     case 504 : statusMsg = '超时需再生成';
            //     break;
            //     default :
            // }
            
            statusMsgObj[currentId][1] = statusMsg;
            let {answerSuccessNum} = this.state;
            if(status === 200){
                allAnswerData[currentId] = 1;
                if(haslearnIDs.indexOf(Number(currentId)) === -1){
                    haslearnIDs.push(Number(currentId))
                }
                answerSuccessNum = answerSuccessNum +1
            }else{
                allAnswerData[currentId] = 0;
            }
            this.setState({
                statusMsgObj : statusMsgObj,
                allAnswerData : allAnswerData,
                haslearnIDs : haslearnIDs,
                answerSuccessNum : answerSuccessNum
            })

        }).catch(err=>{

        })
       
    }
    downloadDetail(data){
        this.setState({
            showDetailTable : true,
            detailData : this._handleDetailData(data)
        })
    }
    _handleDetailData(data){
        if(data !== undefined){
            let returnData = []
            data.map((item,index)=>{
                item.map((item2,index2)=>{
                    returnData.push({
                        titleNumber : item2.subIdx === -1 ? `${item2.index}` : `${item2.index}(${item2.subIdx})`,
                        titleSource : item2.subIdx === -1 ? `${item2.book}/P${item2.page}/T${item2.idx}` : `${item2.book}/P${item2.page}/T${item2.idx}/(${item2.subIdx})`,
                        titleBasic : item2.reason
                    })
                })
            })
            return returnData;
        }
    }
    handleCancel = () => {
        this.setState({
            showDetailTable: false,
        });
      }
    render(){
        const {schools,learnIDs,schoolName,grade,classNum,showStudentDetail,selectAllStundent,showFirstPage,showSecondPage,
           selectSchoolValue,studentMarks,markDetailData,pickDownFlag,learnIDName,detailData,showDetailTable
            ,showSure,allDetailData,allFileData,allAnswerData,statusMsgObj,fileSuccesNum,answerSuccessNum
            ,showMarkDetail,showThirdPage,showFourthPage,currentMsg,allStudentNum,addDataFlag,markName} = this.state;
            console.log(fileSuccesNum)
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

        const dataSource_download = [];
        for(var key in allFileData){
            var fileDownload;
            var answerDownload;
            console.log(key)
            if(allFileData[key] === 0){
                fileDownload = <span className='downBtn' style={{border:'none',color:'red'}} onClick={this.getFileAgain.bind(this,key)}>纠错本</span>
            }else{
                fileDownload = <span className='downBtn' style={{border:'none',color:'#49a9ee'}}>
                                    纠错本
                                </span>
            }
            if(allAnswerData[key] === 0){
                answerDownload = <span className='downBtn' style={{border:'none',color:'red',marginLeft:30}} onClick={this.getAnswerAgain.bind(this,key)}>答案</span>
            }else{
                answerDownload = <span className='downBtn' style={{border:'none',color:'#49a9ee',marginLeft:30}}>
                                     答案
                                </span>
            }
            var download =  <span>
                                {fileDownload}
                                {answerDownload}
                            </span>
        var isCorrect;
        if(allFileData[key] !== undefined && allAnswerData[key] !== undefined){
            isCorrect = true
        }else{
            isCorrect = false
        }
        var question_1 = ''
        var question_2 = ''
        if(statusMsgObj[key] !== undefined){
            question_1 = <span>{statusMsgObj[key][0]}</span>
            question_2 = <span>{statusMsgObj[key][1]}</span>
        }
        dataSource_download.push({
                key : key,
                learnID : key,
                name : learnIDName[key],
                download : download,
                isCorrect : isCorrect,
                trueNum : allDetailData[key] !== undefined ? allDetailData[key].questionNum : 0,
                selectDetail : <span style={{color:'#108ee9',cursor:'pointer'}} onClick={this.downloadDetail.bind(this,allDetailData[key].data)}>详情</span>,
                question :allDetailData[key].questionNum === 0 ? <div>0错题或未标记</div>
                                                                    : <div>
                                                                        <div><span>纠错本:</span><span>{question_1}</span></div>
                                                                        <div><span>答案:</span><span>{question_2}</span></div>
                                                                    </div>
            })
            
        }

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
                    </Row> : null
                }
                {/* {
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
                                                        disabled={!showSure}>确定</Button>
                                            </div>
                                        </Col>
                                        <Col span={15}></Col>
                                    </Row> : null
                } */}
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
                                                            dataSource={dataSource_download}
                                                            scroll={{x:false,y:300}}
                                                            rowClassName={(record, index)=>{
                                                                if(record.isCorrect){
                                                                    return ''
                                                                }else{
                                                                    return 'wrong-row'
                                                                }  
                                                            }}
                                                            />
                                                    </div>
                                                    {/* <div style={{textAlign:'center',marginTop:50}}>
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
                                                    </div> */}
                                <div className='save-success detail-content'>
                                     <div>
                                         学生：<span style={{color:'#108ee9'}}>
                                                {allStudentNum===0?<span style={{color:'red'}}>没有学生</span>:
                                                        `${schoolName} ${grade}(${classNum})班,${allStudentNum}人`}
                                                </span>
                                    </div>
                                    <div style={{marginTop:5}}>
                                        <span style={{color:'#108ee9'}}>{currentMsg}</span>
                                    </div>
                                    <div>
                                        {!pickDownFlag && addDataFlag ? <div>
                                                            <div style={{color:'#108ee9'}}>{fileSuccesNum}个学生纠错本成功</div>
                                                            <div style={{color:'red'}}>{allStudentNum-fileSuccesNum}个学生纠错本待进一步处理</div>
                                                            <div style={{color:'#108ee9'}}>{answerSuccessNum}个学生答案成功</div>
                                                            <div style={{color:'red'}}>{allStudentNum-answerSuccessNum}个学生答案待进一步处理</div>
                                                        </div> : null}
                                    </div>
                                 </div>                                      
                                </div>
                                        </Col>
                                        <Col span={1}></Col>
                                    </Row>
                                      : null
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
