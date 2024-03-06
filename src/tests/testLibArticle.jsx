const {
  getLatestEdits,
  processArticles,
  getArticleNormalized,
  getArticlesIndexes,
} = VM.require("sayalot.near/widget/lib.article");
const { displayTestsResults } = VM.require(
  "sayalot.near/widget/tests.lib.tester"
);

const isTest = false;
const baseAction = "communityVoiceArticle";
const currentVersion = "0.0.2"; // EDIT: Set version

const prodAction = `${baseAction}_v${currentVersion}`;
const testAction = `test_${prodAction}`;
const versionsBaseActions = isTest ? `test_${baseAction}` : baseAction;
const action = isTest ? testAction : prodAction;

// const articles = getArticlesIndexes(action, "main").then((response) =>
//   console.log("articlesIndexes: ", response)
// );

const realArticleIndexInMainnet = {
  "accountId": "blaze.near",
  "blockHeight": 113428547,
  "value": {
      "type": "md",
      "id": "blaze.near-1708703244668"
  }
};

function testLatestEditsRepeatedArticle() {
  const fnName = "testLatestEdits";
  const articleIndexes = [
    {
      accountId: "test.near",
      blockHeight: 191891118,
      value: {
        type: "md",
        id: "test.near-1651981918",
      },
    },
    {
      accountId: "test.near",
      blockHeight: 191891117,
      value: {
        type: "md",
        id: "test.near-1651981918",
      },
    },
    {
      accountId: "test.near",
      blockHeight: 191891116,
      value: {
        type: "md",
        id: "test.near-1651981919",
      },
    },
  ];

  let functionLatestEdit;
  try {
    functionLatestEdit = getLatestEdits(articleIndexes);
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const expectedLatestEdit = [
    {
      accountId: "test.near",
      blockHeight: 191891118,
      value: {
        type: "md",
        id: "test.near-1651981918",
      },
    },
    {
      accountId: "test.near",
      blockHeight: 191891116,
      value: {
        type: "md",
        id: "test.near-1651981919",
      },
    },
  ];
  const isError =
    JSON.stringify(functionLatestEdit) !== JSON.stringify(expectedLatestEdit);
  return {
    isError: isError,
    msg: isError
      ? [
          `Items don't match.`,
          `Item 1: ${JSON.stringify(functionLatestEdit)}`,
          `Item 2: ${JSON.stringify(expectedLatestEdit)}`,
        ]
      : "",
    fnName,
  };
  // return JSON.stringify(functionLatestEdit) === JSON.stringify(expectedLatestEdit)
}

function testLatestEditEmptyIndex() {
  const fnName = "testLatestEditEmptyIndex";
  const articleIndexes = [];
  let functionLatestEdit;
  try {
    functionLatestEdit = getLatestEdits(articleIndexes);
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const expectedLatestEdit = [];
  const isError =
    JSON.stringify(functionLatestEdit) !== JSON.stringify(expectedLatestEdit);
  return {
    isError: isError,
    msg: isError
      ? `Items don't match output ${functionLatestEdit}, expected ${expectedLatestEdit}`
      : "",
    fnName,
  };
}

function testGetArticleNormalized() {
  const fnName = "testGetArticleNormalized";
  const articleIndex = realArticleIndexInMainnet;
  let articleNormalized;
  try {
    getArticleNormalized(articleIndex, action).then((response) => {
      console.log("response: ", response);
      const expectedNormalizedArticle = [];
      const isError =
        JSON.stringify(response) !== JSON.stringify(expectedLatestEdit);
      return {
        isError: isError,
        msg: isError
          ? `Items don't match output ${articleNormalized}, expected ${expectedLatestEdit}`
          : "",
        fnName,
      };
    });
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }
}

return (
  <>
    {displayTestsResults([
      {
        fnName: "testLatestEditsRepeatedArticle",
        fn: testLatestEditsRepeatedArticle,
      },
      {
        fnName: "testLatestEditEmptyIndex",
        fn: testLatestEditEmptyIndex,
      },
      {
        fnName: "testGetArticleNormalized",
        fn: testGetArticleNormalized,
      },
    ])}
  </>
);
