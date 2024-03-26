const { functionsToTest } = VM.require("cv.near/widget/lib.upVotes");
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "cv.near/widget/tests.lib.tester"
);

//=======================================================================Start testLibUpVotes consts=======================================================================
const isTest = true;
const baseAction = "sayALotUpVote";
const currentVersion = "v0.0.2"; // EDIT: Set version

const prodAction = `${baseAction}_${currentVersion}`;
const testAction = `test_${prodAction}`;
const action = isTest ? testAction : prodAction;

const config = { baseActions: { upVote: baseAction }, isTest };
const userNameRegEx = /^[a-zA-Z0-9._-]/;
//=======================================================================End testLibUpVotes consts=========================================================================

//=======================================================================Start testLibUpVotes functions=========================================================================
function doesUpVoteIdHavePropperStructure(upVoteData) {
  const upVoteId = upVoteData.value.metadata.id;

  let splittedUpVoteId = upVoteId.includes("/")
    ? upVoteId.split("/")
    : upVoteId.split("-");
  const timeStampPartOfUpVoteId = splittedUpVoteId.pop();

  const upVoteIdPrefix = splittedUpVoteId.shift();

  const upVoteIdUserNamePart = upVoteId.includes("/")
    ? splittedUpVoteId
    : splittedUpVoteId.join("-");

  const isTimeStampANumber = !isNaN(Number(timeStampPartOfUpVoteId));
  const isPrefixCorrect = upVoteIdPrefix === "uv";
  const isValidUserName = userNameRegEx.test(upVoteIdUserNamePart);

  return isTimeStampANumber && isPrefixCorrect && isValidUserName;
}

function isResponseStructureWrong(res) {
  // const resExample = [{
  //   accountId: "ayelen.near",
  //   blockHeight: 106745180,
  //   value: {
  //     upVoteId: "uv-ayelen.near-1701189001307",
  //     sbt: "fractal.i-am-human.near - class 1",
  //   },
  // }];

  if (Array.isArray(res) && res.length === 0) {
    console.log("res is an empty array");
    return false;
  }

  let errorInStructure = false;
  for (let i = 0; i < res.length; i++) {
    const upVoteData = res[i];
    const upVoteAccountId = upVoteData.accountId;
    const upVoteBlockHeight = Number(upVoteData.blockHeight);

    if (typeof upVoteAccountId !== "string") {
      console.log(`In the element of index ${i} the accountId is not a string`);
      errorInStructure = true;
    } else if (!(typeof upVoteBlockHeight === "number")) {
      console.log(
        `In the element of index ${i} the blockHeight is not a Number`
      );
      errorInStructure = true;
    } else if (
      upVoteData.value.metadata &&
      !doesUpVoteIdHavePropperStructure(upVoteData) &&
      typeof upVoteData.value.sbt !== "string"
    ) {
      console.log(
        `In the element of index ${i} doesUpVoteIdHavePropperStructure is returning false`
      );
      errorInStructure = true;
    }
  }

  return errorInStructure;
}
//========================================================================End testLibUpVotes functions===========================================================================

//=======================================================================Start testLibUpVotes tests==============================================================================
async function testGetUpVotesData() {
  const fnName = "testGetUpVotesData";
  // const articleId = "ayelen.near-1699406465524";
  const articleId = "test-1";

  // const articleId = "ayelen.near-1708014044488";
  // const articleId = "ayelen.near-1696980478217";
  // const articleId = "ayelen.near-1707407808397";
  // const articleId = "ayelen.near-1697150785479";
  // const articleId = "ayelen.near-1697152421776";

  const getUpVotesDataResult = functionsToTest.getUpVotesData(
    articleId,
    config
  );

  let isError = false;
  let msg = "";
  return getUpVotesDataResult.then((res) => {
    try {
      if (isResponseStructureWrong(res)) {
        isError = true;
        msg = [
          "One or more elements on the array have an invalid structure",
          "Expected structure example: [{'accountId': 'accountId', 'blockHeight': number, 'value': {'upVoteId': 'uv-accountId-timestamp', 'sbts': [sbt]}}]",
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

function testComposeDataIsWorkingAsExpected() {
  const fnName = "testComposeData";

  const articleId = "ayelen.near-1699406465524";
  // const id = "ayelen.near-1708014044488";
  // const id = "ayelen.near-1696980478217";
  // const id = "ayelen.near-1707407808397";
  // const id = "ayelen.near-1697150785479";
  // const id = "ayelen.near-1697152421776";

  const upVote = {
    isDelete: false,
    sbts: ["public"], //For the moment should only have 1 sbt in the array
  };

  let isError = false;
  let msg = "";
  try {
    const getComposeData = functionsToTest.composeData(
      articleId,
      upVote,
      currentVersion,
      config
    );
    // expectedStructure = {
    //  index: {
    //    [action]: JSON.stringify({
    //      key: articleId,
    //      value: {
    //        ...upVote,
    //      },
    //    }),
    //  },
    // }

    const expectedStructure = {
      index: {
        [action]: JSON.stringify({
          key: articleId,
          value: {
            ...upVote,
          },
        }),
      },
    };

    if (JSON.stringify(getComposeData) !== JSON.stringify(expectedStructure)) {
      isError = true;
      msg = [
        "The result is not matching the expected result",
        `Expected: ${JSON.stringify(expectedStructure)}`,
        `Result: ${JSON.stringify(getComposeData)}`,
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

function testExecuteSaveUpVote() {
  const now = Date.now();
  functionsToTest.executeSaveUpVote(
    "test-1",
    {
      upVoteData: { isDelete: false, sbts: ["public"] },
      metadata: {
        id: `uv/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/${now}`,
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        sbt: ["public"],
        createdTimestamp: now,
        lastEditTimestamp: now,
        versionKey: "v0.0.2",
      },
    },
    () => {
      console.log("testExecuteSaveUpVote commited");
    },
    () => {
      console.log("testExecuteSaveUpVote canceled");
    },
    currentVersion,
    config
  );
}

function testCreateUpVote() {
  const articleId = `a/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/${Date.now()}`;
  const upVoteData = { isDelete: false, sbt: "public" };
  const userMetadataHelper = {
    author: "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    sbt: "public",
  };
  const onCommit = () => {
    console.log("testCreateUpVote commited");
  };
  const onCancel = () => {
    console.log("testCreateUpVote canceled");
  };
  functionsToTest.createUpVote(
    config,
    articleId,
    upVoteData,
    userMetadataHelper,
    onCommit,
    onCancel
  );
}

//========================================================================End testLibUpVotes tests================================================================================

const [asyncComponent, setAsyncComponent] = useState(<p>Loading...</p>);

displayTestsAsyncResults([
  {
    fnName: "testGetUpVotesData",
    fn: testGetUpVotesData,
    description:
      "Should get the upVotesData asociated with the article that have the passed ID",
  },
]).then((res) => {
  setAsyncComponent(res);
});

return (
  <>
    {displayTestsSyncResults([
      {
        fnName: "testComposeDataIsWorkingAsExpected",
        fn: testComposeDataIsWorkingAsExpected,
        description: "Check if the structure is as the expected one",
      },
    ])}
    {asyncComponent}
    <button onClick={testExecuteSaveUpVote}>Test executeSaveUpVote</button>
    <button onClick={testCreateUpVote}>Test testCreateUpVote</button>
  </>
);
