import React from 'react';
import Step1 from './Step1/index.js';
import Step2 from './Step2/index.js';
import Step3 from './Step3/index.js';
class WrongAnalys extends React.Component{
    state={
        showFirst : true,
        showSecond : false,
        cityMsg : '',
        schoolID : '',
        grade : '',
        classNum : '',
        allStudentNum : 0,
        bookIdName : {},
        paperIdName: {},
        categoryType : ''
    }
    firstPageDone(schoolID,schoolMsg,grade,msgClass,allStudentNum,cityMsg){
        this.setState({
            showFirst : false,
            showSecond : true,
            schoolID : schoolID,
            schoolMsg : schoolMsg,
            grade : grade,
            classNum : msgClass,
            allStudentNum : allStudentNum,
            cityMsg : cityMsg
        })
    }
    secondPageDone(categoryType,requestData,paperData,bookIdName,paperIdName){
        this.setState({
            categoryType : categoryType,
            requestData : requestData,
            paperData : paperData,
            bookIdName : bookIdName,
            paperIdName : paperIdName,
            showThird : true,
            showSecond : false
        })
    }
    render(){
        const {showFirst,showSecond,schoolID,schoolMsg,grade,classNum,showThird,cityMsg,
                categoryType,requestData,paperData,allStudentNum,bookIdName,paperIdName} = this.state;
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
                                        schoolID={schoolID}
                                        cityMsg={cityMsg}
                                        grade={grade}
                                        classNum={classNum}
                                        requestData={requestData}
                                        bookIdName={bookIdName}
                                        paperData={paperData}
                                        paperIdName={paperIdName}
                                        categoryType={categoryType}
                                        allStudentNum={allStudentNum}/> : null
                }
            </div>
        )
    }
}

export default WrongAnalys;