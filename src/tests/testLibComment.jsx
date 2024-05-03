const {
  functionsToTest,
  validateCommentData,
  validateMetadata,
  doesCommentHavePropperStructure,
} = VM.require("communityvoice.ndctools.near/widget/lib.comment");

const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "communityvoice.ndctools.near/widget/tests.lib.tester"
);

//=======================================================================Start consts=======================================================================
const isTest = true;
const baseAction = "sayALotComment";
const currentVersion = "v0.0.3"; // EDIT: Set version

const prodAction = `${baseAction}_${currentVersion}`;
const testAction = `test_${prodAction}`;
const action = isTest ? testAction : prodAction;

const now = Date.now();
const idPrefix = "comment";

const config = { baseActions: { comment: baseAction }, isTest };
const userNameRegEx = /^[a-zA-Z0-9._-]/;

// const commentIdToTestSplit1 = "c_NEAR.near-12312323123";
// // const commentIdToTestSplit2 = "c-NEAR-near-12312323123"
// const commentIdToTestSplit3 = "c_NEAR-near-12312323123";
// const commentIdToTestSplit4 = "c_NEARnear-12312323123";
// const commentIdToTestSplit5 = "c_NEAR_near-12312323123";
// const commentIdToTestSplit6 = "c/NEAR_near-12312323123";
// const commentIdToTestSplit7 = "c/NEAR-near-12312323123";
// const commentIdToTestSplit8 = "c/NEARnear-12312323123";
const standardAuthor = "silkking.near";
const realArticleId = "article/silkking.near/1711678364022";
const standardReplyingTo =
  "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb";
const standardTestCommentId = `${idPrefix}/${standardAuthor}/${now}`;

const metadataExample = {
  id: standardTestCommentId,
  author: standardAuthor,
  createdTimestamp: now,
  lastEditTimestamp: now,
  versionKey: currentVersion, // Check `const versions` -> Object.keys(versions)
  articleId: realArticleId,
  rootId: standardReplyingTo,
};

const fullCommentExample = {
  commentData: { text: "Random text" },
  metadata: metadataExample,
};

const commentsExamplesToFilter = [];
const commentsExamplesToFilterLength = 4;

for (let i = 0; i < commentsExamplesToFilterLength; i++) {
  const newStandardExample = {
    blockHeight: i,
    accountId: standardAuthor,
    value: fullCommentExample,
  };

  let newId = newStandardExample.value.metadata.id.slice(0, -1) + i;
  
  newStandardExample.value.metadata.id = newId;

  if (i === 1) {
    newStandardExample.blockHeight = 98588599; //This is in the blacklist
  } else if (i === 2) {
    newStandardExample.value.metadata.id = "fakeId";//This should get filtered
  }

  commentsExamplesToFilter.push(newStandardExample);
}
//=======================================================================End consts=========================================================================

//=======================================================================Start lib functions=======================================================================

// function testGetSplittedCommentId() {
//   const showThisTest = false;
//   if (showThisTest) {
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit1));
//     // console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit2))
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit3));
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit4));
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit5));
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit6));
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit7));
//     console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit8));
//   }
// }

// testGetSplittedCommentId();

function doesCommentIdHavePropperStructure(id) {
  let splittedCommentId = functionsToTest.getSplittedCommentId(id);
  const timeStampPartOfCommentId = splittedCommentId.pop();

  const commentIdPrefix = splittedCommentId.shift();

  const commentIdUserNamePart = splittedCommentId.length === 1;

  const isTimeStampANumber = !isNaN(Number(timeStampPartOfCommentId));
  const isPrefixCorrect = commentIdPrefix === "comment";
  const isValidUserName = userNameRegEx.test(commentIdUserNamePart);

  if (!isTimeStampANumber) {
    console.log("Timestamp is not a number: ", timeStampPartOfCommentId);
  }

  if (!isPrefixCorrect) {
    console.log(
      "Prefix is not correct. Expected: 'comment'. Result: ",
      commentIdPrefix
    );
  }

  if (!isValidUserName) {
    console.log("Not a valid userName: ", commentIdUserNamePart);
  }

  return isTimeStampANumber && isPrefixCorrect && isValidUserName;
}

//=======================================================================End lib functions=========================================================================

//=======================================================================Start tests=======================================================================

// function name() {
//   const fnName = "name";

//   let isError = false;
//   let msg = "";
//   try {
//     return {
//       isError,
//       msg,
//       fnName,
//     };
//   } catch (err) {
//     return {
//       isError: true,
//       msg: err.message,
//       fnName,
//     };
//   }
// }

function testFilterInvalidComments() {
  const fnName = "testFilterInvalidComments";

  let isError = false;
  let msg = "";

  try {
    const filteredComments =
      functionsToTest.filterInvalidComments(commentsExamplesToFilter);

    if(!Array.isArray(filteredComments)) {
      isError = true;
      msg = "The result was expected to be an Array";
    } else if (filteredComments.length - 2 === commentsExamplesToFilterLength) { //This is because of the generation of the commentsExamples
      isError = true;
      msg = ["It was expected to filter some values that remains in the result", `Result: ${filteredComments}`]
    }

    return {
      isError,
      msg,
      fnName,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }
}

function testGetCommentBlackListByBlockHeight() {
  const fnName = "testGetCommentBlackListByBlockHeight";

  let isError = false;
  let msg = "";
  try {
    const blockHeightBlackList =
      functionsToTest.getCommentBlackListByBlockHeight();

    if (!Array.isArray(blockHeightBlackList)) {
      isError = true;
      msg = [
        "The function is expected to return an Array",
        "Instead it's returning:",
        `${JSON.stringify(blockHeightBlackList)}`,
      ];
    } else {
      blockHeightBlackList.forEach((value) => {
        if (isNaN(value)) {
          isError = true;
          msg = "One or more values of the array is not a number";
        }
      });
    }

    return {
      isError,
      msg,
      fnName,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }
}

function normalizeFromV0_0_3ToV0_0_4() {
  const fnName = "normalizeFromV0_0_3ToV0_0_4";

  const commentExample = {
    isEdition: true,
    value: {
      comment: {
        commentId: standardTestCommentId,
        text: "Standard text",
        rootId: realArticleId,
        timestamp: 1,
      },
    },
  };

  let isError = false;
  let msg = "";
  try {
    const normalizedComment =
      functionsToTest.normalizeFromV0_0_3ToV0_0_4(commentExample);
    const commentStructureCheck =
      doesCommentHavePropperStructure(normalizedComment);
    if (commentStructureCheck.isError) {
      isError = true;
      msg = [
        "There's an unexpected modification in the comment structure",
        commentStructureCheck.allStructureErrors,
      ].flat();
    }
    return {
      isError,
      msg,
      fnName,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }
}

function testNormalizeFromV0_0_2ToV0_0_3() {
  const fnName = "testNormalizeFromV0_0_2ToV0_0_3";

  const commentExample = {
    value: { comment: { originalCommentId: "originalCommentId", id: "id" } },
  };

  let isError = false;
  let msg = "";
  let allStructureErrors = [];
  try {
    const normalizedComment =
      functionsToTest.normalizeFromV0_0_2ToV0_0_3(commentExample);

    if (      
      normalizedComment.value.comment.rootId &&
      typeof normalizedComment.value.comment.rootId !== "string"
    ) {
      isError = true;
      allStructureErrors.push(
        "normalizedComment.value.comment.rootId is not a string"
      );
    }

    if (normalizedComment.value.comment.originalCommentId) {
      isError = true;
      allStructureErrors.push(
        "normalizedComment.value.comment.originalCommentId should not exist"
      );
    }

    if (normalizedComment.value.comment.id) {
      isError = true;
      allStructureErrors.push(
        "normalizedComment.value.comment.id should not exist"
      );
    }

    const commentStructureCheck = { isError, allStructureErrors };

    if (commentStructureCheck.isError) {
      isError = true;
      msg = [
        "There's an unexpected modification in the comment structure",
        commentStructureCheck.allStructureErrors,
      ].flat();
    }
    return {
      isError,
      msg,
      fnName,
    };
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }
}

async function testGetComments() {
  const fnName = "testGetComments";
  const articleId = "ayelen.near-1699406465524";

  // const articleId = "test-1";

  // const articleId = "ayelen.near-1708014044488";
  // const articleId = "ayelen.near-1696980478217";
  // const articleId = "ayelen.near-1707407808397";
  // const articleId = "ayelen.near-1697150785479";
  // const articleId = "ayelen.near-1697152421776";

  const getCommentsDataResult = functionsToTest.getComments(articleId, config);

  let isError = false;
  let msg = "";
  return getCommentsDataResult.then((res) => {
    try {
      const isResponseStructureWrong = doesCommentHavePropperStructure(res);
      if (isResponseStructureWrong.errorInStructure) {
        isError = true;
        msg = [
          "One or more elements on the array have an invalid structure",
          `Returned: ${JSON.stringify(res)}`,
          isResponseStructureWrong,
        ].flat();
      }

      return {
        isError,
        msg,
        fnName,
      };
    } catch (err) {
      return {
        isError: true,
        msg: err.message,
        fnName,
      };
    }
  });
}

//========================================================================End tests================================================================================
const [asyncComponent, setAsyncComponent] = useState(<p>Loading...</p>);

displayTestsAsyncResults([
  //   {
  //     fnName: "testGetCommentsData",
  //     fn: testGetCommentsData,
  //     description:
  //       "Should get the upVotesData asociated with the article that have the passed ID",
  //   },
  {
    fnName: "testGetComments",
    fn: testGetComments,
    description:
      "Should get the commentsData asociated with the article that have the passed ID",
  },
]).then((res) => {
  setAsyncComponent(res);
});

return (
  <>
    {displayTestsSyncResults([
      //   {
      //     fnName: "testComposeDataIsWorkingAsExpected",
      //     fn: testComposeDataIsWorkingAsExpected,
      //     description: "Check if the structure is as the expected one",
      //   },
      {
        fnName: "testNormalizeFromV0_0_2ToV0_0_3",
        fn: testNormalizeFromV0_0_2ToV0_0_3,
        description: "Check if the structure is as the expected one",
      },
      {
        fnName: "normalizeFromV0_0_3ToV0_0_4",
        fn: normalizeFromV0_0_3ToV0_0_4,
        description: "Check if the structure is as the expected one",
      },
      {
        fnName: "testGetCommentBlackListByBlockHeight",
        fn: testGetCommentBlackListByBlockHeight,
        description: "Check if it's returning an array of numbers",
      },
      {
        fnName: "testFilterInvalidComments",
        fn: testFilterInvalidComments,
        description: "Check if it's filtering correctly",
      },
    ])}
    {asyncComponent}
  </>
);
