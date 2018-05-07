import React from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';
import {Row, Col, Select, Button, InputNumber,Table,Popconfirm,Checkbox ,message} from 'antd';
import {Get , Post} from '../../fetch/data.js';
const {Option} = Select;
class ClassErrorTest extends React.Component{
    state={
        schools : [],
        schoolID : '',
        grade : '',
        classNum : '',
        learnIDs : [],
        learnIDName : {},
        showSelectStudent : true,
        showSelectContent : false,
        showDownContent : false,
        category : 'newestWrongProblems',
        materials : [],
        chooseAgain : false,
        requestData : [],
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
        addDataFlag : true
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
                book : '',
                startPage: 0,
                 endPage: 0
            },
            {
                book : '',
                startPage: 0,
                endPage: 0
            }
        ]
        this.setState({
            requestData : requestData
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
        Get(`/api/v3/staffs/students/?schoolID=${schoolID}&grade=${grade}&class=${classNum}`)
        .then(resp=>{
            if(resp.status === 200){
                resp.data.learnIDs.map((item,index)=>{
                    learnIDName[item.learnID] = item.name
                })
                this.setState({
                    learnIDs : resp.data.learnIDs,
                    showSelectStudent : false,
                    showSelectContent : true,
                    allStudentNum : resp.data.total
                })
            }
        }).catch(err=>{

        })

        Get(`/api/v3/staffs/schools/${schoolID}/books/`)
        .then(resp=>{
            if(resp.status === 200){
                this.setState({
                    materials:resp.data,
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
          })
    }
    addMaterials(){
        var {requestData} = this.state;
            requestData.push({
                book : '',
                startPage: 0,
                endPage: 0
            })
            this.setState({
                requestData : requestData
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
            requestData[index].book = value[1];
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
      const {category , requestData, maxNum,sort,paper , learnIDs, allStudentNum} = this.state;
      console.log(category , requestData, maxNum,sort,paper)
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
        if(item.book !== ''){
            thisRequestData.push(item)
        }
      })
      var postMsg = {
        sort : sort,
        paper :paper,
        max: maxNum,
        bookPage:thisRequestData
        }
      if(requestFlag){
        var allDetailData  = {};
        var allReturnData = {};
        learnIDs.map((item,idnex)=>{
            var url = `/api/v3/staffs/students/${item.learnID}/${category}/`;
            Post(url,postMsg)
            .then((response)=>{
              if(response.status === 200){
                  var data1 = {};
                  var detailData = [];
                  var wrongProblems = response.data.wrongProblems;
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
            
                allDetailData[item.learnID] = detailData;
                allReturnData[item.learnID] = response.data
                this.setState({
                    allReturnData : allReturnData,
                })
              }else if(response.status === 404){
                allDetailData[item.learnID] = [];
              }
            })
            .catch(function (error) {
              console.log(error);
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
                  })
                  const {allStudentNum} = this.state;
                  console.log(allStudentNum)
                  var times = allStudentNum*100;
                  console.log(times)
            setTimeout(()=>{
                var fileDataArray = [];
                var answerDataArray = [];
                for(var key in allDetailData){
                    console.log(key)
                    var obj = {}
                    obj.learnID = key
                    obj.params = this._getFileData(allDetailData[key],paper)
                    fileDataArray.push(obj);

                    var obj2 = {};
                    obj2.learnID = key;
                    obj2.params = this._getAnswerData(allDetailData[key],paper)
                    answerDataArray.push(obj2)
                }
                console.log(allDetailData,fileDataArray.length)
                const {allFileData,allAnswerData} = this.state;
                
                (async () => {
                    for(let i=0;i<fileDataArray.length;i++) {
                        const {generateFlag} = this.state;
                        console.log(generateFlag)
                        if(generateFlag){
                            await Post(`/api/v3/staffs/students/${fileDataArray[i].learnID}/getProblemsFile/`,fileDataArray[i].params)
                            .then(resp=>{
                                const {addDataFlag} = this.state;
                                if(addDataFlag){
                                    allFileData[fileDataArray[i].learnID] = resp.data.pdfurl;
                                    let haslearnIDs = [];
                                    for(var key in allFileData){
                                        if(allFileData[key] !== undefined){
                                            haslearnIDs.push(Number(key))
                                        }
                                    }
                                    this.setState({
                                        haslearnIDs : haslearnIDs
                                    })
                                }
                            }).catch(err=>{
                                allFileData[fileDataArray[i].learnID] = ''
                            })
                            
                            this.setState({
                                allFileData : allFileData
                            })
                        }
                    }
                })();

                var successArr = [];
                var failArr =[];

                (async () => {
                    for(let i=0;i<answerDataArray.length;i++) {
                        const {generateFlag,pickDownFlag} = this.state;
                        if(generateFlag){
                            await Post(`/api/v3/staffs/students/${answerDataArray[i].learnID}/getAnswersFile/`,answerDataArray[i].params)
                            .then(resp=>{
                                const {addDataFlag} = this.state;
                                if(addDataFlag){
                                    if(resp.status === 200){
                                        successArr.push(0)
                                    }else{
                                        failArr.push(0)
                                    }
                                    allAnswerData[answerDataArray[i].learnID] = resp.data.pdfurl;
                                    if(i=== allStudentNum-1){
                                        this.setState({
                                            pickDownFlag : false
                                        })  
                                    }else{
                                       this.setState({
                                           pickDownFlag : true
                                       })
                                    }
                                    if(i=== allStudentNum-1){
                                        message.info(<span>
                                            <span style={{color:'#49a9ee'}}>{successArr.length}个学生OK，</span>
                                            <span style={{color:'red'}}>{failArr.length}个学生未成功</span>
                                        </span>)
                                    }
                                }
                                
                            }).catch(err=>{
                                
                                allAnswerData[answerDataArray[i].learnID] = ''
                            })    
                            this.setState({
                                allAnswerData : allAnswerData
                            })
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
        const {markFlag,haslearnIDs} = this.state;
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

        Post('/api/v3/staffs/students/getProbsAnsFilesZip/',haslearnIDs)
                                .then(resp=>{
                                    console.log(resp.data.URL)
                                    window.open(resp.data.URL);
                                    // this._downloadFile(resp.data.URL)
                                }).catch(err=>{
                                   
                                })
    }
    _downloadFile(url){
        var form= document.createElement('form');
       
        form.setAttribute("style","display:none");
        form.setAttribute("target","")
        form.setAttribute("method","get")
        form.setAttribute("action",url)
        console.log(form)
        console.log(document.getElementsByTagName('body'))
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
     console.log(currentData)
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
        console.log(dataObj)
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
    console.log(dataParams)
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
            console.log(allReturnData)
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
                    console.log(resp)
                }).catch(err=>{
                    console.log(err)
                })
    }
    render(){
        const {pickDownFlag,schoolName,grade,classNum,allStudentNum ,showDetail,learnIDName,schools,learnIDs,showSelectStudent,showSelectContent,showMaterials,
             requestData,materials,showSure,chooseAgain,showDownContent,allDetailData,allFileData,allAnswerData,pickDownURL} = this.state;
        const allGrage = ['一','二','三','四','五','六','七','八','九'];
        const columns = [
            {
                title : '学习号',
                dataIndex : 'learnID',
                key : 'learnID',
                width : '25%'
            },
            {
                title : '姓名',
                dataIndex : 'name',
                key : 'name',
                width : '25%'
            },
            {
                title : '下载',
                dataIndex : 'download',
                key : 'download',
                width : '50%'
            }
        ]
        const dataSource = [];
        console.log(allFileData)
        for(var key in allFileData){
            var fileDownload;
            var answerDownload;
            if(allFileData[key] === undefined){
                fileDownload = <span className='downBtn' style={{border:'none'}}>纠错本</span>
            }else{
                fileDownload = <span className='downBtn' style={{border:'none',color:'#49a9ee'}} onClick={this.getErrorToptic.bind(this,key)}>
                                    <a download={allFileData[key]} href={allFileData[key]} target="blank">纠错本</a>
                                </span>
            }
            if(allAnswerData[key] === undefined){
                answerDownload = <span className='downBtn' style={{border:'none',marginLeft:30}}>答案</span>
            }else{
                answerDownload = <span className='downBtn' style={{border:'none',color:'#49a9ee',marginLeft:30}}>
                                     <a download={allAnswerData[key]} href={allAnswerData[key]} target="blank">答案</a>
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
            dataSource.push({
                key : key,
                learnID : key,
                name : learnIDName[key],
                download : download,
                isCorrect : isCorrect
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
                                            onClick={this.getStudentMsg.bind(this)}>确定</Button>
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
                                 </div> : null
                            }
                        </div> : null
                        }
                    </Col>
                    <Col span={2}></Col>
                    <Col span={13}>
                        {
                            showSelectContent ? <div className='category-detail' style={showMaterials?{display:'block'}:{display:'none'}}>
                                                    <div className='materials-content'>
                                                        {
                                                        requestData.map((item,index)=><AddLearningMaterials key={index} materials={materials} pageChange={this.pageChange.bind(this, index)}/>)
                                                        }
                                                        <div className='addBtn'><Button icon="plus" style={{width:200}} onClick={this.addMaterials.bind(this)}>添加</Button></div>
                                                    </div>
                                                    <div className='addBtn'>
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
                                                                    打包下载
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
                        {/* <div className='category-detail'>
                            {
                                this.state.category === '1' ? <AccordingTime data={detailData}/> :
                                this.state.category === '2' ? <AccordingTopicTypes data={detailData}/> :null
                                // this.state.category === '3' ? <AccordingMasteryLevel data={detailData}/> :
                                // this.state.category === '4' ? <AccordingReview data={detailData}/> : null
                            }
                        </div> */}
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
                                                                    {materials.map((item,index)=><Option value={item} key={index}>{item}</Option>)}
                                                                  </Select></span>
                <span className='subsection'><span>开始页码:</span><InputNumber onChange={this.startChage.bind(this)}/></span>
                <span className='subsection'><span>结束页码:</span><InputNumber onChange={this.endChange.bind(this)}/></span>
            </div>
        )
    }
}

export default withRouter(ClassErrorTest);