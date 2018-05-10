import React from 'react';
import {Input ,InputNumber, Select ,Row , Col,Radio ,Button, Table, Modal,message} from 'antd';
import {Get, Post} from '../../fetch/data.js';
import CityCommon from '../Common/cityCommon.js';
const {Option} = Select;
class ClassStudyMaterial extends React.Component {
    state={
        cityWarning : false,
        mode : 'book',
        citylMsg : ['','','',''],
        schoolMsg :['','',''],
        schools : [],
        schoolsNames : [],
        name_schoolID : {},
    }
    componentWillMount(){
        // Get('/api/v3/staffs/schools/').then(resp=>{
        //     var schoolsNames = [];
        //     var schoolID_name = {}
        //     resp.data.map((item,index)=>{
        //         schoolsNames.push(item.name)
        //         schoolID_name[item.name] = item.schoolID
        //     })
        //    this.setState({
        //        schools : resp.data,
        //        schoolsNames : schoolsNames,
        //        schoolID_name : schoolID_name
        //    })
        // }).catch(err=>{

        // })
    }
    handleModeChange(e){
        this.setState({
            mode : e.target.value
        })
    }
    dataMsgInput(index,e){
        const {citylMsg} = this.state;
        citylMsg[index] = e.target.value;
        this.setState({
            citylMsg : citylMsg
        })
            const msg = `province=${citylMsg[0]}&city=${citylMsg[1]}&district=${citylMsg[2]}&county=${citylMsg[3]}`;
            Get(`/api/v3/staffs/schools/?${msg}`)
            .then(resp=>{
                    var schoolsNames = [];
                    var schoolID_name = {}
                    resp.data.map((item,index)=>{
                        schoolsNames.push(item.name)
                        schoolID_name[item.name] = item.schoolID
                    })
                   this.setState({
                       schools : resp.data,
                       schoolsNames : schoolsNames,
                       schoolID_name : schoolID_name
                   })
                }).catch(err=>{
        
                })
    }
    schoolMsgInput(index,value){
        const {schoolMsg} = this.state;
        schoolMsg[index] = value;
        this.setState({
            schoolMsg : schoolMsg
        })
    }

    render(){
        const {cityWarning, mode,schools,schoolMsg} = this.state;
        const children = [];
        for (let i = 0; i < schools.length; i++) {
            children.push(<Option key={i} value={schools[i].schoolID}>{schools[i].name}</Option>);
        }
        const calss = ['一','二','三','四','五','六','七','八','九','高一','高二','高三','F',]
        return(
            <div>
                <Row>
                    <Col span={9}>
                    <div style={{padding:'30px 0 0 20px'}}>
                        <CityCommon dataMsgInput={this.dataMsgInput.bind(this)} cityWarning={cityWarning}/>
                        <div style={{marginTop:30}}>
                            <span>学校全称:</span>
                            <Select
                                style={{ width:320,marginLeft:30}}
                                onChange={this.schoolMsgInput.bind(this,0)}
                            >
                                {children}
                            </Select>
                        </div>
                        <div style={{marginTop:30}}>
                            <span><span style={{visibility:'hidden'}}>隐藏</span>年级:</span>
                            <Select style={{width:320,marginLeft:30}} 
                            onChange={this.schoolMsgInput.bind(this,1)}
                            >
                                {calss.map((item,index)=><Option key={index} value={item}>{item}</Option>)}
                            </Select>
                        </div>
                        <div style={{marginTop:30}}>
                            <span><span style={{visibility:'hidden'}}>隐藏</span>班级:</span>
                            <InputNumber max={1000} min={1} 
                                        style={{width:320,marginLeft:30}} 
                                        onChange={this.schoolMsgInput.bind(this,2)}
                                        />
                        </div>
                    </div>
                    </Col>
                    <Col span={15}>
                        <div style={{textAlign:'center'}}>
                            <Radio.Group 
                                onChange={this.handleModeChange.bind(this)} 
                                value={mode} 
                                style={{ marginBottom: 8 }}>
                                <Radio.Button value="book">书本资料</Radio.Button>
                                <Radio.Button value="testPaper">试卷</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div>
                            {mode === 'book' ? <Book schoolMsg={schoolMsg}/> : <TestPaper schoolMsg={schoolMsg}/>}
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}
export default ClassStudyMaterial;

class Book extends React.Component{
    constructor(props){
        super();
        this.state={
            ISBN : '',
            ISBNS : ['','','','',''],
            version : ['','',''],
            printing : ['','',''],
            books : [],
            showTable : false,
            showModal : false,
            title : '',
            imgURL : '',
            schoolMsg : props.schoolMsg
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            schoolMsg : nextProps.schoolMsg
        })
    }
    ISBNSInput(index,value){
        const {ISBNS} = this.state;
        ISBNS[index] = value;
        let ISBN = `${ISBNS[0]}-${ISBNS[1]}-${ISBNS[2]}-${ISBNS[3]}-${ISBNS[4]}`
        this.setState({
            ISBNS : ISBNS,
            ISBN : ISBN
        })
    }
   
    versionInput(index,value){
        const {version} = this.state;
        version[index] = value;
        this.setState({
            version : version
        })
    }
    printingInput(index,value){
        const {printing} = this.state;
        printing[index] = value;
        this.setState({
            printing : printing
        })
    }
    searchHandle(){
        const {ISBN, version , printing} = this.state;
        let bookMsg = `isbn=${ISBN}&ediYear=${version[0]}&ediMonth=${version[1]}&ediVersion=${version[2]}&impYear=${printing[0]}&impMonth=${printing[1]}&impNum=${printing[2]}`;
        Get(`/api/v3/staffs/books/search/?${bookMsg}`).then(resp=>{
            this.setState({
                books : resp.data,
                showTable : true
            })
        }).catch(err=>{
            
        })
    }
    bookHandle(data){
        let title;
        switch(data[1]){
            case 0 :
                title = '封面';
                break;
            case 1 :
                title ='CIP数据';
                break;
            case 2 :
                title = '印刷次数据';
                break;
            default : 
                break;
        }
        this.setState({
            showModal : true,
            title : title,
            imgURL : data[0]
        })
    }
    okHandle(data){
        const{schoolMsg} = this.state;
        let postMsg = {
            schoolID : schoolMsg[0],
            grade : schoolMsg[1],
            class : schoolMsg[2],
            bookID : data
        }
        Post('/api/v3/staffs/classes/addBook/',postMsg).then(resp=>{
            if(resp.status === 200){
                message.success('添加成功',2);
            }
        }).catch(err=>{

        })
    }
    modalCancel(){
        this.setState({
            showModal : false,
            imgURL : ''
        })
    }
   
    render(){
        let years = [] , month = [] , version = [];
        for(var i=1900;i<=2018;i++){
            years.push(<Option value={i} key={i}>{i}</Option>)
        }
        for(var i=1;i<=12;i++){
            month.push(<Option value={i} key={i}>{i}</Option>)
        }
        for(var i=1;i<=100;i++){
            version.push(<Option value={i} key={i}>{i}</Option>)
        }
        const {books , showTable, showModal, title , imgURL} = this.state;
        const columns = [
            {
                title : '书本资料识别码',
                dataIndex : 'bookID',
                key : 'bookID',
                width : '40%'
            },
            {
                title : '封面',
                dataIndex : 'coverURL',
                key : 'coverURL',
                width : '15%'
            },
            {
                title : 'CIP数据',
                dataIndex : 'cipURL',
                key :'cipURL',
                width : '15%'
            },
            {
                title :'印刷次数据',
                dataIndex :'priceURL',
                key : 'priceURL',
                width : '15%'
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : '15%'
            }
        ]
        let dataSource = [];
        books.map((item,index)=>{
            dataSource.push({
                key : index,
                bookID : item.bookID,
                coverURL : <span onClick={this.bookHandle.bind(this,[item.coverURL,0])} style={{color:'#108ee9',cursor:'pointer'}}>封面</span>,
                cipURL : <span onClick={this.bookHandle.bind(this,[item.cipURL,1])} style={{color:'#108ee9',cursor:'pointer'}}>CIP数据</span>,
                priceURL : <span onClick={this.bookHandle.bind(this,[item.priceURL,2])} style={{color:'#108ee9',cursor:'pointer'}}>印刷次数据</span>,
                operation : <span onClick={this.okHandle.bind(this,item.bookID)} style={{color:'#108ee9',cursor:'pointer'}}>确认对应</span>,
            })
        })
        return(
            <div style={{padding:'20px 0 0 30px'}}>
                <div className='ISBNInput'>
                    <span className='book-title'><span style={{color:'red'}}> * </span> ISBN : </span>
                    <InputNumber onChange={this.ISBNSInput.bind(this,0)} style={{width:50,marginLeft:20}}/><span className='span-style'>-</span>
                    <InputNumber onChange={this.ISBNSInput.bind(this,1)} style={{width:50}}/><span className='span-style'>-</span>
                    <InputNumber onChange={this.ISBNSInput.bind(this,2)} style={{width:50}}/><span className='span-style'>-</span>
                    <InputNumber onChange={this.ISBNSInput.bind(this,3)} style={{width:50}}/><span className='span-style'>-</span>
                    <InputNumber onChange={this.ISBNSInput.bind(this,4)} style={{width:50}}/>
                </div>
                <div style={{marginTop:30}}>
                    <span className='book-title'>版次 : </span>
                    <Select onChange={this.versionInput.bind(this,0)} style={{width:90,marginLeft:20}}>{years}</Select><span className='span-style'>年</span>
                    <Select onChange={this.versionInput.bind(this,1)} style={{width:90}}>{month}</Select><span className='span-style'>月</span>
                    <span className='span-style'>第</span><Select onChange={this.versionInput.bind(this,2)} style={{width:90}}>{version}</Select><span className='span-style'>版</span>
                </div>
                <div style={{marginTop:30}}>
                    <span className='book-title'>印次 : </span>
                    <Select onChange={this.printingInput.bind(this,0)} style={{width:90,marginLeft:20}}>{years}</Select><span className='span-style'>年</span>
                    <Select onChange={this.printingInput.bind(this,1)} style={{width:90}}>{month}</Select><span className='span-style'>月</span>
                    <span className='span-style'>第</span><Select onChange={this.printingInput.bind(this,2)} style={{width:90}}>{version}</Select><span className='span-style' style={{width:60}}>次印刷</span>

                    <Button type='primary' style={{width:150,marginLeft:40}} onClick={this.searchHandle.bind(this)}>搜索</Button>
                </div>
                {
                   showTable ? <div style={{marginTop:30}}>
                        <Table columns={columns}
                                dataSource={dataSource}
                                bordered={true}
                                pagination={false}
                                scroll={{x:null,y:300}}
                                />
                    </div> : null
                }
                <Modal title={title}
                        visible={showModal}
                        footer={null}
                        maskClosable={false}
                        onCancel={this.modalCancel.bind(this)}
                        wrapClassName="vertical-center-modal"
                        >
                    <div>
                        <img src={imgURL}/>
                    </div>
                </Modal>
            </div>
        )
    }
}

class TestPaper extends React.Component{
    constructor(props){
        super();
        this.state={
            testPaper :['','',''],
            tests : [],
            showTable : false,
            showModal : false,
            imgURL : '',
            schoolMsg : props.schoolMsg
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            schoolMsg : nextProps.schoolMsg
        })
    }
    testPaperInput(index,e){
        const{testPaper} = this.state;
        testPaper[index] = e.target.value;
        this.setState({
            testPaper : testPaper
        })
    }
    searchHandle(){
        const {testPaper} = this.state;
        let paperMsg = `choice=${testPaper[0]}&blank=${testPaper[1]}&calculation=${testPaper[2]}`;
        Get(`/api/v3/staffs/papers/search/?${paperMsg}`).then(resp=>{
            this.setState({
                tests : resp.data,
                showTable : true
            })
        }).catch(err=>{
            
        })
    }
    testHandle(url){
        this.setState({
            imgURL : url,
            showModal : true
        })
    }
    okHandle(data){
        const{schoolMsg} = this.state;
        let postMsg = {
            schoolID : schoolMsg[0],
            grade : schoolMsg[1],
            class : schoolMsg[2],
            paperID : data
        }
        Post('/api/v3/staffs/classes/addPaper/',postMsg).then(resp=>{
            if(resp.status === 200){
                message.success('添加成功',2);
            }
        }).catch(err=>{

        })
    }
    modalCancel(){
        this.setState({
            showModal : false,
            imgURL : ''
        })
    }
    render(){
        const columns = [
            {
                title : '试卷识别码',
                dataIndex : 'paperID',
                key : 'paperID',
                width : '40%'
            },
            {
                title : '试卷名称',
                dataIndex : 'name',
                key : 'name',
                width : '15%'
            },
            {
                title : '满分',
                dataIndex : 'fullScore',
                key :'fullScore',
                width : '15%'
            },
            {
                title :'试卷题头',
                dataIndex :'image',
                key : 'image',
                width : '15%'
            },
            {
                title : '操作',
                dataIndex : 'operation',
                key : 'operation',
                width : '15%'
            }
        ]
        const {tests ,showTable ,showModal ,imgURL} = this.state;
        let dataSource = [];
        tests.map((item,index)=>{
            dataSource.push({
                paperID : item.paperID,
                name : item.name,
                fullScore : item.fullScore,
                image : <span onClick={this.testHandle.bind(this,item.image)} style={{color:'#108ee9',cursor:'pointer'}}>试卷题头</span>,
                operation : <span onClick={this.okHandle.bind(this,item.paperID)} style={{color:'#108ee9',cursor:'pointer'}}>确认对应</span>,
            })
        })
        return(
            <div style={{padding:'20px 0 0 40px'}}>
                <div>
                            <span className='span-style-test'><span style={{color:'red'}}> * </span><span style={{color:'blue'}}>汉字(最后选择题) :</span></span>
                            <Input style={{width:320,marginLeft:30}} 
                                        onChange={this.testPaperInput.bind(this,0)}
                                        placeholder='选择题的最后一道题的最后3个汉字'
                                        />
                </div>
                <div style={{marginTop:30}}>
                            <span className='span-style-test'><span style={{color:'red'}}> * </span><span style={{color:'blue'}}>汉字(最后填空题) :</span></span>
                            <Input style={{width:320,marginLeft:30}} 
                                        onChange={this.testPaperInput.bind(this,1)}
                                        placeholder='填空题的最后一道题的最后3个汉字'
                                        />
                </div>
                <div style={{marginTop:30}}>
                            <span className='span-style-test'><span style={{color:'red'}}> * </span><span style={{color:'blue'}}>汉字(压轴题) :</span></span>
                            <Input style={{width:320,marginLeft:30}} 
                                        onChange={this.testPaperInput.bind(this,2)}
                                        placeholder='大题的最后一道题的最后3个汉字'
                                        />
                            <Button type='primary' style={{width:150,marginLeft:40}} onClick={this.searchHandle.bind(this)}>搜索</Button>
                </div>
                <div style={{marginTop:30}}>
                    {
                        showTable ? <Table columns={columns}
                                        dataSource={dataSource}
                                        bordered={true}
                                        pagination={false}
                                        scroll={{x:null,y:300}}/> : null
                    }
                </div>
                <Modal title='试卷题头'
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