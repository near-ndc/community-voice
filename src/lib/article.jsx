const { getUserSBTs, getSBTWhiteList } = VM.require("communityvoice.ndctools.near/widget/lib.SBT");

const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
  "communityvoice.ndctools.near/widget/lib.metadata"
);
const { normalizeObjectWithMetadata } = VM.require(
  "communityvoice.ndctools.near/widget/lib.normalization"
);
const { camelCaseToUserReadable } = VM.require("communityvoice.ndctools.near/widget/lib.strings");

const { extractMentions, getNotificationData } = VM.require(
  "communityvoice.ndctools.near/widget/lib.notifications"
);

const currentVersion = "v0.0.5";

let config = {};

function setConfig(value) {
  config = value;
}

function getConfig() {
  return config;
}

function getAction(version) {
  const baseAction = getConfig().baseActions.article;
  const versionData = version ? versions[version] : versions[currentVersion];
  const action = baseAction + versionData.actionSuffix;
  return getConfig().isTest ? `test_${action}` : action;
}

function setIsTest(value) {
  isTest = value;
}

function getArticlesVersions(config, articleId) {
  setConfig(config);
  return getArticlesHistoryNormalized(articleId)
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
    //ERROR: Check the structure of the response to define "article"
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

function normalizeArticleData(articleData) {
  return normalizeObjectWithMetadata(articleData, versions);
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
  const { id, category, authors, tags } = filters;
  if (id) {
    articles = articles.filter((article) => {
      return article.value.metadata.id === id;
    });
  }
  if (category && category !== "all_categories") {
    articles = articles.filter((article) => {
      return article.value.articleData.category === category;
    });
  }
  if(authors && authors.length > 0) {
    articles = articles.filter((article) => {
      return authors.includes(article.value.metadata.author);
    });
  }
  if (tags && tags.length > 0) {
    articles = articles.filter((article) => {
      return tags.some((tag) => article.value.articleData.tags.includes(tag));
    });
  }
  return articles;
}

function isActive(article) {
  return article.value.metadata && !article.value.metadata.isDelete;
}

function getArticlesHistoryNormalized(articleId) {
  const articlesDataPromises = Object.keys(versions).map((version) => {
    // const action = versions[version].action;
    const action = getAction(version);
    const articles = getArticlesIndexes(action, "main");

    return articles;
  });

  return Promise.all(articlesDataPromises).then((articlesVersionArray) => {
    const articles = articlesVersionArray.flat();
    const filteredArticles = applyUserFilters(articles, {id: articleId});

    return filteredArticles;
  });
}

function normalizeArticle(article) {
  const versionsKeys = Object.keys(versions);
  const versionIndex = article.versionIndex
  
  for (let i = versionIndex; i < versionsKeys.length; i++) {
    const version = versions[versionsKeys[i]];
    article = version.normalizationFunction(article);
  }
  delete article.versionIndex
  
  return article;
}

function getArticlesNormalized(userFilters) {
  const articlesDataPromises = Object.keys(versions).map((version, versionIndex) => {
    // const action = versions[version].action;
    const action = getAction(version);
    const articles = getArticlesIndexes(action, "main").then((articles) => {
      return articles.map((article) => {
        article.versionIndex = versionIndex
        return article
      });
    });

    return articles;
  });

  return Promise.all(articlesDataPromises).then((articlesVersionArray) => {
    const articles = articlesVersionArray.flat();
    const normalizedArticles = articles.map((article) =>
      normalizeArticle(article)
    );
    const latestActiveEdits = getLatestEdits(normalizedArticles);
    const activeArticles = latestActiveEdits.filter(isActive);
    const filteredArticles = applyUserFilters(activeArticles, userFilters);


    return filteredArticles;
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
  if(!isActive(article)) return article
  article.value.articleData.category = "uncategorized"
  return article;
}

function normalizeFromV0_0_5ToV0_0_6(article) { // change to normalizeFromV0_0_5ToV0_0_6 
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
    validBlockHeightRange: [0, 115688831],
  },
  "v0.0.5": {
    normalizationFunction: normalizeFromV0_0_5ToV0_0_6,
    actionSuffix: `_v0.0.5`,
    validBlockHeightRange: [115688831, Infinity],
  },
};

function validateArticleData(article) {
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

  if(article.metadata.isDelete) return data

  const mentions = extractMentions(article.articleData.body);

  if (mentions.length > 0) {
    const dataToAdd = getNotificationData(
      getConfig(),
      "mention",
      mentions,
      article.metadata
    );

    data.post = dataToAdd.post;
    data.index.notify = dataToAdd.index.notify;
  }

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
}

function buildArticle(articleData, userMetadataHelper){
  const metadataHelper = {
    ...userMetadataHelper,
    idPrefix: "article",
    versionKey: currentVersion,
  };
  const metadata = generateMetadata(metadataHelper);
  return {
    articleData,
    metadata,
  };
}

function createArticle(
  config,
  articleData,
  userMetadataHelper,
  onCommit,
  onCancel
) {
  setConfig(config);
  const errors = validateNewArticle(articleData);
  if (errors && errors.length) {
    return { error: true, data: errors };
  }

  const article = buildArticle(articleData,userMetadataHelper)
  const result = executeSaveArticle(article, () => onCommit(article.metadata.id), onCancel);
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

  const deleteMetadata = buildDeleteMetadata(articleId);
  const article = {
    metadata: deleteMetadata,
  };
  executeSaveArticle(article, onCommit, onCancel);
}

return {
  createArticle,
  getArticles,
  buildArticle,
  editArticle,
  deleteArticle,
  getArticlesIndexes,
  getLatestEdits,
  getAction,
  filterFakeAuthors,
  getArticleBlackListByArticleId,
  getArticleBlackListByBlockHeight,
  getArticlesVersions,
};
