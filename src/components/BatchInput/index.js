import React from 'react';
import {Row,Col,Select,InputNumber,Button,Table,Switch,Input,Radio} from 'antd';
import Error from './subpage/error.js';
import WrongProblemTable from './subpage/wrongProblemTable.js'
import HomeWork from './subpage/HomeWork.js';
import HomeworkTable from './subpage/homeworkTable.js';
import Paper from './subpage/paper.js';
import PaperTable from './subpage/paperTable.js';
import {Get} from '../../fetch/data.js';
const {Option} = Select;
class BatchInput extends React.Component{
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
            paperID : ''
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
                console.log('aaaaaaa')
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
            showFirstPage : false,
            showSecondPage : true
        })
    }
    markLearnId(learnID){
        const {selectedLearnIDs} = this.state;
        this.setState({
            learnID : learnID,
            showMarkMsg : false
        })
        let name;
        for(var i=0;i<=selectedLearnIDs.length;i++){
            if(selectedLearnIDs[i] !== undefined && selectedLearnIDs[i].learnID === learnID){
                name = selectedLearnIDs[i].name;
                console.log(name)
                this.setState({
                    name : name
                })
                break;
            }
        }
    }
    markName(e){
        const {selectedLearnIDs} = this.state;
        let name = e.target.value;
        console.log(name)
        this.setState({
            name : name
        })
        let learnID;
        for(var i=0;i<=selectedLearnIDs.length;i++){
            if(selectedLearnIDs[i] !== undefined && selectedLearnIDs[i].name === name){
                learnID = selectedLearnIDs[i].learnID;
                console.log(learnID)
                this.setState({
                    learnID : learnID
                })
                break;
            }
        }
    }
    handleModeChange(e){
        const mode = e.target.value;
        this.setState({ 
            mode,
            showWarning : false
         });
      }
    toMark(){
        const {learnID ,name ,schoolID, grade , classNum} = this.state;
        if(learnID === undefined || learnID === '' || name ===undefined || name ===''){
            this.setState({
                warningMsg : '请输入正确的学习号或者姓名',
                showWarning : true
            })
        }else{
            Get(`/api/v3/staffs/students/${learnID}/uploadTasks/`).then(resp=>{
                let errorQues = []
                resp.data.map((item,index)=>{
                   if(item.type === 1){
                       errorQues.push(item)
                   }
                })
                this.setState({
                    errorQues : errorQues,
                    showMarkMsg : true,
                    showWarning : false
                })
            }).catch(err=>{
                console.log(err)
            })
                //获取学习资料
                const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
                Get(`/api/v3/staffs/classes/books/?${msg}`)
                .then(resp=>{
                    if(resp.status === 200){
                        console.log(resp.data)
                        this.setState({
                            materials:resp.data,
                        })
                    }
                }).catch(err=>{
                })
                //获取试卷
                Get(`/api/v3/staffs/classes/papers/?${msg}`)
                .then(resp=>{
                    if(resp.status === 200){
                        this.setState({
                            papers:resp.data,
                        })
                    }
                }).catch(err=>{

                })
        }
        this.setState({
            showErrorTable : false,
            showHomeworkTable : false,
            showPaperTable : false,
            errDate : '',
            bookID : '',
            page : '',
            paperID : ''
        })
    }
    getWrongProblems(haSuc,data,flag){
        let warningMsg ='';
        let showWarning = false;
        if(haSuc){
            if(data.length === 0){
                warningMsg = '已经标记过'
                showWarning = true;
            }else{
                showWarning = false;
            }
        }else{
            warningMsg = '没有数据'
            showWarning = true
        }
        this.setState({
            wrongProblems : data,
            showErrorTable : flag,
            warningMsg : warningMsg,
            showWarning : showWarning
        })
    }
    getDate(time){
        this.setState({
            errDate : time,
            showWarning : false
        })
    }
    getHomeworkData(hasSuc,data,flag){
        let warningMsg = '';
        let showWarning = false;
        if(hasSuc){
            if(data.length === 0){
                warningMsg = '已经标记过'
                showWarning = true
            }else{
                showWarning = false
            }
        }else{
            warningMsg = '没有数据';
            showWarning = true
        }
        
        this.setState({
            homeworkData : data,
            showHomeworkTable : flag,
            warningMsg : warningMsg,
            showWarning : showWarning
        })
    }
    getPaperData(hasSuc,data,flag){
        let warningMsg = '';
        let showWarning = false;
        if(hasSuc){
            if(data.length === 0){
                showWarning = true;
                warningMsg = '已经标记过';
            }else{
                showWarning = false;
            }
        }else{
            showWarning = true;
                warningMsg = '没有数据';
                showWarning = true;
        }
        
        this.setState({
            paperData : data,
            showPaperTable : flag,
            showWarning : showWarning,
            warningMsg : warningMsg
        })
    }
    getPaperDate(data){
        this.setState({
            paperDate : data,
            showWarning :false
        })
    }
    getBookID(value){
        this.setState({
            bookID : value,
            showWarning : false
        })
    }
    getPage(value){
        this.setState({
            page : value,
            showWarning : false
        })
    }
    getPaperID(value){
        this.setState({
            paperID : value,
            showWarning : false
        })
    }
    tableSave(data){
        const {learnID} = this.state;
        if(data === 0){
            Get(`/api/v3/staffs/students/${learnID}/uploadTasks/`).then(resp=>{
                let errorQues = []
                resp.data.map((item,index)=>{
                   if(item.type === 1){
                       errorQues.push(item)
                   }
                })
                this.setState({
                    errorQues : errorQues,
                })
            }).catch(err=>{
                console.log(err)
            })
            
            this.setState({
                errDate : '',
                showErrorTable : false
            })
        }else if(data === 1){
            this.setState({
                // bookID : '',
                // page : '',
                showHomeworkTable : false
            })
        }else if(data === 2){
            const {schoolID,grade,classNum} = this.state;
            const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
            Get(`/api/v3/staffs/classes/papers/?${msg}`)
                .then(resp=>{
                    if(resp.status === 200){
                        this.setState({
                            papers:resp.data,
                        })
                    }
                }).catch(err=>{

                })
            this.setState({
                showWarning : false,
                showPaperTable : false,
                paperDate : '',
                paperID : ''
            })
        }else if(data === 3){
            this.setState({
                showWarning : true,
                warningMsg : '请选择日期'
            })
        }
    }
    showWarningHandle(data){
        console.log(data)
        let msg = ''
        if(data === 0){
            msg = '请选择纠错本日期'
            this.setState({
                showWarning : true,
            })
        }else if(data === 1){
            msg = '请选择学习资料和页码'
            this.setState({
                showWarning : true,
            })
        }else if(data === 2){
            msg = '请选择试卷'
            this.setState({
                showWarning : true,
            })
        }else if(data === 10){
            this.setState({
                showWarning : false,
            })
        }
        this.setState({
            warningMsg : msg
        })
        
    }
    render(){
        const {schools,learnIDs,showStudentDetail,selectAllStundent,showFirstPage,showSecondPage,mode,
                errorQues,name,learnID,showMarkMsg,wrongProblems,errDate,materials,homeworkData,
                papers,paperData,showWarning,warningMsg,paperDate,showErrorTable,showHomeworkTable,
            bookID,page,showPaperTable,paperID} = this.state;
        const allGrage = ['一','二','三','四','五','六','七','八','九'];
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
        return(
            <div>
                {showSecondPage ? <div className='under-line' style={{position:'relative',top:50}}></div> : null}
                { showFirstPage ?
                <Row>
                    <Col span={8}>
                        <div className='select-info'>
                                <h2 className='select-info-h2'>选择班级</h2>
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
                            </div>
                    </Col>
                    <Col span={2}></Col>
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
                    </Col>
                    <Col span={1}></Col>
                </Row> : null
                }
                {showSecondPage ?
                    <Row>
                        <Col span={11}>
                        <div>
                            <span>学习号:</span>
                            <InputNumber style={{width:120,marginLeft:10}} value={learnID} onChange={this.markLearnId.bind(this)}/> 
                            <span style={{marginLeft:20}}>姓名:</span>
                            <Input style={{width:120,marginLeft:10}} value={name} onChange={this.markName.bind(this)}/> 
                            <Button type='primary' 
                                    style={{width:120,marginLeft:10}}
                                    onClick={this.toMark.bind(this)}>去标记</Button>
                        </div>
                        {
                            showMarkMsg ?  <div className='main-content' style={{marginTop:50}}>
                                            <div className='selects'>
                                                <Radio.Group onChange={this.handleModeChange.bind(this)} value={mode} style={{ marginBottom: 8 }}>
                                                    <Radio.Button value="error" style={{width:120,textAlign:'center'}}>纠错本</Radio.Button>
                                                    <Radio.Button value="homework" style={{width:120,textAlign:'center'}}>平时作业</Radio.Button>
                                                    <Radio.Button value="testPaper" style={{width:120,textAlign:'center'}}>试卷</Radio.Button>
                                                </Radio.Group>
                                            </div>
                                            <div className='select-content' style={{width:'80%'}}>
                                                <div style={mode === 'error'?{display:'block'}:{display:'none'}}>
                                                    <Error errorQues={errorQues} 
                                                            learnID={learnID}
                                                            errDate={errDate}
                                                            showWarningHandle={this.showWarningHandle.bind(this)}
                                                            getWrongProblems={this.getWrongProblems.bind(this)}
                                                            getDate={this.getDate.bind(this)} />
                                                </div>
                                                <div style={mode === 'homework'?{display:'block'}:{display:'none'}}>
                                                    <HomeWork materials={materials} 
                                                                learnID={learnID}
                                                                bookID={bookID}
                                                                page={page}
                                                                getBookID={this.getBookID.bind(this)}
                                                                getPage={this.getPage.bind(this)}
                                                                showWarningHandle={this.showWarningHandle.bind(this)}
                                                                getHomeworkData={this.getHomeworkData.bind(this)}/>
                                                </div>
                                                <div style={mode === 'testPaper'?{display:'block'}:{display:'none'}}>
                                                    <Paper learnID={learnID}
                                                            papers={papers}
                                                            paperID={paperID}
                                                            paperDate={paperDate}
                                                            showWarningHandle={this.showWarningHandle.bind(this)}
                                                            getPaperID={this.getPaperID.bind(this)}
                                                            getPaperData={this.getPaperData.bind(this)}
                                                            getPaperDate={this.getPaperDate.bind(this)}/>
                                                </div>
                                            </div>
                                        </div> : null
                        }
                            {
                                showWarning ? <div className='markWarning'>
                                                    <span style={{color:'red'}}>{warningMsg}</span>
                                                </div> : null
                            }
                        </Col>
                        <Col span={2}></Col>
                        <Col span={10}>
                            {
                                showMarkMsg ? <div className='markMsgContent'>
                                                    <div style={mode === 'error'?{display:'block'}:{display:'none'}}>
                                                        {showErrorTable ? <WrongProblemTable wrongProblems={wrongProblems} 
                                                                            learnID={learnID}
                                                                            errDate={errDate}
                                                                            tableSave={this.tableSave.bind(this)}/> : null}
                                                    </div>
                                                    <div style={mode === 'homework'?{display:'block'}:{display:'none'}}>
                                                        {showHomeworkTable ?<HomeworkTable homeworkData={homeworkData}
                                                                                            learnID={learnID}
                                                                                            tableSave={this.tableSave.bind(this)}/>:null}
                                                    </div>
                                                    <div style={mode === 'testPaper'?{display:'block'}:{display:'none'}}>
                                                    {showPaperTable ? <PaperTable paperData={paperData}
                                                                    learnID={learnID}
                                                                    paperDate={paperDate}
                                                                    tableSave={this.tableSave.bind(this)}/> : null}
                                                    </div>
                                                </div> : null
                            }
                        </Col>
                        <Col span={1}></Col>
                    </Row> : null
                }
            </div>
        )
    }
}

export default BatchInput;