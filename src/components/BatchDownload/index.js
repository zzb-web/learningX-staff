import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import {Row, Col, Select, Button, InputNumber,Table,Popconfirm,Checkbox ,message,Switch} from 'antd';
import {Get , Post} from '../../fetch/data.js';
const {Option} = Select;
class BatchDownload extends React.Component{
    state={
        contentHeight : 0,
        schools : [],
        schoolID : '',
        grade : '',
        classNum : '',
        learnIDs : [],
        learnIDName : {},
        showSelectStudent : true,
        showSelectContent : false,
        showDownContent : false,
        showStudentDetail : false,
        showLeftLine : false,
        category : 'newestWrongProblems',
        materials : [],
        papers : [],
        chooseAgain : false,
        requestData : [],
        paperData : [],
        showMaterials : true,
        detailData : [],
        showFail : false,
        showDetail : false,
        failMsg : '',
        allStudentNum : 0,
        maxNum : 10,
        allReturnData : {},
        sort : 1,
        paper : 2,
        showSure: true,
        failMsg : '',
        allDetailData : {},
        allFileData : {},
        allAnswerData : {},
        generateFlag : true,
        pickDownURL : false,
        haslearnIDs : [],
        schoolName : '',
        pickDownFlag : true,
        markFlag : false,
        addDataFlag : true,
        selectAllStundent : true,
        selectedLearnIDs : [],
        statusMsgObj : {},
        currentMsg : '',
        fileSuccesNum : 0,
        answerSuccessNum : 0,
        fileDataArray : [],
        answerDataArray : []
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
        var requestData = [
            {
                bookID : '',
                startPage: 0,
                 endPage: 0
            },
            // {
            //     bookID : '',
            //     startPage: 0,
            //     endPage: 0
            // }
        ]
        var paperData = [{
            paperID : ''
        }]
        this.setState({
            requestData : requestData,
            paperData : paperData
        })
    }
    schoolSelect(value){
        const {schools} = this.state;
        let schoolName;
        schools.map((item,index)=>{
            if(item.schoolID === value){
                schoolName = item.name
            }
        })
        this.setState({
            schoolID : value,
            schoolName : schoolName
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

        Get(`/api/v3/staffs/classes/books/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                // console.log(resp.data)
                this.setState({
                    materials:resp.data,
                })
            }
        }).catch(err=>{

        })

        Get(`/api/v3/staffs/classes/papers/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                // console.log(resp.data)
                this.setState({
                    papers:resp.data,
                })
            }
        }).catch(err=>{

        })
    }
    }
    changeCategory(value){
        var type;
        if(value === '1'){
            type = 'onceWrongProblems';
        }else if(value === '2'){
            type = 'newestWrongProblems';
        }
        this.setState({
            category : type
        })
    }
    
    changeSort(value){
        this.setState({
            sort:Number(value)
        })
    }
    changePaper(value){
        this.setState({
            paper:Number(value)
        })
    }
    saveHandle(flag){
        this.setState({
            chooseAgain : flag,
            showMaterials : !flag
        })
    }
    chooseAgain(){
        this.setState({
            showMaterials : true,
            chooseAgain : false,
            showFail : false,
            showDetail : false,
            showSelectContent :false,
            showSelectStudent : true,
            showDownContent : false,
            schoolID : '',
            grade : '',
            classNum : '',
            allAnswerData : {},
            allFileData : {},
            allDetailData : {},
            pickDownFlag : true,
            paperData : [{paperID : ''}],
            fileSuccesNum:0,
            answerSuccessNum : 0
          })
    }
    addMaterials(){
        var {requestData} = this.state;
            requestData.push({
                bookID : '',
                startPage: 0,
                endPage: 0
            })
            this.setState({
                requestData : requestData
            })
    }
    addPapers(){
        var {paperData} = this.state;
        paperData.push({
                paperID : ''
            })
            this.setState({
                paperData
            })
    }
    maxNumChange(value){
        this.setState({
            maxNum : value
        })
    }
    pageChange(index,value){
        const {requestData} = this.state;
        if(value[0] === 0){
            requestData[index].bookID = value[1];
        }else if(value[0] === 1){
            requestData[index].startPage = value[1];
        }else{
            requestData[index].endPage = value[1];
        }
        this.setState({
            requestData : requestData
        })
    }
    sureBtnHandle(){
        this.setState({showSure : false})
            setTimeout(()=>{
                this.setState({showSure:true})
        },500)
      const {category , requestData, maxNum,sort,paper , selectedLearnIDs, allStudentNum,paperData} = this.state;
    //   console.log(category , requestData, maxNum,sort,paper)
      if(maxNum === 0 || maxNum === undefined){
          this.setState({
            showFail : true,
            showDetail : false,
            failMsg : '请输入题目数量的最大值'
          })
      }else if(sort === ''){
        this.setState({
            showFail : true,
            showDetail : false,
            failMsg : '请选择题目排序方式'
          })
      }else if(paper === ''){
        this.setState({
            showFail : true,
            showDetail : false,
            failMsg : '请选择纸张大小'
          })
      }else{
      var requestFlag = true;
      var thisRequestData = [];
      requestData.map((item,index)=>{
        if(item.bookID !== ''){
            thisRequestData.push(item)
        }
      })
      let hasSelectPaperIds = [];
      paperData.map((item,index)=>{
          if(item.paperID !== ''){
              hasSelectPaperIds.push(item.paperID)
          }
      })
      var postMsg = {
        sort : sort,
        paper :paper,
        max: maxNum,
        bookPage:thisRequestData,
        paperIDs : hasSelectPaperIds
        }
      if(requestFlag){
        var allDetailData  = {};
        var allReturnData = {};
        selectedLearnIDs.map((item,idnex)=>{
            var url = `/api/v3/staffs/students/${item.learnID}/${category}/`;
            Post(url,postMsg)
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
                  console.log(data1)
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
        
            this.setState({
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

            },times)
    }else{
        this.setState({
            showFail : true,
            showDetail : false,
            failMsg : '页码不正常'
        })
    }
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
    _downloadFile(url){
        var form= document.createElement('form');
       
        form.setAttribute("style","display:none");
        form.setAttribute("target","")
        form.setAttribute("method","get")
        form.setAttribute("action",url)
        // console.log(form)
        // console.log(document.getElementsByTagName('body'))
        document.getElementsByTagName('body').appendChild(form)
        document.getElementsByName('form').submit();
        // form.submit();
    }
    markChange(e){
        this.setState({
            markFlag : e.target.checked
        })
    }
    stopGenerate(){
        this.setState({
            generateFlag : false,
            pickDownFlag : false,
            addDataFlag : false
        })
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
 getErrorToptic(learnID){
            const {allFileData,allReturnData} = this.state;
            // console.log(allReturnData)
            var detail = JSON.stringify(allReturnData[learnID]);
            var timestamp = Date.parse(new Date())/1000
            var type;
            var url = '/api/v3/staffs/students/uploadTasks/';
            var postMsg =[{
                    time : timestamp,
                    type : 1,
                    learnID : Number(learnID),
                    detail : detail
                }]
                Post(url,postMsg).then(resp=>{
                    // console.log(resp)
                }).catch(err=>{
                    // console.log(err)
                })
    }
    paperPageChange(index,value){
        const {paperData} = this.state;
        paperData[index].paperID = value;
        this.setState({
            paperData
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
    selectStudentSure(){
        const {learnIDs} = this.state;
        let selectedLearnIDs = [];
        learnIDs.map((item,index)=>{
            if(item.status){
                selectedLearnIDs.push(item)
            }
        })
        this.setState({
            selectedLearnIDs : selectedLearnIDs,
            allStudentNum : selectedLearnIDs.length,
            showSelectStudent : false,
            showStudentDetail : false,
            showSelectContent : true,
        })
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
            
            statusMsgObj[currentId][0] = statusMsg;
            allFileData[currentId] = resp.data.pdfurl;
            let {fileSuccesNum} = this.state;
            if(status === 200){
                if(haslearnIDs.indexOf(Number(currentId)) === -1){
                    haslearnIDs.push(Number(currentId))
                }
                fileSuccesNum = fileSuccesNum+1
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
            
            statusMsgObj[currentId][1] = statusMsg;
            allAnswerData[currentId] = resp.data.pdfurl;
            let {answerSuccessNum} = this.state;
            if(status === 200){
                if(haslearnIDs.indexOf(Number(currentId)) === -1){
                    haslearnIDs.push(Number(currentId))
                }
                answerSuccessNum = answerSuccessNum +1
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
    componentDidMount(){
        let that = this;
        let allHeight = document.documentElement.clientHeight;
        this.setState({
          contentHeight :　allHeight-150
        })
        window.onresize = function(){
          let allHeight = document.documentElement.clientHeight;
          that.setState({
            contentHeight :　allHeight-150
          })
        }
      }
    render(){
        const {papers,paperData,pickDownFlag,schoolName,grade,classNum,allStudentNum ,showDetail,learnIDName,schools,learnIDs,showSelectStudent,showSelectContent,showMaterials,
             requestData,materials,showSure,chooseAgain,showDownContent,allDetailData,allFileData,allAnswerData,pickDownURL,
             showStudentDetail,selectAllStundent,contentHeight,showLeftLine,statusMsgObj,currentMsg,
             fileSuccesNum,answerSuccessNum,addDataFlag} = this.state;   
        let papersHandle =[];
        let hasSelectPaperIds = [];
        paperData.map((item,index)=>{
            if(item.paperID !== ''){
                hasSelectPaperIds.push(item.paperID)
            }
        })
        if(hasSelectPaperIds.length === 0){
            papersHandle = papers;
        }else{
            papers.map((item,index)=>{
                if(hasSelectPaperIds.indexOf(item.paperID) === -1){
                    papersHandle.push(item)
                }
            })
        }
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
                status : <Switch style={{width:60}} checkedChildren="√" unCheckedChildren="" onChange={this.chooseStudent.bind(this,index)} checked={item.status}/>,
            })
        })


        const allGrage = ['一','二','三','四','五','六','七','八','九'];
        const columns = [
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
                width : '30%'
            },
            {
                title : '实际题量',
                dataIndex : 'trueNum',
                key : 'trueNum',
                width:'20%'
            },
            {
                title : '问题说明',
                dataIndex : 'question',
                key : 'question',
                width:'20%'
            }
        ]
        const dataSource = [];
        for(var key in allFileData){
            var fileDownload;
            var answerDownload;
            if(allFileData[key] === undefined){
                fileDownload = <span className='downBtn' style={{border:'none',color:'red'}} onClick={this.getFileAgain.bind(this,key)}>纠错本</span>
            }else{
                fileDownload = <span className='downBtn' style={{border:'none',color:'#49a9ee'}}>
                                    纠错本
                                </span>
            }
            if(allAnswerData[key] === undefined){
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
            dataSource.push({
                key : key,
                learnID : key,
                name : learnIDName[key],
                download : download,
                isCorrect : isCorrect,
                trueNum : allDetailData[key] !== undefined ? allDetailData[key].questionNum : 0,
                question :allDetailData[key].questionNum === 0 ? <div>0错题或未标记</div>
                                                                    : <div>
                                                                        <div><span>纠错本:</span><span>{question_1}</span></div>
                                                                        <div><span>答案:</span><span>{question_2}</span></div>
                                                                    </div>
            })
            
        }
        return(
            <div>
                 <Row>
                    <Col span={8}>
                        { showSelectStudent ? 
                            <div className='select-info'>
                            <h2 className='select-info-h2'>选择学生</h2>
                            <div className='select-info-content'>
                                <div className='select-category-1'>
                                    <span>学校&nbsp;&nbsp;:</span>
                                    <Select placeholder='选择学校' style={{ width: 240, marginLeft:'10px' }} onChange={this.schoolSelect.bind(this)}>
                                        {schools.map((item,index)=><Option value={item.schoolID} key={index}>{item.name}</Option>)}
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
                        </div> : null
                        }
                        {
                            showSelectContent ? <div className='select-info'>
                            <h2 className='select-info-h2'>选择测试内容</h2>
                            <div className='select-info-content'>
                                <div className='select-category-1'>
                                    <span>错题状态&nbsp;&nbsp;:</span>
                                    <Select placeholder='选择错题状态' style={{ width: 240, marginLeft:'10px' }} onChange={this.changeCategory.bind(this)} defaultValue='2'>
                                       <Option value='1'>曾经错过的所有题</Option>
                                       <Option value='2'>现在仍错的题</Option>
                                    </Select>
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
                                    <span>排序算法&nbsp;&nbsp;:</span>
                                    <Select defaultValue='1' placeholder='选择题目排序方式' style={{ width: 240, marginLeft:'10px' }} onChange={this.changeSort.bind(this)}>
                                       <Option value='1'>按出题方式</Option>
                                       <Option value='2'>按题目类型</Option>
                                    </Select>
                                </div>
                                <div className='select-category-1'>
                                    <span>纸张大小&nbsp;&nbsp;:</span>
                                    <Select defaultValue='2' placeholder='选择输出纸张的大小' style={{ width: 240, marginLeft:'10px' }} onChange={this.changePaper.bind(this)}>
                                        <Option value='1'>A3</Option>
                                        <Option value='2'>A4</Option>
                                    </Select>
                                </div>
                                <div className='select-category-1' style={chooseAgain?{display:'block'}:{display:'none'}}>
                                    <span></span>
                                    <Button type="primary" size='large' style={{width:240,height:35,marginLeft:'10px'}} onClick={this.chooseAgain.bind(this)}>重选题目</Button>
                               </div>
                            </div>
                            {
                                showDetail ? <div className='save-success'>
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
                                                            <div style={{color:'red'}}>{allStudentNum-fileSuccesNum}个学生纠错本失败</div>
                                                            <div style={{color:'#108ee9'}}>{answerSuccessNum}个学生答案成功</div>
                                                            <div style={{color:'red'}}>{allStudentNum-answerSuccessNum}个学生答案失败</div>
                                                        </div> : null}
                                    </div>
                                 </div> : null
                            }
                        </div> : null
                        }
                    </Col>
                    <Col span={2}>
                        {showLeftLine ? <div className='left-line' style={{height:contentHeight}}></div> : null}
                    </Col>
                    <Col span={13}>
                        {
                            showStudentDetail ? <div>
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
                        {
                            showSelectContent ? <div className='category-detail' style={showMaterials?{display:'block'}:{display:'none'}}>
                                                    <div className='materials-content'>
                                                        {
                                                        requestData.map((item,index)=><AddLearningMaterials key={index} materials={materials} pageChange={this.pageChange.bind(this, index)}/>)
                                                        }
                                                        <div className='addBtn'><Button icon="plus" style={{width:'34%'}} onClick={this.addMaterials.bind(this)}>添加</Button></div>
                                                    </div>
                                                    <div className='under-line'></div>
                                                    <div className='papers-content'>
                                                        {
                                                        paperData.map((item,index)=><AddPapers key={index} papers={papersHandle} paperPageChange={this.paperPageChange.bind(this,index)}/>)
                                                        }
                                                        <div className='addBtn'><Button icon="plus" style={{width:'34%'}} onClick={this.addPapers.bind(this)}>添加</Button></div>
                                                    </div>
                                                    <div className='sureBtn'>
                                                        <Button type="primary" 
                                                                size='large' 
                                                                style={{width:240,height:35,marginLeft:'10px'}} 
                                                                onClick={this.sureBtnHandle.bind(this)}
                                                                disabled={!showSure}>确定</Button>

                                                    </div>
                                                </div> : null
                        }
                        {
                            showDownContent ? <div className='studentTable'>
                                                    <div style={{height:370}}>
                                                        <Table columns={columns}
                                                            bordered={true}
                                                            pagination={false}
                                                            dataSource={dataSource}
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

                                                    <div style={{textAlign:'center',marginTop:50}}>
                                                        
                                                    <span style={{position:'relative',display:'inline-block'}}>
                                                        <div className='mark-position'><Checkbox onChange={this.markChange.bind(this)}>生成标记</Checkbox></div>
                                                        {/* <a download={pickDownURL} href={pickDownURL} target="blank"> */}
                                                            <Popconfirm title="你确定吗？" onConfirm={this.pickDown.bind(this)} okText="确认" cancelText="取消">
                                                                <Button type='primary' size='large' style={{width:230,marginRight:10}}
                                                                    disabled={pickDownFlag}>
                                                                    合并下载
                                                                </Button>
                                                            </Popconfirm>
                                                            {/* </a> */}
                                                        </span>
                                                        <Popconfirm title="你确定吗？" onConfirm={this.stopGenerate.bind(this)} okText="确认" cancelText="取消">
                                                            <Button size='large'
                                                                style={{width:230,marginLeft:10,background:'#FF0000',color:'#fff'}}>停止</Button>
                                                        </Popconfirm>
                                                    </div>
                                                
                                              </div> : null
                        }
                    </Col>
                    <Col span={1}></Col>
                </Row>
            </div>
        )
    }
}
class AddLearningMaterials extends React.Component{
    selectMaterials(value){
        this.props.pageChange([0,value])
    }
    startChage(value){
        this.props.pageChange([1, value])
    }
    endChange(value){
        this.props.pageChange([2, value])
    }
    render(){
        const {name,materials} = this.props;
        return(
            <div style={{marginTop:20}}>
                <span className='subsection'><span>学习资料:</span><Select onChange={this.selectMaterials.bind(this)} style={{width:'30%'}}>
                                                                    {materials.map((item,index)=><Option value={item.bookID} key={index}>{item.name}</Option>)}
                                                                  </Select></span>
                <span className='subsection'><span>开始页码:</span><InputNumber onChange={this.startChage.bind(this)}/></span>
                <span className='subsection'><span>结束页码:</span><InputNumber onChange={this.endChange.bind(this)}/></span>
            </div>
        )
    }
}

class AddPapers extends React.Component{
    selectPapers(value){
        this.props.paperPageChange(value)
    }
    render(){
        const {name,papers} = this.props;
        // console.log(papers)
        return(
            <div style={{marginTop:20}}>
                <span className='subsection'><span><span style={{visibility:'hidden'}}>试卷</span>试卷:</span><Select onChange={this.selectPapers.bind(this)} style={{width:'30%'}}>
                                                                    {papers.map((item,index)=><Option value={item.paperID} key={index}>{item.name}</Option>)}
                                                                  </Select></span>
            </div>
        )
    }
}

export default withRouter(BatchDownload);