import React from 'react';
import {Row,Col,Button,Select,InputNumber} from 'antd';
import {Get} from '../../fetch/data.js';
const {Option} = Select;
export default class EPU1Setting extends React.Component{
    constructor(){
        super();
        this.state = {
            materials : [],
            papers : [],
            requestData : [
                {
                    bookID : '',
                    startPage: 0,
                     endPage: 0
                }
            ],
            paperData : [{
                paperID : ''
            }]
        }
    }
    componentWillMount(){
        const {schoolID,grade,classNum} = this.props;
        const msg = `schoolID=${schoolID}&grade=${grade}&class=${classNum}&epu=1&serviceType=全包`;
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
    }
    sureBtnHandle(){
        const {requestData,paperData} = this.state;
        this.props.EPU1SettingDone(requestData,paperData)
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
        const {materials,papers,requestData,paperData} = this.state;
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
               <Col span={2}></Col>
               <Col span={20}>
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
                                    onClick={this.sureBtnHandle.bind(this)}>确定</Button>

                        </div>
                    </div>
               </Col>
               <Col span={2}></Col>
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