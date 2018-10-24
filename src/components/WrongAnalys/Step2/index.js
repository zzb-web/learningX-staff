import React from "react";
import {Select,Button,Row,Col,InputNumber} from 'antd';
import {Get} from '../../../fetch/data.js';
const {Option} = Select;
export default class Step2 extends React.Component{
    state={
        contentHeight : 0,
        requestData : [],
        materials : [],
        paperData : [],
        papers : [],
        showSure: true,
        category : 'newestWrongProblems',
    }
    componentWillMount(){
        // Get('/api/v3/staffs/schools/')
        // .then(resp=>{
        //   if(resp.status === 200){
        //     this.setState({
        //         schools : resp.data
        //     })
        //   }else{
        //     this.setState({
        //         schools : []
        //     })
        //   }
        // }).catch(err=>{
        //     this.setState({
        //         schools : []
        //     })
        // })
        let {schoolID,grade,classNum} = this.props;
        this.setState({
            schoolID : schoolID,
            grade : grade,
            classNum : classNum
        })
        const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}`;
        Get(`/api/v3/staffs/classes/books/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                this.setState({
                    materials:resp.data,
                })
            }
        }).catch(err=>{

        })

        Get(`/api/v3/staffs/classes/papers/?${msg}`)
        .then(resp=>{
            if(resp.status === 200){
                this.setState({
                    papers:resp.data,
                })
            }
        }).catch(err=>{

        })

        var requestData = [
            {
                bookID : '',
                startPage: 0,
                 endPage: 0
            }
        ]
        var paperData = [{
            paperID : ''
        }]
        this.setState({
            requestData : requestData,
            paperData : paperData
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

    sureBtnHandle(){
        this.setState({showSure : false})
            setTimeout(()=>{
                this.setState({showSure:true})
        },500)
        const {category,requestData,paperData} = this.state;
        let categoryType;
        if(category === 'newestWrongProblems'){
            categoryType = 1;
        }else if(category === 'onceWrongProblems'){
            categoryType = 2;
        }
        this.props.secondPageDone(categoryType,requestData,paperData)
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
    paperPageChange(index,value){
        const {paperData} = this.state;
        paperData[index].paperID = value;
        this.setState({
            paperData
        })
    }
    render(){
        const {contentHeight,requestData,materials,paperData,papers,showSure} = this.state;

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

       return(
        <Row>
            <Col span={8}>
                <div className='select-info'>
                    <h2 className='select-info-h2'>选择测试内容</h2>
                    <div className='select-info-content'>
                        <div className='select-category-1'>
                            <span>错题状态&nbsp;&nbsp;:</span>
                            <Select placeholder='选择错题状态' style={{ width: 240, marginLeft:'10px' }} onChange={this.changeCategory.bind(this)} defaultValue='2'>
                                <Option value='1'>曾经错过的所有题</Option>
                                <Option value='2'>现在仍错的题</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={2}>
                 <div className='left-line' style={{height:contentHeight}}></div>
            </Col>
            <Col span={13}>
                <div className='category-detail'>
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
                                                </div> 
            </Col>
            <Col span={1}></Col>
        </Row>
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