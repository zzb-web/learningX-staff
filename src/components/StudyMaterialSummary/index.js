import React from 'react';
import {Row ,Col, Input,Button, Select ,InputNumber, Table, Modal,Popconfirm, Radio} from 'antd';
import { withRouter } from 'react-router';
import {Get ,Post ,Delete} from '../../fetch/data.js'
import CityCommon from '../Common/cityCommon.js';
import GradeClassCommon from '../Common/gradeclassCommon.js';
const {Option} = Select;
class StudyMaterialSummary extends React.Component{
    constructor(){
        super();
        this.state={
            title : '',
            schools : [],
            schoolsNames : [],
            name_schoolID : {},
            gradeWarning : false,
            classWarning : false,
            cityMsg :['','','','',''],
            schoolMsg :'',
            classMsg : ['',''],
            cityWarning : false,
            schoolWarning : false,
            showTable : false,
            data : [],
            dataPaper : [],
            imgURL : '',
            showModal : false,
            mode : 'book',
        }
    }
    componentWillMount(){
        Get('/api/v3/staffs/schools/').then(resp=>{
            var schoolsNames = [];
            const {name_schoolID} = this.state;
            resp.data.map((item,index)=>{
                schoolsNames.push(item.name)
                name_schoolID[item.name] = item.schoolID
            })
           this.setState({
               schools : resp.data,
               schoolsNames : schoolsNames,
               name_schoolID : name_schoolID
           })
        }).catch(err=>{
            
        })
    }
    dataMsgInput(cityMsg){
        this.setState({
            cityMsg : cityMsg
        })
    }
    cityWarningHandle(value){
        this.setState({
            cityWarning : value
        })
    }
    schoolMsg(schools ,schoolsNames, name_schoolID){
        console.log(schools ,schoolsNames, name_schoolID)
        this.setState({
                    schools : schools,
                    schoolsNames : schoolsNames,
                    name_schoolID : name_schoolID
                })
    }
    schoolNameInput(value){
        const {name_schoolID} = this.state;
        if(value !== ''){
            this.setState({
                schoolWarning :false
            })
        }
        this.setState({
            schoolMsg : name_schoolID[value]
        })
    }
    classMsgInput(classMsg){
        this.setState({
            classMsg : classMsg
        })
    }
    gradeWarningHandle(value){
        this.setState({
            gradeWarning : value
        })
    }
    classWarningHandle(value){
        this.setState({
            classWarning : value
        })
    }
    searchHandle(){
        const {cityMsg, schoolMsg, classMsg} = this.state;
        if(cityMsg[1] === ''){
            this.setState({
                cityWarning : true
            })
        }else if(schoolMsg === ''){
            this.setState({
                schoolWarning : true
            })
        }else if(classMsg[0] === ''){
            this.setState({
                gradeWarning : true
            })
        }else if(classMsg[1] === '' || classMsg[1] === undefined){
            this.setState({
                classWarning : true
            })
        }else{
            const msg = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}`;
            Get(`/api/v3/staffs/classes/books/?${msg}`).then(resp=>{
                if(resp.status === 200){
                    this.setState({
                        data : resp.data,
                    })
                }
            }).catch(err=>{
                
            })
            Get(`/api/v3/staffs/classes/papers/?${msg}`).then(resp=>{
                if(resp.status === 200){
                    this.setState({
                        dataPaper : resp.data,
                        showTable : true
                    })
                }
            }).catch(err=>{
                
            })
            
        }
    }
    showPic(value){
        console.log(value)
        this.setState({
            showModal : true,
            title : value[1],
            imgURL : value[0]
        })
    }
    modalCancel(){
        this.setState({
            showModal : false,
            imgURL : ''
        })
    }
    confirm(data){
        const {classMsg,schoolMsg} = this.state;
        if(data[1] === 0){
            const msg = {
                schoolID: schoolMsg,
                grade: classMsg[0],
                class: classMsg[1],
                bookID: data[0]
            }
            Post('/api/v3/staffs/classes/deleteBook/',msg).then(resp=>{
                if(resp.status === 200){
                    const msg2 = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}`;
                    Get(`/api/v3/staffs/classes/books/?${msg2}`).then(resp=>{
                        if(resp.status === 200){
                            this.setState({
                                data : resp.data,
                            })
                        }
                    }).catch(err=>{
                        
                    })
                }
            }).catch(err=>{
    
            })
        }else{
            const msg = {
                schoolID: schoolMsg,
                grade: classMsg[0],
                class: classMsg[1],
                paperID: data[0]
            }
            Post('/api/v3/staffs/classes/deletePaper/',msg).then(resp=>{
                if(resp.status === 200){
                    const msg2 = `schoolID=${schoolMsg}&grade=${classMsg[0]}&class=${classMsg[1]}`;
                    Get(`/api/v3/staffs/classes/papers/?${msg2}`).then(resp=>{
                        if(resp.status === 200){
                            this.setState({
                                dataPaper : resp.data,
                            })
                        }
                    }).catch(err=>{
                        
                    })
                }
            }).catch(err=>{
    
            })
        }
        
    }
    cancel(){
    }
    handleModeChange(e){
        this.setState({
            mode : e.target.value
        })
    }
    render(){
        const {mode,showModal,imgURL, title,data,dataPaper ,showTable ,schools ,schoolWarning,cityWarning,gradeWarning,classWarning} = this.state;
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].name}>{schools[i].name}</Option>);
        }
        const columns = [
            {
                title : '录入时间',
                dataIndex : 'time',
                key : 'time',
                width : '10%'
            },
            {
                title : '书本资料识别码',
                dataIndex : 'bookID',
                key : 'bookID',
                width : '10%'
            },
            {
                title : '资料名称',
                dataIndex : 'name',
                key : 'name',
                width : '10%'
            },
            {
                title : '学期',
                dataIndex : 'term',
                key : 'term',
                width : '10%'
            },
            {
                title : '对应教科书版本和年份',
                dataIndex : 'version',
                key : 'version',
                width : '10%'
            },
            {
                title : 'ISBN',
                dataIndex : 'isbn',
                key : 'isbn',
                width : '10%'
            },
            {
                title : '版次',
                dataIndex : 'edi',
                key : 'edi',
                width : '10%'
            },
            {
                title : '印次',
                dataIndex : 'imp',
                key : 'imp',
                width : '10%'
            },
            {
                title : '图片',
                dataIndex : 'pic',
                key : 'pic',
                width : '10%'
            },
            {
                title : '操作',
                dataIndex : 'opera',
                key : 'opera',
                width : '10%'
            },
        ]
        const dataSource = [];
        data.map((item,index)=>{
            console.log(item)
            dataSource.push({
                key : index,
                time : item.time,
                bookID : item.bookID,
                term : item.term,
                name : item.name,
                version : item.version,
                isbn : item.isbn,
                edi : `${item.ediYear}-${item.ediMonth}-${item.ediVersion}`,
                imp : `${item.impYear}-${item.impMonth}-${item.impNum}`,
                pic : <div>
                        <div className='picName' onClick={this.showPic.bind(this,[item.coverURL,'封面'])}>封面</div>
                        <div className='picName' onClick={this.showPic.bind(this,[item.cipURL,'CIP数据'])}>CIP数据</div>
                        <div className='picName' onClick={this.showPic.bind(this,[item.priceURL,'印版次数据'])}>印版次数据</div>
                      </div>,
                opera : <Popconfirm title="你确定要删除这个对应吗?" 
                                    onConfirm={this.confirm.bind(this,[item.bookID,0])}
                                    onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                            <div className='picName'>删除</div>
                        </Popconfirm>
                
               
            })
        })
        const columnsPaper = [
            {
                title : '录入时间',
                dataIndex : 'time',
                key : 'time',
                width : '10%'
            },
            {
                title : '试卷识别码',
                dataIndex : 'paperID',
                key : 'paperID',
                width : '10%'
            },
            {
                title : '试卷名称',
                dataIndex : 'name',
                key : 'name',
                width : '10%'
            },
            {
                title : '试卷类型',
                dataIndex : 'type',
                key : 'type',
                width : '10%'
            },
            {
                title : '满分',
                dataIndex : 'fullScore',
                key : 'fullScore',
                width : '10%'
            },
            {
                title : '对应教科书版本和年份',
                dataIndex : 'versionYear',
                key : 'versionYear',
                width : '10%'
            },
            {
                title : '汉字(最后选择题)',
                dataIndex : 'choice',
                key : 'choice',
                width : '10%'
            },
            {
                title : '汉字(最后填空题)',
                dataIndex : 'blank',
                key : 'blank',
                width : '10%'
            },
            {
                title : '图片',
                dataIndex : 'pic',
                key : 'pic',
                width : '10%'
            },
            {
                title : '操作',
                dataIndex : 'opera',
                key : 'opera',
                width : '10%'
            },
        ]
        const dataPaperSource = [];
        dataPaper.map((item,index)=>{
            console.log(item)
            dataPaperSource.push({
                key : index,
                time : item.time,
                paperID : item.paperID,
                name : item.name,
                type : item.type,
                fullScore : item.fullScore,
                versionYear : `${item.version}${item.year}`,
                choice : item.choice,
                blank : item.blank,
                pic : <div className='picName' onClick={this.showPic.bind(this,[item.imageURL,'试卷题头'])}>试卷题头</div>,
                opera : <Popconfirm title="你确定要删除这个对应吗?" 
                                    onConfirm={this.confirm.bind(this,[item.paperID,1])}
                                    onCancel={this.cancel.bind(this)} okText="确定" cancelText="取消">
                            <div className='picName'>删除</div>
                        </Popconfirm>
                
               
            })
        })
        return(
            <div>
                <div>
                    <Row>
                        <Col span={9}>
                            <CityCommon dataMsgInput={this.dataMsgInput.bind(this)}
                                        schoolMsg={this.schoolMsg.bind(this)}
                                        cityWarning={cityWarning}
                                        cityWarningHandle={this.cityWarningHandle.bind(this)}/>
                            <div style={{marginTop:30}}>
                                <span className='book-title'><span style={{color:'red'}}>*</span>学校全称:</span>
                                <Select
                                    combobox
                                    style={schoolWarning ? {width:300,marginLeft:20,border:'1px solid red'}:{width:300,marginLeft:20}}
                                    placeholder="填写学校的规范全称"
                                    onChange={this.schoolNameInput.bind(this)}
                                    tabIndex={0}
                                >
                                    {children}
                                </Select>
                            </div>
                        </Col>
                        <Col span={9}>
                            <GradeClassCommon classMsgInput={this.classMsgInput.bind(this)}
                                            gradeWarning = {gradeWarning}
                                            classWarning = {classWarning}
                                            gradeWarningHandle = {this.gradeWarningHandle.bind(this)}
                                            classWarningHandle = {this.classWarningHandle.bind(this)}/>
                        </Col>
                        <Col span={6}>
                            <div className='search-btn-content'>
                                <Button type='primary'
                                        className='search-btn'
                                        onClick={this.searchHandle.bind(this)}>搜索</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='underline-hr'></div>
                { showTable ?
                    <div>
                        <div style={{textAlign:'center',marginTop:20}}>
                                    <Radio.Group 
                                        onChange={this.handleModeChange.bind(this)} 
                                        value={mode} 
                                        style={{ marginBottom: 8 }}>
                                        <Radio.Button value="book">书本资料</Radio.Button>
                                        <Radio.Button value="testPaper">试卷</Radio.Button>
                                    </Radio.Group>
                        </div>
                        <div style={{marginTop:40}}>
                            {
                                mode === 'book' ? <Table columns={columns}
                                                    bordered={true}
                                                    pagination={false}
                                                    dataSource={dataSource}
                                                    scroll={{x:false,y:300}}
                                                    /> : 
                                                    <Table columns={columnsPaper }
                                                    bordered={true}
                                                    pagination={false}
                                                    dataSource={dataPaperSource}
                                                    scroll={{x:false,y:300}}
                                                    />
                            }
                        </div> 
                    </div> : null
                }
               <Modal title={title}
                        visible={showModal}
                        footer={null}
                        maskClosable={false}
                        onCancel={this.modalCancel.bind(this)}
                        wrapClassName="vertical-center-modal"
                        >
                    <div style={{overflowX:'auto'}}>
                        <img src={imgURL}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(StudyMaterialSummary);