import React from  'react';
import Loadable from 'react-loadable';
function MyLoadingComponent({ error }) {
    if (error) {
      return <div>Error!</div>;
    } else {
      return <div>Loading...</div>;
    }
  }
// const HomepageComponent = Loadable({
//   loader: () => import('../Homepage/index.js'),
//   loading: MyLoadingComponent,
// });
//  class HomepageLoadable extends React.Component {
//   render() {
//     return <HomepageComponent/>;
//   }
// }

// const ErrorSumComponent = Loadable({
//   loader: () => import('../ErrorSum/index.js'),
//   loading: MyLoadingComponent,
// });
//  class ErrorSumLoadable extends React.Component {
//   render() {
//     return <ErrorSumComponent/>;
//   }
// }

// const InfoInputComponent = Loadable({
//   loader: () => import('../InfoInput/index.js'),
//   loading: MyLoadingComponent,
// });
//  class InfoInputLoadable extends React.Component {
//   render() {
//     return <InfoInputComponent/>;
//   }
// }


const PassWordFormComponent = Loadable({
  loader: () => import('../PassWord/index.js'),
  loading: MyLoadingComponent,
});
 class PassWordFormLoadable extends React.Component {
  render() {
    return <PassWordFormComponent/>;
  }
}


// const ReviewOfErrorComponent = Loadable({
//   loader: () => import('../ReviewOfError/index.js'),
//   loading: MyLoadingComponent,
// });
//  class ReviewOfErrorLoadable extends React.Component {
//   render() {
//     return <ReviewOfErrorComponent/>;
//   }
// }


// const QuestionTestComponent = Loadable({
//   loader: () => import('../QuestionTest/index.js'),
//   loading: MyLoadingComponent,
// });
//  class QuestionTestLoadable extends React.Component {
//   render() {
//     return <QuestionTestComponent/>;
//   }
// }


// const ErrorDetectionComponent = Loadable({
//   loader: () => import('../ErrorDetection/index.js'),
//   loading: MyLoadingComponent,
// });
//  class ErrorDetectionLoadable extends React.Component {
//   render() {
//     return <ErrorDetectionComponent/>;
//   }
// }


// const TestDetectionComponent = Loadable({
//   loader: () => import('../TestDetection/index.js'),
//   loading: MyLoadingComponent,
// });
//  class TestDetectionLoadable extends React.Component {
//   render() {
//     return <TestDetectionComponent/>;
//   }
// }


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
        ClassStudyMaterialLoadable
      }
