const { functionsToTest } = VM.require("sayalot.near/widget/lib.comment");
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "sayalot.near/widget/tests.lib.tester"
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

const commentIdToTestSplit1 = "c_NEAR.near-12312323123";
// const commentIdToTestSplit2 = "c-NEAR-near-12312323123"
const commentIdToTestSplit3 = "c_NEAR-near-12312323123";
const commentIdToTestSplit4 = "c_NEARnear-12312323123";
const commentIdToTestSplit5 = "c_NEAR_near-12312323123";
//=======================================================================End consts=========================================================================

//=======================================================================Start lib functions=======================================================================

function testGetSplittedCommentId() {
  const showThisTest = false;
  if (showThisTest) {
    console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit1));
    // console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit2))
    console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit3));
    console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit4));
    console.log(functionsToTest.getSplittedCommentId(commentIdToTestSplit5));
  }
}

testGetSplittedCommentId();

function doesCommentIdHavePropperStructure(id) {
  let splittedCommentId = functionsToTest.getSplittedCommentId(id);
  const timeStampPartOfCommentId = splittedCommentId.pop();

  const commentIdPrefix = splittedCommentId.shift();

  const commentIdUserNamePart = id.includes("/")
    ? splittedCommentId
    : splittedCommentId.join("-");

  const isTimeStampANumber = !isNaN(Number(timeStampPartOfCommentId));
  const isPrefixCorrect = commentIdPrefix === "c_";
  const isValidUserName = userNameRegEx.test(commentIdUserNamePart);

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

function doesRootIdHaveAValidFormat(rootId) {
  if (rootId.startsWith("c_")) {
    return doesCommentIdHavePropperStructure(rootId);
  } else {
    return doesArticleIdHavePropperStructure(rootId);
  }
}

function isResponseStructureWrong(res) {
  //   const resExample = [
  //     {
  //       accountId: "ayelen.near",
  //       blockHeight: 109989354,
  //       value: {
  //         type: "md",
  //         comment: {
  //           text: "a verr",
  //           timestamp: 1704812207512,
  //           commentId: "c_ayelen.near-1704812207512",
  //           rootId: "ayelen.near-1699406465524",
  //         },
  //       },
  //       isEdition: true,
  //     },
  //   ];

  if (Array.isArray(res) && res.length === 0) {
    console.log("res is an empty array");
    return false;
  }

  let errorInStructure = false;
  for (let i = 0; i < res.length; i++) {
    const commentData = res[i];
    const commentAccountId = commentData.accountId;
    const commentBlockHeight = Number(commentData.blockHeight);
    const isEdition = commentData.isEdition;

    if (typeof commentAccountId !== "string") {
      console.log(`In the element of index ${i} the accountId is not a string`);
      errorInStructure = true;
    } else if (!(typeof commentBlockHeight === "number")) {
      console.log(
        `In the element of index ${i} the blockHeight is not a Number`
      );
      errorInStructure = true;
    } else if (isEdition && typeof isEdition !== "boolean") {
      console.log(
        `In the element of index ${i} the isEdition property is not a booean`
      );
      errorInStructure = true;
    } else if (
      commentData.value.metadata &&
      !doesCommentIdHavePropperStructure(commentData.value.metadata.id)
    ) {
      console.log(
        `In the element of index ${i} doesCommentIdHavePropperStructure is returning false`
      );
      errorInStructure = true;
    } else if (typeof commentData.value.metadata.author !== "string") {
      console.log(
        `In the element of index ${i} the author property in the metadata is not a string`
      );
      errorInStructure = true;
    } else if (
      typeof commentData.value.metadata.createdTimestamp !== "number" ||
      typeof commentData.value.metadata.lastEditTimestamp !== "number"
    ) {
      console.log(
        `In the element of index ${i} the timestamps in the metadata are not a number`
      );
      errorInStructure = true;
    } else if (typeof commentData.value.metadata.versionKey !== string) {
      console.log(
        `In the element of index ${i} the versionKey in the metadata is not a string`
      );
      errorInStructure = true;
    } else if (!doesRootIdHaveAValidFormat(commentData.value.metadata.rootId)) {
      console.log(
        `In the element of index ${i} doesRootIdHaveAValidFormat is returning false`
      );
      errorInStructure = true;
    }
  }

  return errorInStructure;
}
//=======================================================================End lib functions=========================================================================

//=======================================================================Start tests=======================================================================

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
      if (isResponseStructureWrong(res)) {
        isError = true;
        msg = [
          "One or more elements on the array have an invalid structure",
          "Expected structure example: [{'accountId': accountId, 'blockHeight': number, isEdition: bool, 'value': 'comment': {'commentId': 'c-accountId-timestamp', rootId: commentId || articleId, text: string, timestamp: number}}]",
          `Returned: ${JSON.stringify(res)}`,
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
