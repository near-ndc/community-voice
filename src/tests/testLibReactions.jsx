const { getReactions } = VM.require(
  "communityvoice.ndctools.near/widget/lib.reactions"
);
const { getConfig } = VM.require(
  "communityvoice.ndctools.near/widget/config.CommunityVoice"
);
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "communityvoice.ndctools.near/widget/tests.lib.tester"
);

const isTest = true;
const baseAction = "communityVoiceReaction";
const currentVersion = "v0.0.2";

const prodAction = `${baseAction}_${currentVersion}`;
const testAction = `test_${prodAction}`;
const action = isTest ? testAction : prodAction;

const config = getConfig(isTest);

function getIsResponseStructureWrong(res) {
  //   const resExample = {
  //     reactionsStatistics: [
  //       {
  //         accounts: ["rodrigos.near"],
  //         emoji: "👍",
  //       },
  //       {
  //         accounts: [
  //           "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
  //         ],
  //         emoji: "🔥",
  //       },
  //     ],
  //     userEmoji: undefined
  //   };

  let errorDescriptionList = [];
  let errorInStructure = false;

  if (!res.reactionsStatistics) {
    errorDescriptionList.push("res.reactionsStatistics does not exist");
    errorInStructure = true;

    return { errorInStructure, errorDescriptionList };
  }

  if (!Array.isArray(res.reactionsStatistics)) {
    errorDescriptionList.push("res.reactionsStatistics is not an Array");
    errorInStructure = true;

    return { errorInStructure, errorDescriptionList };
  }

  res.reactionsStatistics.forEach((reaction, index) => {
    if (typeof reaction.emoji !== "string") {
      errorDescriptionList.push(
        `In the reaction of index ${index}, reaction.emoji does not exists`
      );
      errorInStructure = true;
    }
    if (!Array.isArray(reaction.accounts)) {
      errorDescriptionList.push(
        `In the reaction ${
          reaction.emoji ? reaction.emoji : `of index ${index}`
        }, reaction.accounts is not an array`
      );
      errorInStructure = true;
    } else if (reaction.accounts.length === 0) {
      errorDescriptionList.push(
        `In the reaction ${
          reaction.emoji ? reaction.emoji : `of index ${index}`
        }, reaction.accounts is empty`
      );
      errorInStructure = true;
    }
  });
  if (res.userEmoji && typeof res.userEmoji !== "string") {
    errorDescriptionList.push("res.userEmoji is not an string");
    errorInStructure = true;
  }

  return { errorInStructure, errorDescriptionList };
}

async function testGetReactions() {
  const fnName = "testGetReactions";
  const articleId = "article/silkking.near/1711678364022";

  const getReactionsDataResult = getReactions(
    config,
    articleId,
    "silkking.near"
  );

  let isError = false;
  let msg = "";
  return getReactionsDataResult.then((res) => {
    try {
      const isResponseStructureWrong = getIsResponseStructureWrong(res);

      if (isResponseStructureWrong.errorInStructure) {
        isError = true;
        msg = [
          "Response doesn't match with the expected output",
          `Returned: ${JSON.stringify(res)}`,
        ];

        msg.push(...isResponseStructureWrong.errorDescriptionList);
      }

      return {
        isError,
        msg,
        fnName,
      }
    } catch (err) {
      return {
        isError: true,
        msg: err.message,
        fnName,
      };
    }
  });
}

const [asyncComponent, setAsyncComponent] = useState(<p>Loading...</p>);

displayTestsAsyncResults([
  {
    fnName: "testGetReactions",
    fn: testGetReactions,
    description:
      "Should get the reactions asociated with the article that have the passed ID",
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
