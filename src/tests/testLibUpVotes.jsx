const {
  getUpVotes,
  normalizeOldToV_0_0_1,
  normalizeFromV0_0_1ToV0_0_2,
  normalizeFromV0_0_2ToV0_0_3,
  getUpVotesData,
  fillAction,
  getUpVoteBlackListByBlockHeight,
  getLatestEdits,
  filterInvalidUpVotes,
  normalizeUpVote,
} = VM.require("sayalot.near/widget/lib.upVotes");
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "sayalot.near/widget/tests.lib.tester"
);

//=======================================================================Start testLibUpVotes consts=======================================================================
const isTest = true;
const baseAction = "sayALotUpVote";
const currentVersion = "0.0.2"; // EDIT: Set version

const prodAction = `${baseAction}_v${currentVersion}`;
const testAction = `test_${prodAction}`;
const action = isTest ? testAction : prodAction;

const userNameRegEx = /^[a-zA-Z0-9._-]/;
//=======================================================================End testLibUpVotes consts=========================================================================

//=======================================================================Start testLibUpVotes functions=========================================================================
function doesUpVoteIdHavePropperStructure(upVoteData) {
    const upVoteId = upVoteData.value.upVoteId;
    
    let splittedUpVoteId = upVoteId.includes("-")
    ? upVoteId.split("-")
    : upVoteId.includes("/")
    ? upVoteId.split("/")
    : [];
    const timeStampPartOfUpVoteId = splittedUpVoteId.pop();
    
    const upVoteIdPrefix = splittedUpVoteId.shift();
    
    const upVoteIdUserNamePart = splittedUpVoteId.join("");
    
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
  //     sbts: ["fractal.i-am-human.near - class 1"],
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
    } else if (!doesUpVoteIdHavePropperStructure(upVoteData)) {
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

  //   const id = "ayelen.near-1708014044488";
  const id = "ayelen.near-1699406465524";
  // const id = "ayelen.near-1696980478217";
  // const id = "ayelen.near-1707407808397";
  // const id = "ayelen.near-1697150785479";
  // const id = "ayelen.near-1697152421776";

  const getUpVotesDataResult = getUpVotesData(action, id);

  let isError = false;
  let msg = "";
  return getUpVotesDataResult.then((res) => {
    try {
      if (Array.isArray(res) && res.length === 0) {
        isError = false;
        msg = "The response should be an array";
      } else if (isResponseStructureWrong(res)) {
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
      // {
      //   fnName: "testLatestEditsRepeatedArticle",
      //   fn: testLatestEditsRepeatedArticle,
      //   description: "Should remove repeated articles keeping newest",
      // },
    ])}
    {asyncComponent}
  </>
);
