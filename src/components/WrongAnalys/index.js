import React from 'react';
import Step1 from './Step1/index.js';
import Step2 from './Step2/index.js';
import Step3 from './Step3/index.js';
class WrongAnalys extends React.Component{
    state={
        showFirst : true,
        showSecond : false,
        schoolID : '',
        grade : '',
        classNum : '',
        allStudentNum : 0
    }
    firstPageDone(schoolID,schoolMsg,grade,msgClass,allStudentNum){
        this.setState({
            showFirst : false,
            showSecond : true,
            schoolID : schoolID,
            schoolMsg : schoolMsg,
            grade : grade,
            classNum : msgClass,
            allStudentNum : allStudentNum
        })
    }
    secondPageDone(categoryType,requestData,paperData){
        this.setState({
            categoryType : categoryType,
            requestData : requestData,
            paperData : paperData,
            showThird : true,
            showSecond : false
        })
    }
    render(){
        const {showFirst,showSecond,schoolID,schoolMsg,grade,classNum,showThird,categoryType,requestData,paperData,allStudentNum} = this.state;
        return(
            <div>
                {
                    showFirst ?　<Step1 firstPageDone={this.firstPageDone.bind(this)}/> : null
                }
                {
                    showSecond ? <Step2 schoolID={schoolID}
                                        grade={grade}
                                        classNum={classNum}
                                        secondPageDone={this.secondPageDone.bind(this)}/> : null
                }
                {
                    showThird ? <Step3 schoolMsg={schoolMsg}
                                        grade={grade}
                                        classNum={classNum}
                                        requestData={requestData}
                                        paperData={paperData}
                                        allStudentNum={allStudentNum}/> : null
                }
            </div>
        )
    }
}

export default WrongAnalys;