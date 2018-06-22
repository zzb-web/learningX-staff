import React from 'react';
import {Table,Switch,Button,message} from 'antd';
import {Post,Delete} from '../../../fetch/data.js';
class PaperTable extends React.Component{
    constructor(props){
        super();
        this.state={
            paperData : props.paperData,
            detailData : [],
            learnID : props.learnID,
            paperDate : props.paperDate
        }
    }
    componentWillMount(){
        let paperData = this.props.paperData;
        let detailData = this._handleData(paperData)
        this.setState({
            detailData,
        })
    }
    componentWillReceiveProps(nextProps){
        let paperData = nextProps.paperData;
        let detailData = this._handleData(paperData)
        this.setState({
            detailData,
            learnID : nextProps.learnID,
            paperDate : nextProps.paperDate
        })
    }
    _handleData(paperData){
        let data1={}
        let detailData = []
        console.log(paperData)
        paperData.map((item,index)=>{
                if(data1[item.problemId+'_']===undefined){
                    data1[item.problemId+'_']=[];
                    data1[item.problemId+'_'].push(item)
                }else{
                    data1[item.problemId+'_'].push(item)
                }
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
        const {detailData,learnID,paperDate} = this.state;
        if(paperDate !=='' && paperDate !== undefined){
            let data = [];
            detailData.map((item,index)=>{
                item.map((item2,index2)=>{
                    data.push({
                                isCorrect: item2.isCorrect,
                                problemId: item2.problemId,
                                subIdx: item2.subIdx
                            }
                            )
                })
            })
            let saveMsg = {
                time : paperDate,
                problems : data
            }
            Post(`/api/v3/staffs/students/${learnID}/problems/`,saveMsg).then(resp=>{
                if(resp.status === 200){
                    message.success('保存成功');
                    Delete(`/api/v3/staffs/students/${learnID}/uploadTasks/${paperDate}/`)
                    this.props.tableSave(2);
                }
            }).catch(err=>{
                    
            })
        }else{
            this.props.tableSave(3);
        }
        
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
export default PaperTable;