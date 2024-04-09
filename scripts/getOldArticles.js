const path = require("path");
// const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { keyStores, connect, Contract } = require("near-api-js");
const { homedir } = require("os");

// const ACCOUNT = "communityvoice.ndctools.near"
const ACCOUNT =
  "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb";

const isTest = true;
const currentVersion = "v0.0.5";

const lastOldVersion = "0.0.2";

const prodAction = `${
  getConfig(isTest).baseActions.article
}`;

const testAction = `test_${prodAction}`;

const versionsBaseActions = isTest
  ? testAction
  : getConfig(isTest).baseActions.article;

const currentAction = `${versionsBaseActions}_${currentVersion}`;

function getArticlesJsons(articles) {
  return articles.map((article) => {
    return {
      index: {
        [currentAction]: JSON.stringify({
          key: "main",
          article,
        }),
      },
    };
  });
}

function getConfig(isTest, networkId) {
  const componentsOwner = "communityvoice.ndctools.near";
  const authorForWidget = "communityvoice.ndctools.near";
  const configWidget = "home";
  return {
    isTest,
    networkId,
    baseActions: {
      article: "communityVoiceArticle",
      upVote: "communityVoiceUpVote",
      reaction: "communityVoiceReaction",
      comment: "communityVoiceComment",
    },
    componentsOwner,
    authorForWidget,
    forumURL: `${authorForWidget}/widget/${configWidget}`,
  };
}

const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    action: versionsBaseActions,
    actionSuffix: "",
    validBlockHeightRange: [0, 102530777],
  },
  "v0.0.1": {
    normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
    action: `${versionsBaseActions}_v0.0.1`,
    actionSuffix: `_v0.0.1`,
    validBlockHeightRange: [102530777, 103053147],
  },
  "v0.0.2": {
    normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
    action: `${versionsBaseActions}_v0.0.2`,
    actionSuffix: `_v0.0.2`,
    validBlockHeightRange: [103053147, Infinity],
  },
  "v0.0.3": {
    normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
    action: `${versionsBaseActions}_v.0.0.3`,
    actionSuffix: `_v0.0.3`,
    validBlockHeightRange: [Infinity, Infinity],
  },
};

function getAction(version) {
  const baseAction = getConfig(isTest).baseActions.article;
  const versionData = version ? versions[version] : versions[lastOldVersion];
  const action = baseAction + versionData.actionSuffix;
  return getConfig(isTest).isTest ? `test_${action}` : action;
}

function getArticlesIndexes(action, key) {
  const indexUrl = `https://api.near.social/index`;

  const articlesPromise = fetch(indexUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      key,
      options: {
        order: "desc",
      },
    }),
  }).then((response) => {
    return response.json();
  });

  return articlesPromise;
}

function filterValidArticles(articles) {
  const articlesWithoutDeletedOnes = articles.filter(
    (article) => !article.deletedArticle
  );

  return articlesWithoutDeletedOnes;
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

function filterInvalidArticlesIndexes(articlesIndexes) {
  if (articlesIndexes.versionIndex === 3) {
    return articlesIndexes
      .filter((articleIndex) => articleIndex.value.metadata.id) // Has id
      .filter((articleIndex) => {
        const splittedId = articleIndex.value.metadata.id.split("/");

        return splittedId[1] === articleIndex.accountId;
      }) // id begins with same accountId as index object
      .filter((articleIndex) => {
        return !getArticleBlackListByBlockHeight().includes(
          articleIndex.blockHeight
        ); // Blockheight is not in blacklist
      })
      .filter((articleIndex) => {
        return !getArticleBlackListByArticleId().includes(
          articleIndex.value.metadata.id
        ); // Article id is not in blacklist
      });
  }

  return articlesIndexes
    .filter((articleIndex) => articleIndex.value.id) // Has id
    .filter((articleIndex) => {
      const splittedId = articleIndex.value.id.split("-");

      splittedId.pop();

      return splittedId.join("-") === articleIndex.accountId;
    }) // id begins with same accountId as index object
    .filter((articleIndex) => {
      return !getArticleBlackListByBlockHeight().includes(
        articleIndex.blockHeight
      ); // Blockheight is not in blacklist
    })
    .filter((articleIndex) => {
      return !getArticleBlackListByArticleId().includes(articleIndex.value.id); // Article id is not in blacklist
    });
}

function getLatestEdits(newFormatArticlesIndexes) {
  return newFormatArticlesIndexes.filter((articleIndex) => {
    const latestEditForThisArticle = newFormatArticlesIndexes.find(
      (newArticleData) => newArticleData.id === articleIndex.id
    );
    return (
      JSON.stringify(articleIndex) === JSON.stringify(latestEditForThisArticle)
    );
  });
}

function filterFakeAuthors(articleData, articleIndexData) {
  if (articleData.author === articleIndexData.accountId) {
    return articleData;
  }
}

function filterByArticleId(newFormatArticlesIndexes, articleIdToFilter) {
  return newFormatArticlesIndexes.filter((articleIndex) => {
    return articleIndex.value.id === articleIdToFilter;
  });
}

function getArticleData(articleIndex, action, key) {
  const socialGetURL = "https://api.near.social/get";

  const articleDataPromise = fetch(socialGetURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      keys: [`${articleIndex.accountId}/${action}/${key}`],
      blockHeight: articleIndex.blockHeight,
    }),
  }).then((response) => {
    return response.json();
  });

  return articleDataPromise;
}

function getArticleNormalized(articleIndex, action) {
  const key = "main";

  const articleData = getArticleData(articleIndex, action, key).then((data) => {
    let article = JSON.parse(data[articleIndex.accountId][action][key]);

    article.blockHeight = articleIndex.blockHeight;
    article.articleIndex = articleIndex;
    Object.keys(versions).forEach((versionName, index) => {
      if (articleIndex.versionIndex >= index) {
        const versionData = versions[versionName];
        article = versionData.normalizationFunction(article);
      }
    });

    return article;
  });

  return articleData;
}

function normalizeLibData(libDataByVersion) {
  let libData;

  Object.keys(versions).forEach((version, index, array) => {
    const normFn = versions[version].normalizationFunction;
    const validBlockHeightRange = versions[version].validBlockHeightRange;
    const normLibData = libDataByVersion[index]
      .filter((libData) => {
        if (validBlockHeightRange[1] === undefined) {
          return true;
        }

        return (
          validBlockHeightRange[0] < libData.blockHeight &&
          libData.blockHeight < validBlockHeightRange[1]
        );
      })
      .map((libData, i) => {
        if (libData) return normFn(libData);
      });

    if (index + 1 === array.length) {
      // Last index
      libData = normLibData;
      return;
    }
    libDataByVersion[index + 1] =
      libDataByVersion[index + 1].concat(normLibData);
  });

  return libData;
}

function isActive(article) {
  return !!!article.isDelete;
}

function getArticlesNormalized(/*userFilters*/) {
  const articlesIndexesByVersionPromises = Object.keys(versions).map(
    (version, versionIndex) => {
      // const action = versions[version].action;
      const action = getAction(version);

      const articlesIndexes = getArticlesIndexes(action, "main").then(
        (articles) => {
          const articlesWithVersionIndex = articles.map((article) => {
            article.versionIndex = versionIndex;

            return article;
          });

          return filterInvalidArticlesIndexes(articlesWithVersionIndex);
        }
      );

      return articlesIndexes;
    }
  );

  return Promise.all(articlesIndexesByVersionPromises).then(
    (articlesIndexesByVersion) => {
      const normalizedArticlesPromises = articlesIndexesByVersion
        .flat()
        .map((articleIndex) => {
          if (articleIndex.length === 0) return [];

          const articleVersionKey =
            Object.keys(versions)[Number(articleIndex.versionIndex)];
          const action = versions[articleVersionKey].action;

          if (action.includes("0.0.3")) return articleIndex;

          const article = getArticleNormalized(articleIndex, action).then(
            (articleNormalized) => {
              return articleNormalized;
            }
          );

          return article;
        });

      return Promise.all(normalizedArticlesPromises).then(
        (normalizedArticles) => {
          const latestActiveEdits = getLatestEdits(normalizedArticles);
          const activeArticles = latestActiveEdits.filter(isActive);

          return activeArticles;
        }
      );
    }
  );
}

function getArticles() {
  let normArticles;

  try {
    normArticles = getArticlesNormalized();
  } catch (err) {
    console.error(err);
  }

  return normArticles.then((normArticles) => {
    return filterValidArticles(normArticles);
  });
}

function normalizeOldToV_0_0_1(article) {
  article.realArticleId = `${article.author}-${article.timeCreate}`;
  article.sbts = ["public"];

  return article;
}

function normalizeFromV0_0_1ToV0_0_2(article) {
  if (!article.title) article.title = article.articleId;
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

  //Add day-month-year tag if it doesn't exists yet
  const creationDate = new Date(article.timeCreate);

  const dateTag = `${creationDate.getDate()}-${
    creationDate.getMonth() + 1
  }-${creationDate.getFullYear()}`;

  if (!article.tags.includes(dateTag)) article.tags.push(dateTag);

  if (article.blockHeight < 105654020 && article.sbts.includes("public")) {
    article.sbts = ["fractal.i-am-human.near - class 1"];
  }

  if (!article.category) {
    article.category = "Uncategorized";
  }

  return article;
}

function normalizeFromV0_0_3ToV0_0_4(article) {
  return article;
}

function getNewArticleIdFormat(oldId) {
  const splittedId = oldId.split("-");
  const timestampPartOfId = splittedId.pop();
  const accountIdPartOfId = splittedId.join("/");

  const newArticleId = `article/${accountIdPartOfId}/${timestampPartOfId}`;

  return newArticleId;
}

function normalizeFromV0_0_4ToV0_0_5(article) {
  const articleCopy = { ...article };

  if (article.value && article.value.metadata.versionKey === "v0.0.3") {
    delete article.accountId;
    delete article.blockHeight;

    return articleCopy;
  }

  articleCopy.value = {};
  articleCopy.value.metadata = {};
  articleCopy.value.articleData = {};

  //articleData section
  articleCopy.value.articleData.title = articleCopy.title;
  delete articleCopy.title;

  articleCopy.value.articleData.body = articleCopy.body;
  delete articleCopy.body;

  articleCopy.value.articleData.tags = articleCopy.tags;
  delete articleCopy.tags;

  articleCopy.value.articleData.category = articleCopy.category;
  delete articleCopy.category;

  //metadata section
  articleCopy.value.metadata.author = articleCopy.author;
  delete articleCopy.author;

  if (articleCopy.isDelete !== undefined) {
    articleCopy.value.metadata.isDelete = articleCopy.isDelete;
    delete articleCopy.isDelete;
  }

  articleCopy.value.metadata.createdTimestamp = articleCopy.timeCreate;
  delete articleCopy.timeCreate;

  articleCopy.value.metadata.lastEditTimestamp = articleCopy.timeLastEdit;
  delete articleCopy.timeLastEdit;

  articleCopy.value.metadata.id = getNewArticleIdFormat(articleCopy.id);
  delete articleCopy.id;

  //Add data to metada
  articleCopy.value.metadata.versionKey = "v0.0.5";

  //delete data not used
  delete articleCopy.version;
  delete articleCopy.lastEditor;
  delete articleCopy.navigation_id;
  delete articleCopy.sbts;
  delete articleCopy.blockHeight;
  delete articleCopy.articleIndex;

  if (!!articleCopy.value.metadata.isDelete) return articleCopy;
  articleCopy.value.articleData.category = "uncategorized";

  return articleCopy;
}

async function uploadData(articlesJsons, articles) {
  const socialContract = await getContract();

  for (let i = 0; i < articlesJsons.length; i++) {
    console.log(`article json ${i} : `, articlesJsons[i]);

    const articleReference = `article with articleReference title ${articles[i].value.articleData.title} and lastEditTimestamp ${articles[i].value.metadata.lastEditTimestamp}`;
    console.log(`Deploying ${articleReference}`);

    try {
      await socialContract.set(
        {
          data: articlesJsons[i],
        },
        `${3 * 10 ** 14}`,
        "1" + "0".repeat(23)
      );
      console.log(`Deployed ${articleReference}`);
    } catch (err) {
      console.log(`Error deploying ${articleReference}`);
      console.log(err);
    } finally {
      await sleep(1521);
    }
  }
}

async function getContract() {
  const CREDENTIALS_DIR = ".near-credentials";
  const credentialsPath = path.join(homedir(), CREDENTIALS_DIR);
  console.log("credentialsPath", credentialsPath);
  const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(
    credentialsPath
  );

  const connectionConfig = {
    networkId: "mainnet",
    keyStore: myKeyStore, // first create a key store
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://nearblocks.io",
  };
  const nearConnection = await connect(connectionConfig);
  // const walletConnection = new WalletConnection(nearConnection);
  const account = await nearConnection.account(ACCOUNT);

  const contract = new Contract(
    account, // the account object that is connecting
    "social.near",
    {
      // name of contract you're connecting to
      viewMethods: [], // view methods do not change state but usually return a value
      changeMethods: ["set"], // change methods modify state
    }
  );

  return contract;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  // const oldArticles = await getArticles();

  // const oldArticlesNormalizedToLastVersion = oldArticles.map((article) => {
  //   const newVersion = normalizeFromV0_0_4ToV0_0_5(article);
  //   return newVersion;
  // });

  // console.log(
  //   "Total old articles: ",
  //   oldArticlesNormalizedToLastVersion.length
  // );
  // const articlesJsons = getArticlesJsons(oldArticlesNormalizedToLastVersion);
  // uploadData(articlesJsons, oldArticlesNormalizedToLastVersion);

  const articles = [
    {
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
          tags: [Array],
          category: "uncategorized",
        },
      },
    },
  ];
  const articlesJsons = getArticlesJsons(articles);

  uploadData(articlesJsons, articles);

  // console.log(0, await getArticlesIndexes("test_communityVoiceArticle_v0.0.3", "main"))
}

run();
