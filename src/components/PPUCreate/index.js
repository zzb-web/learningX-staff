import React from 'react';
import SelectStudents from '../Common/selectStudents.js'
import MarkSituation from '../Common/markSituation.js';
import SelectProduct from './selectProduct.js';

class PPUCreate extends React.Component{
    constructor(){
        super();
        this.state={
            showFirstPage : true,
            showSecondPage : false,
            showThirdPage : false,
            selectedLearnIDs : [],
            schoolID : '',
            grade : '',
            classNum : 0
        }
    }

    selectStudentSure(selectedLearnIDs,learnIDName,schoolID,grade,classNum){
        this.setState({
            showFirstPage : false,
            showSecondPage : true,
            selectedLearnIDs : selectedLearnIDs,
            learnIDName : learnIDName,
            schoolID : schoolID,
            grade : grade,
            classNum : classNum
        })
    }
    nextStep(){
        this.setState({
            showSecondPage : false,
            showThirdPage : true
        })
    }

    render(){
        const {showFirstPage,showSecondPage,showThirdPage,selectedLearnIDs,learnIDName,schoolID,grade,classNum} = this.state;
        return(
            <div>
                {
                    showFirstPage ? <SelectStudents selectStudentSure={this.selectStudentSure.bind(this)}/> : null
                }
                {
                    showSecondPage ? <MarkSituation selectedLearnIDs={selectedLearnIDs}
                                                    learnIDName={learnIDName}
                                                    nextStep={this.nextStep.bind(this)}/> : null
                }
                {
                    showThirdPage ? <SelectProduct schoolID={schoolID}
                                                    grade={grade}
                                                    classNum={classNum}/> : null
                }
            </div>
        )
    }
}

export default PPUCreate;