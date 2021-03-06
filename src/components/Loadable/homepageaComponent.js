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

const StudentInfoEntryComponent = Loadable({
  loader: () => import('../StudentInfoEntry/index.js'),
  loading: MyLoadingComponent,
});
 class StudentInfoEntryLoadable extends React.Component {
  render() {
    return <StudentInfoEntryComponent/>;
  }
}

const BatchInputComponent = Loadable({
  loader: () => import('../BatchInput/index.js'),
  loading: MyLoadingComponent,
});
 class BatchInputLoadable extends React.Component {
  render() {
    return <BatchInputComponent/>;
  }
}

const BatchDownloadComponent = Loadable({
  loader: () => import('../BatchDownload/index.js'),
  loading: MyLoadingComponent,
});
 class BatchDownloadLoadable extends React.Component {
  render() {
    return <BatchDownloadComponent/>;
  }
}

const EPU2Component = Loadable({
  loader: () => import('../EPU2/index.js'),
  loading: MyLoadingComponent,
});
 class EPU2Loadable extends React.Component {
  render() {
    return <EPU2Component/>;
  }
}
const BuildSituationComponent = Loadable({
  loader: () => import('../BuildSituation/index.js'),
  loading: MyLoadingComponent,
});
 class BuildSituationLoadable extends React.Component {
  render() {
    return <BuildSituationComponent/>;
  }
}


const MarkSituationComponent = Loadable({
  loader: () => import('../MarkSituation/index.js'),
  loading: MyLoadingComponent,
});
 class MarkSituationLoadable extends React.Component {
  render() {
    return <MarkSituationComponent/>;
  }
}

const WrongAnalysComponent = Loadable({
  loader: () => import('../WrongAnalys/index.js'),
  loading: MyLoadingComponent,
});
 class WrongAnalysLoadable extends React.Component {
  render() {
    return <WrongAnalysComponent/>;
  }
}

const PPUCreateComponent = Loadable({
  loader: () => import('../PPUCreate/index.js'),
  loading: MyLoadingComponent,
});
 class PPUCreateLoadable extends React.Component {
  render() {
    return <PPUCreateComponent/>;
  }
}

export {
        PassWordFormLoadable,
        ClassErrorTestLoadable,
        ClassInfoEntryLoadable,
        ClassStudyMaterialLoadable,
        StudyMaterialSummaryLoadable,
        StudentInfoEntryLoadable,
        BatchInputLoadable,
        BatchDownloadLoadable,
        EPU2Loadable,
        BuildSituationLoadable,
        MarkSituationLoadable,
        WrongAnalysLoadable,
        PPUCreateLoadable
      }
