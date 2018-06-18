import React from 'react';
import {Table,Switch,Button} from 'antd';
import {Post} from '../../../fetch/data.js';
class WrongProblemTable extends React.Component{
    constructor(props){
        super();
        this.state={
            wrongProblems : props.wrongProblems,
            detailData : [],
            learnID : props.learnID,
            errDate : props.errDate
        }
    }
    componentWillMount(){
        let wrongProblems = this.props.wrongProblems;
        let detailData = this._handleData(wrongProblems)
        this.setState({
            detailData
        })
    }
    componentWillReceiveProps(nextProps){
        let wrongProblems = nextProps.wrongProblems;
        let detailData = this._handleData(wrongProblems)
        this.setState({
            detailData,
            learnID : nextProps.learnID,
            errDate : nextProps.errDate
        })
    }
    _handleData(wrongProblems){
        let data1={}
        let detailData = []
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
        detailData.map((item,index)=>{
            item.map((item2,index2)=>{
                item2.isCorrect = true;
            })
        })
        return detailData;
    }


    chooseRight(indexs,value){
        const {detailData} = this.state;
        console.log(detailData)
        detailData[indexs[0]][indexs[1]].isCorrect = value;
        this.setState({
            detailData
        })
    }
    saveHandle(){
        const {detailData,learnID,errDate} = this.state;
        console.log(detailData)
        let data = [];
        detailData.map((item,index)=>{
            item.map((item2,index2)=>{
                data.push({
                            isCorrect: item2.isCorrect,
                            problemId: item2.problemId,
                            subIdx: item2.subIdx,
                            smooth: item2.isCorrect ? 1 : -1,
                            understood: item2.isCorrect ? -1 : 1
                        }
                        )
            })
        })
        let saveMsg = {
            time : errDate,
            problems : data
        }
        Post(`/api/v3/staffs/students/${learnID}/problemsRevised/`,saveMsg).then(resp=>{

        }).catch(err=>{

        })
    }
    render(){
        const {detailData ,learnID} = this.state;
        const columns=[
            {
                title : '题目位置',
                dataIndex : 'position',
                key : 'position',
                width : '50%'
            },
            {
                title : '做题结果',
                dataIndex : 'result',
                key : 'result',
                width : '50%'
            }
        ]
        const dataSource = [];
        detailData.map((item,index)=>{
            item.map((item2,index2)=>{
                if(item2.subIdx === -1){
                    dataSource.push({
                        key : `${index}${index2}`,
                        position : item2.idx,
                        result : <Switch style={{width:60}} checkedChildren="√" unCheckedChildren="×" onChange={this.chooseRight.bind(this,[index,index2])} checked={item2.isCorrect}/>,
                    })
                }else{
                    dataSource.push({
                        key :`${index}${index2}`,
                        position : `${item2.idx}/(${item2.subIdx})`,
                        result : <Switch style={{width:60}} checkedChildren="√" unCheckedChildren="×" onChange={this.chooseRight.bind(this,[index,index2])} checked={item2.isCorrect}/>,
                    })
                }
            })
        })

        return(
            <div>
                <div>
                <Table columns={columns}
                            bordered={true}
                            pagination={false}
                            dataSource={dataSource}
                            scroll={{x:false,y:300}}
                            rowClassName={(record, index)=>{
                                if(record.result.props.checked){
                                return ''
                                }else{
                                return 'wrong-row'
                                }
                            }}/>
                    
                </div>
                <div className='errorSave'>
                    <Button type='primary' 
                            onClick={this.saveHandle.bind(this)}
                            style={{width:240}}>保存</Button>
                </div>
            </div>
        )
    }
}
export default WrongProblemTable;