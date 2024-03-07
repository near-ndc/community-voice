const {
  getLatestEdits,
  processArticles,
  getArticleNormalized,
  getArticlesIndexes,
  getAction,
} = VM.require("sayalot.near/widget/lib.article");
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "sayalot.near/widget/tests.lib.tester"
);

const isTest = false;
const baseAction = "sayALotArticle";
const currentVersion = "v0.0.4"; // EDIT: Set version

const prodAction = `${baseAction}_v${currentVersion}`;
const testAction = `test_${prodAction}`;
const versionsBaseActions = isTest ? `test_${baseAction}` : baseAction;
const action = isTest ? testAction : prodAction;

// const articles = getArticlesIndexes(action, "main").then((response) =>
//   console.log("articlesIndexes: ", response)
// );

// const realArticleIndexInMainnet = {
//   accountId: "blaze.near",
//   blockHeight: 113428547,
//   value: {
//     type: "md",
//     id: "blaze.near-1708703244668",
//   },
// };

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
          `Get: ${JSON.stringify(functionLatestEdit)}`,
          `Expected: ${JSON.stringify(expectedLatestEdit)}`,
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
  //NEED CHECK AFTER FIX OF getArticleNormalized

  const fnName = "testGetArticleNormalized";
  const articleIndex = realArticleIndexInMainnet;
  let articleNormalized;
  try {
    getArticleNormalized(articleIndex, action).then((response) => {
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

function testGetActionInIsTestPassingParameters() {
  const config = { baseActions: { article: versionsBaseActions }, isTest };
  try {
    const resultAction = getAction(currentVersion, config);
    const expectedAction = baseAction;

    const isError = resultAction === expectedAction;

    return {
      isError: isError,
      msg: isError
        ? [
            `Not returning the expected action.`,
            `Returns: ${resultAction}`,
            `Expected: ${expectedAction}`,
          ]
        : "",
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

function testGetActionInIsTestNotPassingParameters() {
  try {
    const resultAction = getAction();
    const expectedAction = baseAction;

    const isError = resultAction === expectedAction;

    return {
      isError: isError,
      msg: isError
        ? [
            `Not returning the expected action.`,
            `Returns: ${resultAction}`,
            `Expected: ${expectedAction}`,
          ]
        : "",
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

function testGetActionPassingParameters() {
  const config = { baseActions: { article: baseAction }, isTest: false };
  try {
    const resultAction = getAction(currentVersion, config);
    const expectedAction = baseAction;

    const isError = resultAction === expectedAction;

    return {
      isError: isError,
      msg: isError
        ? [
            `Not returning the expected action.`,
            `Returns: ${resultAction}`,
            `Expected: ${expectedAction}`,
          ]
        : "",
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

function testGetActionNotPassingParameters() {
  try {
    const resultAction = getAction();
    const expectedAction = baseAction;

    const isError = resultAction === expectedAction;

    return {
      isError: isError,
      msg: isError
        ? [
            `Not returning the expected action.`,
            `Returns: ${resultAction}`,
            `Expected: ${expectedAction}`,
          ]
        : "",
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

async function testGetArticlesIndexes() {
  function doResponseHavePropperIndexStructure(res) {
    return res
      .map((articleIndex) => {
        return (
          typeof articleIndex.blockHeight === "number" &&
          typeof articleIndex.accountId === "string" &&
          typeof articleIndex.value.id === "string"
        );
      })
      .includes(false);
  }
  const articlesIndexes = getArticlesIndexes(getAction(), "main");

  let isError = false;
  return articlesIndexes.then((res) => {
    try {
      if (Array.isArray(res) && res.length === 0) {
        isError = false;
      } else if (doResponseHavePropperIndexStructure(res)) {
        isError = true;
      }

      return {
        isError,
        msg: isError
          ? [
              `Articles indexes doesn't match.`,
              `Returns: ${res}`,
              `Expected: ${expectedResult}`,
            ]
          : "",
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

const [asyncComponent, setAsyncComponent] = useState(<p>Loading...</p>);

// displayTestsAsyncResults(/*[
//     {
//       fnName: "testGetArticlesIndexes",
//       fn: testGetArticlesIndexes,
//       description: "Should get an array of article index",
//       isAsync: true,
//     },
//   ]*/).then((res) => {
//   console.log("res: ", res);
//   setAsyncComponent(res);
// });

displayTestsAsyncResults([
  {
    fnName: "testGetArticlesIndexes",
    fn: testGetArticlesIndexes,
    description: "Should get an array of article index",
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
      {
        fnName: "testLatestEditEmptyIndex",
        fn: testLatestEditEmptyIndex,
      },
      // {
      //   fnName: "testGetArticleNormalized",
      //   fn: testGetArticleNormalized,
      // },
      {
        fnName: "testGetActionInIsTestPassingParameters",
        fn: testGetActionInIsTestPassingParameters,
        description: "Should get the propper action",
      },
      {
        fnName: "testGetActionInIsTestNotPassingParameters",
        fn: testGetActionInIsTestNotPassingParameters,
        description: "Should get the propper action",
      },
      {
        fnName: "testGetActionPassingParameters",
        fn: testGetActionPassingParameters,
        description: "Should get the propper action",
      },
      {
        fnName: "testGetActionNotPassingParameters",
        fn: testGetActionNotPassingParameters,
        description: "Should get the propper action",
      },
    ])}
    {asyncComponent}
  </>
);
