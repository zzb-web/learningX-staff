import React from  'react';
import Loadable from 'react-loadable';
function MyLoadingComponent({ error }) {
    if (error) {
      return <div>Error!</div>;
    } else {
      return <div>Loading...</div>;
    }
  }


const PassWordFormComponent = Loadable({
  loader: () => import('../PassWord/index.js'),
  loading: MyLoadingComponent,
});
 class PassWordFormLoadable extends React.Component {
  render() {
    return <PassWordFormComponent/>;
  }
}

const ClassErrorTestComponent = Loadable({
  loader: () => import('../ClassErrorTest/index.js'),
  loading: MyLoadingComponent,
});
 class ClassErrorTestLoadable extends React.Component {
  render() {
    return <ClassErrorTestComponent/>;
  }
}


const ClassInfoEntryComponent = Loadable({
  loader: () => import('../ClassInfoEntry/index.js'),
  loading: MyLoadingComponent,
});
 class ClassInfoEntryLoadable extends React.Component {
  render() {
    return <ClassInfoEntryComponent/>;
  }
}

const ClassStudyMaterialComponent = Loadable({
  loader: () => import('../ClassStudyMaterial/index.js'),
  loading: MyLoadingComponent,
});
 class ClassStudyMaterialLoadable extends React.Component {
  render() {
    return <ClassStudyMaterialComponent/>;
  }
}

const StudyMaterialSummaryComponent = Loadable({
  loader: () => import('../StudyMaterialSummary/index.js'),
  loading: MyLoadingComponent,
});
 class StudyMaterialSummaryLoadable extends React.Component {
  render() {
    return <StudyMaterialSummaryComponent/>;
  }
}

export {
        // HomepageLoadable,
        // ErrorSumLoadable , 
        // InfoInputLoadable ,
        PassWordFormLoadable,
        // ReviewOfErrorLoadable,
        // QuestionTestLoadable,
        // ErrorDetectionLoadable,
        // TestDetectionLoadable,
        ClassErrorTestLoadable,
        ClassInfoEntryLoadable,
        ClassStudyMaterialLoadable,
        StudyMaterialSummaryLoadable
      }
