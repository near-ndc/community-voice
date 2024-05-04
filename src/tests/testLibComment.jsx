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
    newStandardExample.value.metadata.id = "fakeId"; //This should get filtered
  }

  commentsExamplesToFilter.push(newStandardExample);
}

const realCommentsOfArticleExample = [
  {
    accountId: "rodrigos.near",
    blockHeight: 115306573,
    value: {
      type: "md",
      commentData: {
        text: "@ayelen.near Text of the comment",
      },
      metadata: {
        id: "comment/rodrigos.near/1711200931586",
        author: "rodrigos.near",
        createdTimestamp: 1711200931586,
        lastEditTimestamp: 1711200931586,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115306696,
    value: {
      type: "md",
      commentData: {
        text: "hola",
      },
      metadata: {
        id: "comment/rodrigos.near/1711201103830",
        author: "rodrigos.near",
        createdTimestamp: 1711201103830,
        lastEditTimestamp: 1711201103830,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115307443,
    value: {
      type: "md",
      commentData: {
        text: "chau\n\n",
      },
      metadata: {
        id: "comment/rodrigos.near/1711201969723",
        author: "rodrigos.near",
        createdTimestamp: 1711201969723,
        lastEditTimestamp: 1711201969723,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115309530,
    value: {
      type: "md",
      commentData: {
        text: "hello",
      },
      metadata: {
        id: "comment/rodrigos.near/1711204140883",
        author: "rodrigos.near",
        createdTimestamp: 1711204140883,
        lastEditTimestamp: 1711204140883,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115311095,
    value: {
      type: "md",
      commentData: {
        text: "Text edited 4",
      },
      metadata: {
        id: "comment/rodrigos.near/1711200931586",
        author: "rodrigos.near",
        createdTimestamp: 1711200931586,
        lastEditTimestamp: 1711206252539,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
        isEdition: true,
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115311866,
    value: {
      type: "md",
      commentData: {
        text: "hi\n\n",
      },
      metadata: {
        id: "comment/rodrigos.near/1711200931586",
        author: "rodrigos.near",
        createdTimestamp: 1711200931586,
        lastEditTimestamp: 1711206936516,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
        isEdition: true,
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115312070,
    value: {
      type: "md",
      commentData: {
        text: "hi2\n",
      },
      metadata: {
        id: "comment/rodrigos.near/1711200931586",
        author: "rodrigos.near",
        createdTimestamp: 1711200931586,
        lastEditTimestamp: 1711207473517,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
        isEdition: true,
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115313275,
    value: {
      type: "md",
      metadata: {
        id: "comment/rodrigos.near/1711200931586",
        isDelete: true,
        deleteTimestamp: 1711208714378,
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "article/rodrigos.near/1710843635815",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115329736,
    value: {
      type: "md",
      commentData: {
        text: "hi",
      },
      metadata: {
        id: "comment/rodrigos.near/1711229978418",
        author: "rodrigos.near",
        createdTimestamp: 1711229978418,
        lastEditTimestamp: 1711229978418,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115329933,
    value: {
      type: "md",
      commentData: {
        text: "Reply here",
      },
      metadata: {
        id: "comment/rodrigos.near/1711230237318",
        author: "rodrigos.near",
        createdTimestamp: 1711230237318,
        lastEditTimestamp: 1711230237318,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115330165,
    value: {
      type: "md",
      metadata: {
        id: "comment/rodrigos.near/1711230237318",
        isDelete: true,
        deleteTimestamp: 1711230291624,
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115330896,
    value: {
      type: "md",
      commentData: {
        text: "hello",
      },
      metadata: {
        id: "comment/rodrigos.near/1711230699967",
        author: "rodrigos.near",
        createdTimestamp: 1711230699967,
        lastEditTimestamp: 1711230699967,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115525381,
    value: {
      type: "md",
      commentData: {
        text: "Test",
      },
      metadata: {
        id: "comment/silkking.near/1711473775307",
        author: "silkking.near",
        createdTimestamp: 1711473775307,
        lastEditTimestamp: 1711473775307,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115525444,
    value: {
      type: "md",
      commentData: {
        text: "Test again",
      },
      metadata: {
        id: "comment/silkking.near/1711473849667",
        author: "silkking.near",
        createdTimestamp: 1711473849667,
        lastEditTimestamp: 1711473849667,
        versionKey: "v0.0.4",
        articleId: "article/rodrigos.near/1710843635815",
        rootId: "comment/rodrigos.near/1711204140883",
      },
    },
  },
];
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

function testProcessComments() {
  const fnName = "testProcessComments";

  const firstCommentWithIsEditionTrue = realCommentsOfArticleExample.find(
    (comment) => comment.value.metadata.isEdition
  );

  if (!firstCommentWithIsEditionTrue) {
    return {
      isError: true,
      msg: "To test this function properly you need at least 1 comment edited in realCommentsOfArticleExample",
      fnName,
    };
  }

  const realExamplesWithoutEditionMark = realCommentsOfArticleExample.map(
    (comment) => {
      const commentWithoutEditionMark = comment;

      delete comment.value.metadata.isEdition;

      return commentWithoutEditionMark;
    }
  );

  let isError = false;
  let msg = [""];
  try {
    const procesedArticles = functionsToTest.processComments(
      realExamplesWithoutEditionMark
    );

    const isThereAnIsEdition = procesedArticles.find((comment) => comment.value.metadata.isEdition);
    const isThereAnIsDelete = procesedArticles.find((comment) => comment.value.metadata.isDelete);

    if(!isThereAnIsEdition && !isThereAnIsDelete) {
      msg.push("The errors found are the following:")
    }

    if (!isThereAnIsEdition) {
      isError = true;
      msg.push(
        "-It was expected to have at least 1 comment with comment.value.metadata.isEdition === true",
      );
    }

    if (!isThereAnIsDelete) {
      isError = true;
      msg.push(
        "-It was expected to not find comments with metadata.isDelete === true",
      );
    }

    return {
      isError,
      msg: msg.flat(),
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

function testFilterInvalidComments() {
  const fnName = "testFilterInvalidComments";

  let isError = false;
  let msg = "";

  try {
    const filteredComments = functionsToTest.filterInvalidComments(
      commentsExamplesToFilter
    );

    if (!Array.isArray(filteredComments)) {
      isError = true;
      msg = "The result was expected to be an Array";
    } else if (filteredComments.length - 2 === commentsExamplesToFilterLength) {
      //This is because of the generation of the commentsExamples
      isError = true;
      msg = [
        "It was expected to filter some values that remains in the result",
        `Result: ${filteredComments}`,
      ];
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
      {
        fnName: "testProcessComments",
        fn: testProcessComments,
        description: "Check if it's filtering correctly",
      },
    ])}
    {asyncComponent}
  </>
);
