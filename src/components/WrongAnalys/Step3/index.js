import React from 'react';
import {Row,Col} from 'antd';
export default class Step3 extends React.Component{
    constructor(props){
        super();
        this.state={
            allStudentNum : props.allStudentNum,
            schoolMsg : props.schoolMsg
        }
    }
    componentWillReceiveProps(nextProps){
        this.setState({
            allStudentNum : nextProps.allStudentNum,
            schoolMsg : nextProps.schoolMsg
        })
    }
    render(){
        const {allStudentNum,schoolMsg} = this.state;
        return(
            <div>
                <div>{`${schoolMsg} 学校`}</div>
                <div>

                </div>
            </div>
        )
    }
}