const { functionsToTest } = VM.require(
  "communityvoice.ndctools.near/widget/lib.comment"
);
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
  let splittedCommentId = functionsToTest.getSplittedCommentIdV0_0_3(id);
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

function doesArticleIdHavePropperStructure(articleId) {
  let splittedArticleId = articleId.includes("/")
    ? articleId.split("/")
    : articleId.split("-");

  const timeStampPartOfArticleId = splittedArticleId.pop();

  const articleIdUserNamePart = articleId.includes("/")
    ? splittedArticleId
    : splittedArticleId.join("-");

  const isTimeStampANumber = !isNaN(Number(timeStampPartOfArticleId));
  const isValidUserName = userNameRegEx.test(articleIdUserNamePart);

  return isTimeStampANumber && isValidUserName;
}

function getIsResponseStructureWrong(res) {
  // const resExample = [
  //   {
  //     accountId: "ayelen.near",
  //     blockHeight: 106744173,
  //     value: {
  //       type: "md",
  //       commentData: {
  //         text: "asdasd",
  //       },
  //       metadata: {
  //         id: "comment/ayelen.near/1701187800370",
  //         author: "ayelen.near",
  //         createdTimestamp: 1714420835216,
  //         lastEditTimestamp: 1714420835216,
  //         rootId: "ayelen.near-1699406465524",
  //         versionKey: "v0.0.4",
  //       },
  //     },
  //   },
  // ];
  let errorDescriptionList = [];

  if (Array.isArray(res) && res.length === 0) {
    errorDescriptionList.push("res is an empty array");
    return false;
  }

  let errorInStructure = false;
  for (let i = 0; i < res.length; i++) {
    const comment = res[i];
    const commentAccountId = comment.accountId;
    const commentBlockHeight = Number(comment.blockHeight);

    if (typeof commentAccountId !== "string") {
      errorDescriptionList.push(
        `In the comment of index ${i} the accountId is not a string`
      );
      errorInStructure = true;
    }
    if (!(typeof commentBlockHeight === "number")) {
      errorDescriptionList.push(
        `In the comment of index ${i} the blockHeight is not a Number`
      );
      errorInStructure = true;
    }
    if (
      comment.value.metadata &&
      !doesCommentIdHavePropperStructure(comment.value.metadata.id)
    ) {
      errorDescriptionList.push(
        `In the comment of index ${i} doesCommentIdHavePropperStructure is returning false`
      );
      errorInStructure = true;
    }
    if (typeof comment.value.metadata.author !== "string") {
      errorDescriptionList.push(
        `In the comment of index ${i} the author property in the metadata is not a string`,
        comment
      );
      errorInStructure = true;
    }
    if (
      typeof comment.value.metadata.createdTimestamp !== "number" ||
      typeof comment.value.metadata.lastEditTimestamp !== "number"
    ) {
      errorDescriptionList.push(
        `In the comment of index ${i} the timestamps in the metadata are not a number`
      );
      errorInStructure = true;
    }
    if (typeof comment.value.metadata.versionKey !== "string") {
      errorDescriptionList.push(
        `In the comment of index ${i} the versionKey in the metadata is not a string`
      );
      errorInStructure = true;
    }
    if (!doesCommentIdHavePropperStructure(comment.value.metadata.rootId)) {
      errorDescriptionList.push(
        `In the comment of index ${i} doesCommentIdHavePropperStructure is returning false`
      );
      errorInStructure = true;
    }
  }

  return { errorInStructure, errorDescriptionList };
}
//=======================================================================End lib functions=========================================================================

//=======================================================================Start tests=======================================================================

function testCreateComment() {}

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
      const isResponseStructureWrong = getIsResponseStructureWrong(res);
      if (isResponseStructureWrong.errorInStructure) {
        isError = true;
        msg = [
          "One or more elements on the array have an invalid structure",
          `Returned: ${JSON.stringify(res)}`,
        ];

        msg.push(...isResponseStructureWrong.errorDescriptionList);
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
    ])}
    {asyncComponent}
  </>
);
