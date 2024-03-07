const { getUserSBTs, getSBTWhiteList } = VM.require(
  "sayalot.near/widget/lib.SBT"
);
const { getUpVotes } = VM.require("sayalot.near/widget/lib.upVotes");
const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
  "sayalot.near/widget/lib.metadata"
);
const { normalizeObjectWithMetadata } = VM.require(
  "sayalot.near/widget/lib.normalization"
);
const { camelCaseToUserReadable } = VM.require(
  "sayalot.near/widget/lib.strings"
);

const baseAction = "sayALotArticle";
const testAction = `test_${baseAction}`;
const prodAction = `${baseAction}`;
const versionsBaseActions = isTest ? `test_${baseAction}` : baseAction;

const currentVersion = "v0.0.4";

let config = {};

function setConfig(value) {
  config = value;
}

function getConfig() {
  return config;
}

function getAction(version, config) {
  const baseAction = config.baseActions.article ?? getConfig().baseActions.article;
  const versionData = version ? versions[version] : versions[currentVersion];
  const action = baseAction + versionData.actionSuffix;
//   console.log(1, version, baseAction, versionData, action);
  return getConfig().isTest ? `test_${action}` : action;
}

function setIsTest(value) {
  isTest = value;
}

function getArticles(config, filters) {
  setConfig(config);
  return getArticlesNormalized(filters);
}

function filterFakeAuthors(articleData, articleIndexData) {
  if (articleData.author === articleIndexData.accountId) {
    return articleData;
  }
}

function getArticleNormalized(articleIndex, action) {
  const articleVersionIndex = Object.keys(versions).findIndex((versionName) => {
    const versionData = versions[versionName];
    return (
      (versionData.validBlockHeightRange[0] <= articleIndex.blockHeight &&
        articleIndex.blockHeight < versionData.validBlockHeightRange[1]) ||
      versionData.validBlockHeightRange[1] === undefined
    );
  });

  const articleVersionKey = Object.keys(versions)[articleVersionIndex];
  // const action = versions[articleVersionKey].action
  const key = "main";

  return asyncFetch(" https://api.near.social/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keys: [`${articleIndex.accountId}/${action}/${key}`],
      blockHeight: articleIndex.blockHeight,
    }),
  }).then((response) => {
    // console.log("response 2: ", response)
    //ERROR: Check the structure of the response to define "article"
    // console.log("response 3: ", response);
    let article = JSON.parse(
      response.body[articleIndex.accountId][action][key]
    );
    article.blockHeight = articleIndex.blockHeight;
    article.articleIndex = articleIndex;
    Object.keys(versions).forEach((versionName, index) => {
      if (articleVersionIndex >= index) {
        const versionData = versions[versionName];
        article = versionData.normalizationFunction(article);
      }
    });
    return article;
  });
}

function processArticles(articles) {
  return Promise.all(
    articles
      .map((article) => {
        return article.author;
      })
      .filter((author, index, authorArray) => {
        const firstIndex = authorArray.findIndex((author2) => {
          return author === author2;
        });
        return firstIndex === index;
      })
      .map((author) => {
        return getUserSBTs(author).then((userSbts) => {
          return [author, userSbts];
        });
      })
  ).then((uniqueAuthorsSBTs) => {
    // console.log("User sbts", uniqueAuthorsSBTs);
    let articlesBySBT = {};
    // console.log(3, articles);
    articles
      .filter((article) => {
        const articleSbt = article.sbts[0];
        if (articleSbt === "public") return true;

        const author = article.author;
        const [sbtName, sbtClass] = articleSbt.split(" - class ");

        const authorSbtPair = uniqueAuthorsSBTs.find(
          ([author2, _]) => author === author2
        );
        if (!authorSbtPair) return false;

        const authorSbts = authorSbtPair[1];
        const sbtPair = authorSbts.find(
          ([sbtName2, _]) => sbtName === sbtName2
        );
        if (!sbtPair) return false;

        const sbtPairClasses = sbtPair[1].map((sbt) => sbt.metadata.class);
        return sbtPairClasses.includes(parseInt(sbtClass));
      })
      .forEach((article, index, arr) => {
        const articleSbt = article.sbts[0];
        if (!articlesBySBT[articleSbt]) {
          articlesBySBT[articleSbt] = [];
        }
        articlesBySBT[articleSbt].push(article);
      });
    return articlesBySBT;
  });
}

function normalizeArticleData(articleData) {
  return normalizeObjectWithMetadata(articleData, versions);
}

function processArticlesData(articlesData) {
  const validArticlesData = filterInvalidArticlesIndexes(articlesData);

  const validLatestEdits = getLatestEdits(validArticlesData);

  const normalizedArticleData = validLatestEdits.map(normalizeArticleData);

  const articlesPromises = Promise.all(articlesIndexesPromises).then(
    (articles) => {
      const nonFakeAuthorsArticles = articles.filter((article, index) => {
        const articleIndex = validLatestEdits[index];
        return article.author === articleIndex.accountId;
      });

      // const articlesWithExtraData = nonFakeAuthorsArticles.map(appendExtraDataToArticle)
      // console.log(2, articlesWithExtraData)
      return processArticles(nonFakeAuthorsArticles, validLatestEdits);
    }
  );

  return articlesPromises;
}

function getArticleBlackListByBlockHeight() {
  return [
    91092435, 91092174, 91051228, 91092223, 91051203, 98372095, 96414482,
    96412953, 103131250, 106941548, 103053147, 102530777,
  ];
}

function getArticleBlackListByArticleId() {
  return [
    "blaze.near-1690410074090",
    "blaze.near-1690409577184",
    "blaze.near-1690803928696",
    "blaze.near-1690803872147",
    "blaze.near-1690574978421",
    "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb-1691703303485",
    "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb-1691702619510",
    "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb-1691702487944",
    "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb-1691707918243",
    "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb-1691707889297",
    "blaze.near-1697211386373",
    "silkking.near-1696797896796",
    "silkking.near-1696797784589",
    "silkking.near-1696797350661",
    "silkking.near-1696797276482",
    "silkking.near-1696797155012",
    "silkking.near-1696796793605",
    "silkking.near-1696796543546",
    "silkking.near-1696795954175",
    "silkking.near-1696794571874",
    "silkking.near-1696792789177",
    "zarmade.near-1690578803015",
  ];
}

function filterInvalidArticlesIndexes(articlesData) {
  return articlesData
    .filter((articleData) => articleData.value.metadata.id) // Has id
    .filter((articleData) => {
      const splittedId = articleData.value.metadata.id.split("-");
      splittedId.pop();

      return splittedId.join("-") === articleData.accountId;
    }) // id begins with same accountId as index object
    .filter(
      (articleData) =>
        !getArticleBlackListByBlockHeight().includes(articleData.blockHeight) // Blockheight is not in blacklist
    )
    .filter(
      (articleData) =>
        !getArticleBlackListByArticleId().includes(articleData.value.id) // Article id is not in blacklist
    );
}

function getLatestEdits(articles) {
  return articles.filter((articleData, index) => {
    const latestEditForThisArticleIndex = articles.findIndex(
      (newArticle) =>
        newArticle.value.metadata.id === articleData.value.metadata.id
    );
    return index === latestEditForThisArticleIndex;
  });
}

function applyUserFilters(articles, filters) {
  const { id, sbt } = filters;
  if (id) {
    articles = articles.filter((article) => {
      return article.value.metadata.id === id;
    });
  }
  if (sbt) {
    articles = articles.filter((article) => {
      return article.value.metadata.sbt === sbt;
    });
  }
  return articles;
}

function isActive(article) {
  return article.value.metadata && !article.value.metadata.isDelete;
}

function getArticlesNormalized(userFilters) {
  const articlesDataPromises = Object.keys(versions).map((version) => {
    // const action = versions[version].action;
    const action = getAction(version);
    const articles = getArticlesIndexes(action, "main");

    return articles;
  });

  return Promise.all(articlesDataPromises).then((articlesVersionArray) => {
    const articles = articlesVersionArray.flat();
    const filteredArticles = applyUserFilters(articles, userFilters);
    const latestEdits = getLatestEdits(filteredArticles);
    const activeArticles = latestEdits.filter(isActive);

    return activeArticles;
  });
}

function getArticlesIndexes(action, key) {
  const indexUrl = "https://api.near.social/index";
  const articlesPromise = asyncFetch(indexUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      key,
      options: {
        order: "desc",
      },
    }),
  }).then((response) => response.body);

  return articlesPromise;
}

function normalizeOldToV_0_0_1(article) {
  article.realArticleId = `${article.author}-${article.timeCreate}`;
  article.sbts = ["public"];

  return article;
}

function normalizeFromV0_0_1ToV0_0_2(article) {
  article.title = article.articleId;
  article.id = article.realArticleId;
  if (article.sbts[0] !== "public") {
    article.sbts[0] = article.sbts[0] + " - class 1";
  } // There is only one article that is not public and only has class 1

  delete article.articleId;
  delete article.realArticleId;

  return article;
}

function normalizeFromV0_0_2ToV0_0_3(article) {
  if (!Array.isArray(article.tags) && typeof article.tags === "object") {
    article.tags = Object.keys(article.tags);
  }

  if (article.tags) {
    article.tags = article.tags.filter(
      (tag) => tag !== undefined && tag !== null
    );
  } else {
    article.tags = [];
  }

  //Add day-month-year tag if it doesn't exists yet by request
  const creationDate = new Date(article.timeCreate);

  const dateTag = `${creationDate.getDate()}-${
    creationDate.getMonth() + 1
  }-${creationDate.getFullYear()}`;

  if (!article.tags.includes(dateTag)) article.tags.push(dateTag);

  if (article.blockHeight < 105654020 && article.sbts.includes("public")) {
    article.sbts = ["fractal.i-am-human.near - class 1"];
  }

  return article;
}

function normalizeFromV0_0_4ToV0_0_5(article) {
  return article;
}

// EDIT: set versions you want to handle, considering their action to Social.index and the way to transform to one version to another (normalization)
const versions = {
  // old: {
  //     normalizationFunction: normalizeOldToV_0_0_1,
  //     actionSuffix: "",
  //     validBlockHeightRange: [0, 102530777],
  // },
  // "v0.0.1": {
  //     normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
  //     actionSuffix: `_v0.0.1`,
  //     validBlockHeightRange: [102530777, 103053147],
  // },
  // "v0.0.2": {
  //     normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
  //     actionSuffix: `_v0.0.2`,
  //     validBlockHeightRange: [103053147, Infinity],
  // },
  // "v0.0.3": {
  //     normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
  //     actionSuffix: `_v0.0.3`,
  //     validBlockHeightRange: [Infinity, Infinity],
  // },
  "v0.0.4": {
    normalizationFunction: normalizeFromV0_0_4ToV0_0_5,
    actionSuffix: `_v0.0.4`,
    validBlockHeightRange: [0, Infinity],
  },
};

function validateArticleData(article) {
  // ADD SBT VALIDATION
  const expectedStringProperties = ["title", "body"];
  const expectedArrayProperties = ["tags"];
  const errArrMessage = [];
  // String properties
  errArrMessage.push(
    ...expectedStringProperties
      .filter((currentProperty) => {
        const isValidProperty =
          !article[currentProperty] ||
          typeof article[currentProperty] !== "string";
        return isValidProperty;
      })
      .map(
        (currentProperty) =>
          `Missing ${camelCaseToUserReadable(currentProperty)} or not a string`
      )
  );
  // Array properties
  errArrMessage.push(
    ...expectedArrayProperties
      .filter((currentProperty) => {
        return !Array.isArray(article[currentProperty]);
      })
      .map(
        (currentProperty) =>
          `Article ${camelCaseToUserReadable(
            currentProperty
          )}'s is not an array`
      )
  );

  return errArrMessage;
}

/**
 * Only properties that are not set automatically should be validated
 * @param {*} metadata
 */
function validateMetadata(metadata) {
  const expectedStringProperties = ["id", "author"];
  const expectedNumberProperties = ["createdTimestamp"];

  const errArrMessage = [];
  // String properties
  errArrMessage.push(
    ...expectedStringProperties
      .filter((currentProperty) => {
        const isValidProperty =
          !metadata[currentProperty] ||
          typeof metadata[currentProperty] !== "string";
        return isValidProperty;
      })
      .map(
        (currentProperty) =>
          `Missing ${camelCaseToUserReadable(currentProperty)} or not a string`
      )
  );
  // Array properties
  errArrMessage.push(
    ...expectedNumberProperties
      .filter((currentProperty) => {
        return (
          !metadata[currentProperty] ||
          typeof metadata[currentProperty] !== "number"
        );
      })
      .map(
        (currentProperty) =>
          `Property ${camelCaseToUserReadable(
            currentProperty
          )}'s is not an array`
      )
  );

  const sbtWhiteList = getSBTWhiteList(getConfig());

  if (!sbtWhiteList.map((sbt) => sbt.value).includes(article.sbt)) {
    errArrMessage.push(`Invalid SBT: ${article.sbt}`);
  }
  return errArrMessage;
}

function validateNewArticle(articleData) {
  const errorArray = validateArticleData(articleData);
  return errorArray;
}

function validateEditArticle(articleData, previousMetadata) {
  const errorArray = validateArticleData(articleData);
  if (!previousMetadata.id) {
    errorArray.push(`Trying to edit article with no article id`);
  }
  return errorArray;
}

function extractMentions(text) {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
}

// function handleNotifications(article) {
//     const mentions = extractMentions(article.body);

//     if (mentions.length > 0) {
//       const dataToAdd = getNotificationData(
//         "mention",
//         mentions,
//         `https://near.social/${widgets.thisForum}?sharedArticleId=${article.id}${
//           isTest ? "&isTest=t" : ""
//         }`
//       );

//       data.post = dataToAdd.post;
//       data.index.notify = dataToAdd.index.notify;
//     }
// }

function composeData(article) {
  let data = {
    index: {
      [getAction()]: JSON.stringify({
        key: "main",
        value: {
          ...article,
        },
      }),
    },
  };

  // TODO handle notifications properly
  // const mentions = extractMentions(article.body);

  // if (mentions.length > 0) {
  //   const dataToAdd = getNotificationData(
  //     "mention",
  //     mentions,
  //     `https://near.social/${widgets.thisForum}?sharedArticleId=${article.id}${
  //       isTest ? "&isTest=t" : ""
  //     }`
  //   );

  //   data.post = dataToAdd.post;
  //   data.index.notify = dataToAdd.index.notify;
  // }

  return data;
}

function composeDeleteData(articleId) {
  const deleteMetadata = buildDeleteMetadata(articleId);
  let data = {
    index: {
      [getAction()]: JSON.stringify({
        key: "main",
        value: {
          metadata: {
            ...deleteMetadata,
          },
        },
      }),
    },
  };
  return data;
}

function executeSaveArticle(article, onCommit, onCancel) {
  const newData = composeData(article);
  Social.set(newData, {
    force: true,
    onCommit,
    onCancel,
  });

  return articleData.id;
}

function executeDeleteArticle(articleId, onCommit, onCancel) {
  const newData = composeDeleteData(articleId);
  Social.set(newData, {
    force: true,
    onCommit,
    onCancel,
  });
}

function createArticle(
  config,
  articleData,
  userMetadataHelper,
  onCommit,
  onCancel
) {
  setConfig(config);
  const errors = validateNewArticle(articleData, author);
  if (errors && errors.length) {
    return { error: true, data: errors };
  }

  const metadataHelper = {
    ...userMetadataHelper,
    idPrefix: "article",
    versionKey: currentVersion,
  };
  const metadata = generateMetadata(metadataHelper);
  const article = {
    articleData,
    metadata,
  };
  const result = executeSaveArticle(article, onCommit, onCancel);
  return { error: false, data: result };
}

function editArticle(
  config,
  newArticleData,
  previousMetadata,
  onCommit,
  onCancel
) {
  setConfig(config);
  const errors = validateEditArticle(newArticleData, previousMetadata);
  if (errors && errors.length) {
    return { error: true, data: errors };
  }

  const newMetadata = updateMetadata(previousMetadata, currentVersion);
  const article = {
    articleData: newArticleData,
    metadata: newMetadata,
  };
  const result = executeSaveArticle(article, onCommit, onCancel);
  return { error: false, data: result };
}

function deleteArticle(config, articleId, onCommit, onCancel) {
  setConfig(config);
  executeDeleteArticle(articleId, onCommit, onCancel);
}

return {
  createArticle,
  getArticles,
  editArticle,
  deleteArticle,
  getArticlesIndexes,
  getLatestEdits,
  getAction,
};
