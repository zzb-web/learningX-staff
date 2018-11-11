import React from 'react';
import SelectStudents from '../Common/selectStudents.js'
import MarkSituation from '../Common/markSituation.js';
import SelectProduct from './selectProduct.js';
import EPU1Setting from './EPU1Setting.js';
import PreviewHandle from './previewHandle.js';

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
            classNum : 0,
            postStudents : [],
            showFourthPage : false,
            showFifthPage : false,
            hasSelectProductID : [],
            bookData : [],
            paperData : [],
            way :1
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
    nextStep(postStudents){
        this.setState({
            postStudents : postStudents,
            showSecondPage : false,
            showThirdPage : true
        })
    }
    createTask(hasEpu1,hasSelectProductID){
       if(hasEpu1){
           this.setState({
               showFourthPage : true
           })
       }else{
           this.setState({
               showFifthPage : true,
               way : 2
           })
       }
       this.setState({
        hasSelectProductID : hasSelectProductID,
        showThirdPage : false
       })
    }

    EPU1SettingDone(bookData,paperData){
        this.setState({
            bookData : bookData,
            paperData : paperData,
            showFourthPage : false,
            showFifthPage : true,
            way : 1
        })
    }
    render(){
        const {showFirstPage,showSecondPage,showThirdPage,selectedLearnIDs,learnIDName,schoolID,grade,classNum,
            postStudents,showFourthPage,showFifthPage,hasSelectProductID,way,bookData,paperData} = this.state;
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
                                                    classNum={classNum}
                                                    createTask={this.createTask.bind(this)}/> : null
                }
                {
                    showFourthPage ? <EPU1Setting schoolID={schoolID}
                                                    grade={grade}
                                                    classNum={classNum}
                                                    EPU1SettingDone={this.EPU1SettingDone.bind(this)}/> : null
                }
                {
                    showFifthPage ? <PreviewHandle schoolID={schoolID}
                                                    grade={grade}
                                                    classNum={classNum}
                                                    postStudents={postStudents}
                                                    selectedLearnIDs={selectedLearnIDs}
                                                    hasSelectProductID={hasSelectProductID}
                                                    bookData={bookData}
                                                    paperData={paperData}
                                                    way={way}/> : null
                }

            </div>
        )
    }
}

export default PPUCreate;