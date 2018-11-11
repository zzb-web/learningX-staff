import React from 'react';
import {Get,Post} from '../../fetch/data.js';
import {Row,Col,Table,Modal} from 'antd';

export default class PreviewHandle extends React.Component{
    constructor(){
        super();
        this.state={
            grade : '',
            classNum : '',
            schoolID : '',
            schoolName : '',
            selectedLearnIDs :[],
            learnIDName : {},
            learnID : '',
            wrongProblems :[],
            bookID : '',
            page : '',
            paperID : '',
            paper : 2,
            pickDownFlag : true,
            statusMsgObj : {},
            currentMsg : '',
            fileSuccesNum : 0,
            answerSuccessNum : 0,
            showDetailTable : false,
            haslearnIDs : [],
            allDetailData : {},
            batchID : '',
            postStudents : [],
            category : 'newestWrongProblems',
        }
    }
    componentWillMount(){
            const {schoolID,grade,classNum,postStudents,selectedLearnIDs,hasSelectProductID,bookData,paperData,way} = this.props;
            this.setState({
                selectedLearnIDs : selectedLearnIDs,
                grade : grade,
                classNum : classNum,
                hasSelectProductID : hasSelectProductID
            })
            let batchID = '';
             //获取批量生成纠错本的任务ID
             let postMsg = {
                 school: schoolID,
                 grade: grade,
                 class: classNum,
                 students : postStudents
             }
             Post(`/api/v3/staffs/batchDownloads/`,postMsg).then(resp=>{
                 if(resp.status === 200){
                     batchID = resp.data.batchID;
                     const {category} = this.state;
                        var allReturnData = {};
                        var sort = 1;
                        (async () => {
                            if(way === 1){
                                var thisRequestData = [];
                                bookData.map((item,index)=>{
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
                                var postMsg_1 = {
                                  sort : sort,
                                  bookPage:thisRequestData,
                                  paperIDs : hasSelectPaperIds,
                                  productID : hasSelectProductID[0],
                                  batchID : batchID
                                  }

                                for(let k=0;k<selectedLearnIDs.length;k++){
                                    var url = `/api/v3/staffs/students/${selectedLearnIDs[k].learnID}/${category}/`;
                                    await Post(url,postMsg_1)
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
                                        allDetailData : allDetailData
                                    })
                                    })
                                    .catch(function (error) {
                                    });
                                    if(k >= (selectedLearnIDs.length-1)){
                                        this._getPDF()
                                    }
                            }
                            }else{
                                for(let k =0;k<selectedLearnIDs.length;k++){
                                    var url = `/api/v3/staffs/students/${selectedLearnIDs[k].learnID}/wrongProblems/?sort=1&batchID=${batchID}&productID=${hasSelectProductID[0]}`;
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
                     this.setState({
                         batchID : resp.data.batchID
                     })
                 }
             }).catch(err=>{
     
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
    _sortBy(way){
        return function(a,b){
           return  a[way] - b[way]
        }
    }
    _getPDF(){
        const {paper ,allDetailData,hasSelectProductID} = this.state;
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
                        productID : hasSelectProductID[0],
                        problems : finalRequestArray[i].params.problems
                    };

                    await Post(`/api/v3/staffs/students/${finalRequestArray[i].learnID}/${type}/`,postMsg)
                    .then(resp=>{
                        const {addDataFlag,pickDownFlag} = this.state;
                        if(addDataFlag){
                        let status = resp.status;
                        let statusMsg = ''
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
                                this.setState({
                                    allFileData : allFileData
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
    render(){
        const {schoolName,grade,classNum,pickDownFlag,learnIDName,showDetailTable,detailData
             ,allDetailData,allFileData,allAnswerData,statusMsgObj,fileSuccesNum,answerSuccessNum
             ,currentMsg,allStudentNum,addDataFlag,selectedLearnIDs} = this.state;
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
            console.log('xxxxxxxxxxxxxxxx',allFileData,allAnswerData)
            for(var key in allFileData){
                var fileDownload;
                var answerDownload;
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
            <Row>
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
        <div className='save-success detail-content'>
                <div>
                    学生：<span style={{color:'#108ee9'}}>
                        {selectedLearnIDs.length===0?<span style={{color:'red'}}>没有学生</span>:
                                `${schoolName} ${grade}(${classNum})班,${selectedLearnIDs.length}人`}
                        </span>
            </div>
            {/* <div style={{marginTop:5}}>
                <span style={{color:'#108ee9'}}>{currentMsg}</span>
            </div> */}
            <div>
                {!pickDownFlag && addDataFlag ? <div>
                                    <div style={{color:'#108ee9'}}>{fileSuccesNum}个学生纠错本成功</div>
                                    <div style={{color:'red'}}>{selectedLearnIDs.length-fileSuccesNum}个学生纠错本待进一步处理</div>
                                    <div style={{color:'#108ee9'}}>{answerSuccessNum}个学生答案成功</div>
                                    <div style={{color:'red'}}>{selectedLearnIDs.length-answerSuccessNum}个学生答案待进一步处理</div>
                                </div> : null}
            </div>
            </div>                                      
        </div>
        <Modal
            title='选题详情'
            wrapClassName="vertical-center-modal"
            visible={showDetailTable}
            onCancel={this.handleCancel}
            footer={null}
            >
            <DownloadDetail detailData={detailData}/>
        </Modal>
                </Col>
                <Col span={1}></Col>
            </Row>
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