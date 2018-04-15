import React from 'react';
import { withRouter } from 'react-router';
import {Row, Col, Select, Button, InputNumber,Table} from 'antd';
import {Get , Post} from '../../fetch/data.js';
const {Option} = Select;
class ClassErrorTest extends React.Component{
    state={
        schools : [],
        schoolID : '',
        grade : '',
        classNum : '',
        learnIDs : [],
        showSelectStudent : true,
        showSelectContent : false,
        showDownContent : false,
        category : 'onceWrongProblems',
        materials : [],
        chooseAgain : false,
        requestData : [],
        showMaterials : true,
        detailData : [],
        showFail : false,
        showDetail : false,
        failMsg : '',
        allNum : 0,
        maxNum : 10,
        allReturnData : {},
        sort : 1,
        paper : 2,
        showSure: true,
        showFail : true,
        showDetail : false,
        failMsg : '',
        allDetailData : {},
        allFileData : {}
    }
    componentWillMount(){
        Get('http://118.31.16.70/api/v3/staffs/schools/')
        .then(resp=>{
           this.setState({
               schools : resp.data
           })
        }).catch(err=>{
            
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
        this.setState({
            schoolID : value
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
        const {schoolID, grade, classNum} = this.state;
        Get(`http://118.31.16.70/api/v3/staffs/students/?schoolID=${schoolID}&grade=${grade}&class=${classNum}`)
        .then(resp=>{
            if(resp.status === 200){
                this.setState({
                    learnIDs : resp.data.learnIDs,
                    showSelectStudent : false,
                    showSelectContent : true
                })
            }
        }).catch(err=>{

        })

        Get(`http://118.31.16.70/api/v3/staffs/schools/${schoolID}/books/`)
        .then(resp=>{
            if(resp.status === 200){
                this.setState({
                    materials:resp.data,
                })
            }
        }).catch(err=>{

        })
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
            showDownContent : false
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
      const {category , requestData, maxNum,sort,paper , learnIDs} = this.state;
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
            var url = `http://118.31.16.70/api/v3/staffs/students/${item.learnID}/${category}/`;
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
                    allReturnData : allReturnData
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
                  })
            setTimeout(()=>{
                var fileDataArray = [];
                for(var key in allDetailData){
                    var obj = {}
                    obj.learnID = key
                    obj.params = this._getFileData(allDetailData[key],key,paper)
                    fileDataArray.push(obj)
                }
                const {allFileData} = this.state;
                (async () => {
                    for(let i=0;i<fileDataArray.length;i++) {
                        await Post(`http://118.31.16.70/api/v3/staffs/students/${fileDataArray[i].learnID}/getProblemsFile/`,fileDataArray[i].params)
                        .then(resp=>{
                            console.log(resp.data)
                            allFileData[fileDataArray[i].learnID] = resp.data.pdfurl
                        }).catch(err=>{
                            console.log(err)
                            allFileData[fileDataArray[i].learnID] = ''
                        })
                        this.setState({
                            allFileData : allFileData
                        })
                        console.log('func'+(i+1)+' well done');
                    }
                    console.log('all well done');
                })()
                       
            },1000)
    }else{
        this.setState({
            showFail : true,
            showDetail : false,
            failMsg : '页码不正常'
        })
    }
    }
    }
 _getFileData(currentData,learnID,paper){
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
            var url = 'http://118.31.16.70/api/v3/staffs/students/uploadTasks/';
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
        const {schools,learnIDs,showSelectStudent,showSelectContent,showMaterials,
             requestData,materials,showSure,chooseAgain,showDownContent,allDetailData,allFileData} = this.state;
             console.log(allFileData)
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
        for(var key in allFileData){
            var download;
            if(allFileData[key] === undefined){
                download =  <span>
                                <span className='downBtn' style={{border:'none'}}>纠错本</span>
                                <span className='downBtn' style={{border:'none',marginLeft:30}}>答案</span>
                            </span>
            }else{
                download =  <span>
                                <span className='downBtn' style={{border:'none',color:'#49a9ee'}} onClick={this.getErrorToptic.bind(this,key)}>
                                    <a download={allFileData[key]} href={allFileData[key]} target="blank">纠错本</a>
                                </span>
                                <span className='downBtn' style={{border:'none',color:'#49a9ee',marginLeft:30}}>答案</span>
                            </span>
            }
            dataSource.push({
                key : key,
                learnID : key,
                name : key,
                download : download
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
                            {/* {
                                this.state.showFail? <div className='save-success'>
                                                           <span style={{color:'red'}}>{this.state.failMsg}</span>
                                                        </div> : null
                            } */}
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
                            {/* {
                                showFail? <div className='save-success'>
                                                           <span style={{color:'red'}}>{failMsg}</span>
                                                        </div> : null
                            } */}
                            {/* {
                                showDetail ? <div className='save-success'>
                                     <div>题目总量：<span style={{color:'#108ee9'}}>{allNum}</span></div>
                                 </div> : null
                            } */}
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
                            showDownContent ? <div>
                                                <Table columns={columns}
                                                       bordered={true}
                                                       pagination={false}
                                                       dataSource={dataSource}
                                                        />
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