const isTest = true;

const currentVersion = "0.0.2";

const prodAction = `${
  getConfig(isTest).baseActions.article
}_v${currentVersion}`;
const testAction = `test_${prodAction}`;
const versionsBaseActions = isTest
  ? `test_${getConfig(isTest).baseActions.article}`
  : getConfig(isTest).baseActions.article;

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
  // "v0.0.3": {
  //   normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
  //   actionSuffix: `_v0.0.3`,
  //   validBlockHeightRange: [Infinity, Infinity],
  // },
};

function getAction(version) {
  const baseAction = getConfig(isTest).baseActions.article;
  const versionData = version ? versions[version] : versions[currentVersion];
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

function filterInvalidArticlesIndexes(articlesIndexes) {
  // const myArticlesIndexes = articlesIndexes.filter(
  //   (articleIndex) => articleIndex.accountId === "kenrou-it.near"
  // );

  return articlesIndexes
    .filter((articleIndex) => articleIndex.value.id) // Has id
    .filter((articleIndex) => {
      const splittedId = articleIndex.value.id.split("-");
      splittedId.pop();

      return splittedId.join("-") === articleIndex.accountId;
    }) // id begins with same accountId as index object
    .filter(
      (articleIndex) =>
        !getArticleBlackListByBlockHeight().includes(articleIndex.blockHeight) // Blockheight is not in blacklist
    )
    .filter(
      (articleIndex) =>
        !getArticleBlackListByRealArticleId().includes(articleIndex.value.id) // Article id is not in blacklist
    );
}

function getLatestEdits(newFormatArticlesIndexes) {
  return newFormatArticlesIndexes.filter((articleIndex) => {
    const latestEditForThisArticle = newFormatArticlesIndexes.find(
      (newArticleData) => newArticleData.value.id === articleIndex.value.id
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

function getArticleNormalized(articleIndex) {
  // const articleVersionIndex = Object.keys(versions).findIndex((versionName, index) => {
  //   // const versionData = versions[versionName];

  //   return (
  //     articleIndex.versionIndex === index + 1
  //     // versionData.validBlockHeightRange[0] <= articleIndex.blockHeight &&
  //     // (articleIndex.blockHeight < versionData.validBlockHeightRange[1] ||
  //     //   versionData.validBlockHeightRange[1] === undefined)
  //   );
  // });

  // const articleVersionKey = Object.keys(versions)[articleVersionIndex];

  const articleVersionKey =
    Object.keys(versions)[Number(articleIndex.versionIndex)];
  const action = versions[articleVersionKey].action;

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

function normalizeArticle(article) {
  const versionsKeys = Object.keys(versions);
  const versionIndex = article.versionIndex;

  for (let i = versionIndex; i < versionsKeys.length; i++) {
    const version = versions[versionsKeys[i]];
    article = version.normalizationFunction(article);
  }
  delete article.versionIndex;

  return article;
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

          return articlesWithVersionIndex;
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

          const article = getArticleNormalized(articleIndex).then(
            (articleNormalized) => {
              return articleNormalized;
            }
          );

          return article;
        });

      // const articles = articlesVersionArray.flat();
      // const normalizedArticles = articles.map((article) =>
      //   normalizeArticle(article)
      // );

      return Promise.all(normalizedArticlesPromises).then(
        (normalizedArticles) => {
          const latestActiveEdits = getLatestEdits(normalizedArticles);
          const activeArticles = latestActiveEdits.filter(isActive);

          return activeArticles;
        }
      );
      // const filteredArticles = applyUserFilters(activeArticles, userFilters);
    }
  );
}

function getArticles() {
  // Call other libs
  let normArticles;

  try {
    normArticles = getArticlesNormalized();
    // Keep last edit from every article
    // const lastEditionArticles = normArticles.filter((article) => {
    //   return normArticles.find(
    //     (compArticle) => JSON.stringify(compArticle) === JSON.stringify(article)
    //   );
    // });

    // const finalArticles = filterValidArticles(normArticles);
    // return finalArticles;
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
  article.title = article.articleId;
  article.id = article.realArticleId;
  if (article.sbts[0] !== "public") {
    article.sbts[0] = article.sbts[0] + " - class 1";
  } // There is only one article that is not public and only has class 1

  delete article.articleId;
  delete article.realArticleId;

  return article;
}

// function filterMultipleKanbanTags(articleTags, kanbanTags) {
//   const normalizedKanbanTag = [];
//   kanbanTags.forEach((tag) => {
//     normalizedKanbanTag.push(tag.replace(` `, "-"));
//   });

//   const kanbanTagsInArticleTags = articleTags.filter((tag) =>
//     normalizedKanbanTag.includes(tag.toLowerCase().replace(` `, "-"))
//   );

//   const nonKanbanTags = articleTags.filter(
//     (tag) => !normalizedKanbanTag.includes(tag.toLowerCase().replace(` `, "-"))
//   );

//   const result = [...nonKanbanTags, kanbanTagsInArticleTags[0]];

//   return result;
// }

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

  // if (kanbanColumns) {
  //   const lowerCaseColumns = [];
  //   kanbanColumns.forEach((cl) => {
  //     lowerCaseColumns.push(cl.toLowerCase());
  //   });

  //   article.tags = filterMultipleKanbanTags(article.tags, lowerCaseColumns);
  // }

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

async function run() {
  const articles = await getArticles();
}

run();

// getArticlesIndexes("test_communityVoiceArticle_v0.0.2", "main").then((res) => {
// });

// const articlesPromise = fetch("https://api.near.social/index", {
//   action: "test_communityVoiceArticle_v0.0.2",
//   key: "main",
// }).then((res) => {
//   res.json().then((res2) => {
//   });

//   return res.body;
// });
