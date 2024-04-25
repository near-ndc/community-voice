const {
  getLatestEdits,
  processArticles,
  getArticleNormalized,
  getArticlesIndexes,
  getAction,
  filterFakeAuthors,
  getArticleBlackListByArticleId,
  getArticleBlackListByBlockHeight,
  getArticlesVersions,
} = VM.require("communityvoice.ndctools.near/widget/lib.article");
const { displayTestsSyncResults, displayTestsAsyncResults } = VM.require(
  "communityvoice.ndctools.near/widget/tests.lib.tester"
);

const { getConfig } = VM.require(
  "communityvoice.ndctools.near/widget/config.CommunityVoice"
);

const isTest = true;
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

function doesArticleHavePropperStructure(article) {
  return (
    article.accountId &&
    typeof article.accountId === "string" &&
    article.blockHeight &&
    typeof article.blockHeight === "number" &&
    article.value &&
    typeof article.value === "object" &&
    article.value.articleData &&
    typeof article.value.articleData === "object" &&
    article.value.articleData.body &&
    article.value.articleData.title &&
    article.value.metadata.author &&
    article.value.metadata.author === "string" &&
    article.value.metadata.id &&
    article.value.metadata.id === "string"
  );
}

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

function testGetActionInIsTestPassingParameters() {
  const fnName = "testGetActionInIsTestPassingParameters";
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
  const fnName = "testGetActionInIsTestNotPassingParameters";
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
  const fnName = "testGetActionPassingParameters";
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
  const fnName = "testGetActionNotPassingParameters";
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

function testFilterFakeAuthorsAuthorDoesntMatch() {
  const fnName = "testFilterFakeAuthors";
  const articleData = {
    author: "a",
  };
  const articleIndexData = {
    accountId: "b",
  };
  let result;
  try {
    result = filterFakeAuthors(articleData, articleIndexData);
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const expectedLatestEdit = undefined;

  const isError = !(result === expectedLatestEdit);
  return {
    isError: isError,
    msg: isError
      ? `This item should be filtered and it's not been filtered`
      : "",
    fnName,
  };
}

function testFilterFakeAuthorsMatchAuthor() {
  const fnName = "testFilterFakeAuthors";
  const articleData = {
    author: "a",
  };
  const articleIndexData = {
    accountId: "a",
  };
  let result;
  try {
    result = filterFakeAuthors(articleData, articleIndexData);
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const expectedLatestEdit = articleData;

  const isError = JSON.stringify(result) !== JSON.stringify(expectedLatestEdit);
  return {
    isError: isError,
    msg: isError
      ? `This item should not be filtered and it's been filtered`
      : "",
    fnName,
  };
}

function testGetArticleBlackListByArticleIdReturnValidAccountIds() {
  const fnName = "testGetArticleBlackListByArticleIdReturnValidAccountIds";

  let result;
  try {
    result = getArticleBlackListByArticleId();
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const arrayArticleIdIsValid = result.map((articleId) => {
    //articleId example: "silkking.near-1696797896796"
    const splitedArticleId = articleId.split("-");

    const timeStampPartOfArticleId = splitedArticleId.pop();

    let userNamePartOfArticleId;
    if (splitedArticleId.length === 1) {
      userNamePartOfArticleId = splitedArticleId;
    } else {
      userNamePartOfArticleId = splitedArticleId.join("-");
    }

    const userNameRegEx = /^[a-zA-Z0-9._-]/;

    const isTimeStampANumber = !isNaN(Number(timeStampPartOfArticleId));
    const isValidUserName = userNameRegEx.test(userNamePartOfArticleId);

    return isTimeStampANumber && isValidUserName;
  });

  const isError = arrayArticleIdIsValid.includes(false);

  return {
    isError: isError,
    msg: isError
      ? `One or more articleId passed does not have the correct format`
      : "",
    fnName,
  };
}

function testGetArticleBlackListByBlockHeightReturnsNumbers() {
  const fnName = "testGetArticleBlackListByBlockHeightReturnsNumbers";
  let result;
  try {
    result = getArticleBlackListByBlockHeight();
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const arrayIsResultANumber = result.map((blockHeihgt) => {
    const isResultANumber = !isNaN(Number(blockHeihgt));

    return isResultANumber;
  });

  const isError = arrayIsResultANumber.includes(false);

  return {
    isError: isError,
    msg: isError ? `One or more blockHeights passed are not numbers` : "",
    fnName,
  };
}

async function testGetArticlesIndexes() {
  const fnName = "testGetArticlesIndexes";
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

async function testGetArticlesVersions() {
  const fnName = "testGetArticlesVersions";

  const articleId =
    "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711582852141";

  const articlesVersions = getArticlesVersions(getConfig(isTest), articleId);

  function versionsHavePropperStructure(versions) {
    return versions.map((article) => {
      return doesArticleHavePropperStructure(article);
    });
  }

  let isError = false;
  let msg = "";
  return articlesVersions.then((res) => {
    try {
      if (!Array.isArray(res) || (Array.isArray(res) && res.length === 0)) {
        isError = true;
        msg = [
          `getArticlesVersions is expecting an Array with all the versions`,
          `it returns: ${JSON.stringify(res)}`,
        ];
      } else if (!versionsHavePropperStructure(res).includes(false)) {
        isError = true;
        msg = [
          `One or more version doesn't have the propper structure`,
          `Returns: ${JSON.stringify(res)}`,
          `Expected structure: {
          "accountId": string,
          "blockHeight": number,
          "value": {
              "articleData": {
                  "title": string,
                  "body": string,
                  "tags": Array
              },
              "metadata": {
                  "id": string,
                  "author": string,
                  "createdTimestamp": number,
                  "lastEditTimestamp": number,
                  "versionKey": string,
              }
          }
      }`,
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
  {
    fnName: "testGetArticlesVersions",
    fn: testGetArticlesVersions,
    description: "Should get all versions of an article from one articleId",
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
      {
        fnName: "testFilterFakeAuthorsMatchAuthor",
        fn: testFilterFakeAuthorsMatchAuthor,
        description: "Test if filtering is working propperly",
      },
      {
        fnName: "testFilterFakeAuthorsAuthorDoesntMatch",
        fn: testFilterFakeAuthorsAuthorDoesntMatch,
        description: "Test if filtering is working propperly",
      },
      {
        fnName: "testGetArticleBlackListByArticleIdReturnValidAccountIds",
        fn: testGetArticleBlackListByArticleIdReturnValidAccountIds,
        description:
          "Test if getArticleBlackListByArticle returns valid articleId's",
      },
      {
        fnName: "testGetArticleBlackListByBlockHeightReturnsNumbers",
        fn: testGetArticleBlackListByBlockHeightReturnsNumbers,
        description: "Test if getArticleBlackListByBlockHeight returns numbers",
      },
    ])}
    {asyncComponent}
  </>
);
