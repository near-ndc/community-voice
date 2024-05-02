const {
  getLatestEdits,
  processArticles,
  getArticlesIndexes,
  getAction,
  getArticleBlackListByArticleId,
  getArticleBlackListByBlockHeight,
  getArticlesVersions,
  applyUserFilters,
  functionsToTest,
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

//================================================================= Start examples to compare with =================================================================//
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

const emptyArtocleIndexes = [];

const badArticleDataStructureExample = {
  body: undefined,
  tags: { test: "a" },
  category: 1,
};

const badArticleMetadataStructureExample = {
  author: undefined,
  createdTimestamp: "1",
};

const badFullArticleExample = {
  accountId: undefined,
  blockHeight: "1",
  value: {
    articleData: badArticleDataStructureExample,
    metadata: badArticleMetadataStructureExample,
  },
};

const goodArticleDataStructureExample = {
  title: "Test create 4",
  body: "Test",
  tags: [],
  category: "uncategorized",
};

const goodArticleMetadataStructureExample = {
  id: "string",
  author: "string",
  createdTimestamp: 1,
  lastEditTimestamp: 1,
  versionKey: "string",
};

const goodFullArticleExample = {
  accountId: "string",
  blockHeight: 1,
  value: {
    articleData: goodArticleDataStructureExample,
    metadata: goodArticleMetadataStructureExample,
  },
};

const realArticlesSample = [
  {
    accountId: "silkking.near",
    blockHeight: 115688795,
    value: {
      articleData: {
        title: "Test create 4",
        body: "Test",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711678364022",
        author: "silkking.near",
        createdTimestamp: 1711678364022,
        lastEditTimestamp: 1711678364022,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115688134,
    value: {
      articleData: {
        title: "Test creat3 ",
        body: "Test",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711677622926",
        author: "silkking.near",
        createdTimestamp: 1711677622926,
        lastEditTimestamp: 1711677622926,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115687990,
    value: {
      articleData: {
        title: "Test create 2",
        body: "Test",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711677432412",
        author: "silkking.near",
        createdTimestamp: 1711677432412,
        lastEditTimestamp: 1711677432412,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115687930,
    value: {
      articleData: {
        title: "Test create post",
        body: "Test",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711677346484",
        author: "silkking.near",
        createdTimestamp: 1711677346484,
        lastEditTimestamp: 1711677346484,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
    blockHeight: 115674670,
    value: {
      articleData: {
        title: "test Loader2",
        body: "Post content (markdown supported)2",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52/1711660037849",
        author:
          "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
        createdTimestamp: 1711660037849,
        lastEditTimestamp: 1711660037849,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
    blockHeight: 115674473,
    value: {
      articleData: {
        title: "test loader",
        body: "Post content (markdown supported)1",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52/1711659860895",
        author:
          "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
        createdTimestamp: 1711659860895,
        lastEditTimestamp: 1711659860895,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115666320,
    value: {
      articleData: {
        title: "Test",
        body: "Test",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711648989406",
        author: "silkking.near",
        createdTimestamp: 1711648989406,
        lastEditTimestamp: 1711648989406,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115665563,
    value: {
      articleData: {
        title: "Final test before deploy",
        body: "This a test with all the team for the community voice deploy and success @silkking.near @blaze.near @fiatisabubble.near @yuensid.near\n",
        tags: ["success"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711647271157",
        author: "silkking.near",
        createdTimestamp: 1711647271157,
        lastEditTimestamp: 1711647970244,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115662782,
    value: {
      articleData: {
        title: "Last test",
        body: "@f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb @silkking.near @rodrigos.near",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711582852141",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711582852141,
        lastEditTimestamp: 1711644261409,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
    blockHeight: 115661723,
    value: {
      articleData: {
        title: "test uncategorized",
        body: "Post content (markdown supported).123",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52/1711643058027",
        author:
          "4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52",
        createdTimestamp: 1711643058027,
        lastEditTimestamp: 1711643058027,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115657625,
    value: {
      articleData: {
        title: "Test",
        body: "@silkking.near test3",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711637425267",
        author: "silkking.near",
        createdTimestamp: 1711637425267,
        lastEditTimestamp: 1711637868629,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115657040,
    value: {
      articleData: {
        title: "Test notification",
        body: "@silkking.near",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711637136836",
        author: "silkking.near",
        createdTimestamp: 1711637136836,
        lastEditTimestamp: 1711637136836,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115654824,
    value: {
      articleData: {
        title: "Test title",
        body: "Test body edited again",
        tags: ["hello", "test"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1711379864191",
        author: "silkking.near",
        createdTimestamp: 1711379864191,
        lastEditTimestamp: 1711634393196,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115612486,
    value: {
      articleData: {
        title: "Testing mentions on notifications",
        body: "@silkking.near @f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711582481080",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711582481080,
        lastEditTimestamp: 1711582481080,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115612124,
    value: {
      articleData: {
        title: "New test notifications",
        body: "@f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb @silkking.near mentioned",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711582131500",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711582131500,
        lastEditTimestamp: 1711582131500,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115606769,
    value: {
      articleData: {
        title: "Testing notifications",
        body: "Is @4aafb0fa32afa8bb20a3e15c8ac55126f4bf325c476a6575498cc8af11d05d52 receiving the notification?",
        tags: [],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711575462577",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711575462577,
        lastEditTimestamp: 1711575462577,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115472500,
    value: {
      articleData: {
        title: "new librarys",
        body: "Post content - Post content - Post content - Post content - Post content - Post content - Post content - Post content - Post content",
        tags: ["lib", "new", "open", "closed"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/rodrigos.near/1711228771918",
        author: "rodrigos.near",
        createdTimestamp: 1711228771918,
        lastEditTimestamp: 1711407349516,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115318764,
    value: {
      articleData: {
        title: "Testing",
        body: "My second test edited",
        tags: ["test", "test2"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711215883701",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711215883701,
        lastEditTimestamp: 1711215950389,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 115318570,
    value: {
      articleData: {
        title: "Test post",
        body: "My first test",
        tags: ["test"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711215738880",
        author:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
        createdTimestamp: 1711215738880,
        lastEditTimestamp: 1711215738880,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 115313419,
    value: {
      articleData: {
        title: "test with tags",
        body: "body text 4 with 3 tags",
        tags: ["tag1", "tag2", "tag3"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/rodrigos.near/1710843635815",
        author: "rodrigos.near",
        sbt: "fractal-v2.i-am-human.testnet - class 1",
        createdTimestamp: 1710843635815,
        lastEditTimestamp: 1711209257880,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 114268376,
    value: {
      articleData: {
        title: "Test title",
        body: "Test body",
        tags: ["hello"],
        category: "uncategorized",
      },
      metadata: {
        id: "article/silkking.near/1709818622924",
        author: "silkking.near",
        sbt: "fractal-v2.i-am-human.testnet - class 1",
        createdTimestamp: 1709818622924,
        lastEditTimestamp: 1709818622924,
        versionKey: "v0.0.4",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 117180998,
    value: {
      articleData: {
        title: "Test",
        body: "Create new article test 1",
        tags: [],
        category: "all_categories",
      },
      metadata: {
        id: "article/silkking.near/1713542413923",
        author: "silkking.near",
        createdTimestamp: 1713542413923,
        lastEditTimestamp: 1713542413923,
        versionKey: "v0.0.5",
      },
    },
  },
  {
    accountId:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb",
    blockHeight: 116563394,
    value: {
      metadata: {
        author: "ayelen.near",
        createdTimestamp: 1699314338205,
        lastEditTimestamp: 1699314338205,
        id: "article/ayelen.near/1699314338205",
        versionKey: "v0.0.5",
      },
      articleData: {
        title: "testt",
        body: "***testtt***",
        tags: [null],
        category: "uncategorized",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 116563096,
    value: {
      articleData: {
        title: "Test",
        body: "Post content (markdown supportasded)",
        tags: [],
      },
      metadata: {
        id: "article/silkking.near/1712779853774",
        author: "silkking.near",
        createdTimestamp: 1712779853774,
        lastEditTimestamp: 1712779853774,
        versionKey: "v0.0.5",
      },
    },
  },
  {
    accountId: "rodrigos.near",
    blockHeight: 116407363,
    value: {
      articleData: {
        title: "test refactor create",
        body: "testing edit",
        tags: ["refactor", "create", "edit"],
        category: "all_categories",
      },
      metadata: {
        id: "article/rodrigos.near/1712596454451",
        author: "rodrigos.near",
        createdTimestamp: 1712596454451,
        lastEditTimestamp: 1712596576548,
        versionKey: "v0.0.5",
      },
    },
  },
  {
    accountId: "silkking.near",
    blockHeight: 115692695,
    value: {
      articleData: {
        title: "Test creatives",
        body: "Test",
        tags: [],
        category: "creatives",
      },
      metadata: {
        id: "article/silkking.near/1711683372152",
        author: "silkking.near",
        createdTimestamp: 1711683372152,
        lastEditTimestamp: 1711683372152,
        versionKey: "v0.0.5",
      },
    },
  },
];

//================================================================= End examples to compare with =================================================================//

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

async function testGetArticlesNormalized() {
  const fnName = "testGetArticlesNormalized";

  const filters = {};

  const articlesNormalized = functionsToTest.getArticlesNormalized(filters);

  let isError = false;
  let msg = "";
  return articlesNormalized.then((res) => {
    try {
      if (!Array.isArray(res)) {
        isError = true;
        msg = [
          `testGetArticlesNormalized is expecting an Array with all the articles`,
          `it returns: ${JSON.stringify(res)}`,
        ];
      } else {
        const allStructureValidationsErrors =
          getStructureValidationsErrors(res);

        if (allStructureValidationsErrors.length > 0) {
          isError = true;
          msg = [
            `One or more version doesn't have the propper structure`,
            `The errors are the following:`,
            allStructureValidationsErrors,
          ].flat();
        }
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

function testNormalizeArticle() {
  const fnName = "testNormalizeArticle";

  let isError = false;
  let msg = "";

  const oldVersionExample = {
    accountId: "silkking.near",
    blockHeight: 115692695,
    value: {
      articleData: {
        title: "Test creatives",
        body: "Test",
        tags: [],
      },
      metadata: {
        id: "article/silkking.near/1711683372152",
        author: "silkking.near",
        createdTimestamp: 1711683372152,
        lastEditTimestamp: 1711683372152,
        versionKey: "v0.0.5",
      },
    },
  };

  const result = functionsToTest.normalizeArticle(oldVersionExample);
  const articleStructureCheck = doesArticleHavePropperStructure(result);

  try {
    if (
      result.value.articleData.category !== "uncategorized" ||
      articleStructureCheck.isError
    ) {
      isError = true;
      msg = [
        "There's an unexpected modification in the article structure",
        articleStructureCheck.allStructureErrors,
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

function testIsActive() {
  const fnName = "testIsActive";

  let isError = false;
  let msg = "";
  try {
    if (functionsToTest.isActive(goodFullArticleExample) === undefined) {
      isError = true;
      msg = "There's an unexpected modification in the article structure";
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

function testNormalizeFromV0_0_4ToV0_0_5() {
  const fnName = "testNormalizeFromV0_0_4ToV0_0_5";

  const oldVersionExample = realArticlesSample[0];
  delete oldVersionExample.value.articleData.category;
  delete oldVersionExample.value.metadata.isDelete;

  const result = functionsToTest.normalizeFromV0_0_4ToV0_0_5(oldVersionExample);

  let isError = false;
  let msg = "";
  if (result.value.articleData.category !== "uncategorized") {
    isError = true;
    msg = "result.value.articleData.category value should be 'uncategorized'";
  }
  return {
    isError,
    msg,
    fnName,
  };
}

function testValidateArticleDataNotPassing() {
  const fnName = "testValidateMetadataNotPassing";

  try {
    const functionvalidateMetadataNotPassing =
      functionsToTest.validateArticleData(badArticleDataStructureExample);

    if (!Array.isArray(functionvalidateMetadataNotPassing)) {
      return {
        isError: true,
        msg: "functionvalidateMetadataNotPassing was expecting to be an Array but is not.",
      };
    }

    return {
      isError: functionvalidateMetadataNotPassing.length === 0,
      msg: ["It was expected to get errors."],
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

function testValidateArticleDataPassing() {
  const fnName = "testValidateMetadataPassing";

  try {
    const functionvalidateMetadataPassing = functionsToTest.validateArticleData(
      goodArticleDataStructureExample
    );

    if (!Array.isArray(functionvalidateMetadataPassing)) {
      return {
        isError: true,
        msg: "functionvalidateMetadataPassing was expecting to be an Array but is not.",
      };
    }

    return {
      isError: functionvalidateMetadataPassing.length !== 0,
      msg: [
        `It was expected to not get errors. It get's the following errors instead:`,
        functionvalidateMetadataPassing,
      ],
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

function testValidateMetadataNotPassing() {
  const fnName = "testValidateMetadataNotPassing";

  try {
    const functionvalidateMetadataNotPassing = functionsToTest.validateMetadata(
      badArticleMetadataStructureExample
    );

    if (!Array.isArray(functionvalidateMetadataNotPassing)) {
      return {
        isError: true,
        msg: "functionvalidateMetadataNotPassing was expecting to be an Array but is not.",
      };
    }

    return {
      isError: functionvalidateMetadataNotPassing.length === 0,
      msg: ["It was expected to get errors."],
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

function testValidateMetadataPassing() {
  const fnName = "testValidateMetadataPassing";

  try {
    const functionvalidateMetadataPassing = functionsToTest.validateMetadata(
      goodArticleMetadataStructureExample
    );

    if (!Array.isArray(functionvalidateMetadataPassing)) {
      return {
        isError: true,
        msg: "functionvalidateMetadataPassing was expecting to be an Array but is not.",
      };
    }

    return {
      isError: functionvalidateMetadataPassing.length !== 0,
      msg: [
        `It was expected to not get errors. It get's the following errors instead:`,
        functionvalidateMetadataPassing,
      ],
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

function createFeedBackFromDoesArticleHavePropperStructure(articleErrors) {
  if (articleErrors.length > 0) {
    articleErrors.unshift(
      `*In article of blockHeight ${article.blockHeight} there are the following errors:`
    );
  }

  return articleErrors;
}

function doesArticleHavePropperStructure(article) {
  const articleDataStructureErrors = functionsToTest.validateArticleData(
    article.value.articleData
  );
  const metadataStructureErrors = functionsToTest.validateMetadata(
    article.value.metadata
  );

  const allStructureErrors = [
    ...articleDataStructureErrors,
    ...metadataStructureErrors,
  ];

  return { isError: allStructureErrors.length === 0, allStructureErrors };
}

function testLatestEditsRepeatedArticle() {
  const fnName = "testLatestEdits";

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

  const arrayIsResultANumber = result.map((blockHeight) => {
    const isResultANumber = !isNaN(Number(blockHeight));

    return isResultANumber;
  });

  const isError = arrayIsResultANumber.includes(false);

  return {
    isError: isError,
    msg: isError ? `One or more blockHeights passed are not numbers` : "",
    fnName,
  };
}

function getFilteringIsError() {
  return (
    Array.isArray(result) &&
    (result.length === 0 ||
      !result
        .map((article) => doesArticleHavePropperStructure(article).isError)
        .includes(false))
  );
}

function testFilterings(fnName, filterKey, filterValue) {
  let result;
  try {
    result = applyUserFilters(realArticlesSample, { [filterKey]: filterValue });
  } catch (err) {
    return {
      isError: true,
      msg: err.message,
      fnName,
    };
  }

  const isError = getFilteringIsError();
  const msg = isError ? "Is not returning an array of articles" : "";

  return {
    isError,
    msg,
    fnName,
  };
}

function testApplyUserFiltersWithCategory() {
  const fnName = "testApplyUserFiltersWithCategory";
  const filterKey = "category";
  const filterValue = "uncategorized";

  return testFilterings(fnName, filterKey, filterValue);
}

function testApplyUserFiltersWithId() {
  const fnName = "testApplyUserFiltersWithId";
  const filterKey = "id";
  const filterValue = "article/silkking.near/1711678364022";

  return testFilterings(fnName, filterKey, filterValue);
}

function testApplyUserFiltersWithAuthors() {
  const fnName = "testApplyUserFiltersWithAuthors";
  const filterKey = "authors";
  const filterValue = ["silkking.near"];

  return testFilterings(fnName, filterKey, filterValue);
}

function testApplyUserFiltersWithTags() {
  const fnName = "testApplyUserFiltersWithTags";
  const filterKey = "tags";
  const filterValue = ["test"];

  return testFilterings(fnName, filterKey, filterValue);
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

function getStructureValidationsErrors(versions) {
  const allErrorsByArticle = versions.map((article) => {
    const thisArticleErrors =
      doesArticleHavePropperStructure(article).allStructureErrors;
    const finalArticleFeedback =
      createFeedBackFromDoesArticleHavePropperStructure(thisArticleErrors);
    return finalArticleFeedback;
  });

  let allErrors = [];
  allErrorsByArticle.forEach((errors) => {
    allErrors = [...allErrors, ...errors];
  });

  return allErrors;
}

async function testGetArticlesVersions() {
  const fnName = "testGetArticlesVersions";

  const articleId =
    "article/f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/1711582852141";

  const articlesVersions = getArticlesVersions(getConfig(isTest), articleId);

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
      } else {
        const allStructureValidationsErrors =
          getStructureValidationsErrors(res);

        if (allStructureValidationsErrors.length > 0) {
          isError = true;
          msg = [
            `One or more version doesn't have the propper structure`,
            `The errors are the following:`,
            allStructureValidationsErrors,
          ].flat();
        }
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
  {
    fnName: "testGetArticlesNormalized",
    fn: testGetArticlesNormalized,
    description:
      "Test if the function is returning articles normalized",
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
      {
        fnName: "testApplyUserFiltersWithCategory",
        fn: testApplyUserFiltersWithCategory,
        description: "Test if the filter is returning an array of articles",
      },
      {
        fnName: "testApplyUserFiltersWithId",
        fn: testApplyUserFiltersWithId,
        description: "Test if the filter is returning an array of articles",
      },
      {
        fnName: "testApplyUserFiltersWithAuthors",
        fn: testApplyUserFiltersWithAuthors,
        description: "Test if the filter is returning an array of articles",
      },
      {
        fnName: "testApplyUserFiltersWithTags",
        fn: testApplyUserFiltersWithTags,
        description: "Test if the filter is returning an array of articles",
      },
      {
        fnName: "testValidateMetadataNotPassing",
        fn: testValidateMetadataNotPassing,
        description: "Test if it's getting the expected result format",
      },
      {
        fnName: "testValidateMetadataPassing",
        fn: testValidateMetadataPassing,
        description: "Test if it's getting the expected result format",
      },
      {
        fnName: "testValidateArticleDataNotPassing",
        fn: testValidateArticleDataNotPassing,
        description: "Test if it's getting the expected result format",
      },
      {
        fnName: "testValidateArticleDataPassing",
        fn: testValidateArticleDataPassing,
        description: "Test if it's getting the expected result format",
      },
      {
        fnName: "testIsActive",
        fn: testIsActive,
        description: "Test if the structure of the article has been modified",
      },
      {
        fnName: "testNormalizeFromV0_0_4ToV0_0_5",
        fn: testNormalizeFromV0_0_4ToV0_0_5,
        description:
          "Test if the normalization function is working as expected",
      },
    ])}
    {asyncComponent}
  </>
);
