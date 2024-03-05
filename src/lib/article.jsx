const { getUserSBTs, getSBTWhiteList } = VM.require("sayalot.near/widget/lib.SBT");
const { getUpVotes } = VM.require("sayalot.near/widget/lib.upVotes");
const { generateMetadata } = VM.require("sayalot.near/widget/lib.metadata");
const { camelCaseToUserReadable } = VM.require("sayalot.near/widget/lib.strings");

const baseAction = "sayALotArticle";
const testAction = `test_${baseAction}`
const prodAction = `${baseAction}`
const versionsBaseActions = isTest ? `test_${baseAction}` : baseAction;

const currentVersion = "v0.0.3"

let config = {}

function setConfig(value) {
    config = value
}

function getConfig() {
    return config
}

function getAction(version) {
    const baseAction = getConfig().baseActions.article
    const versionData = version ? versions[version] : versions[currentVersion]
    console.log(1, versions, currentVersion)
    const action = baseAction + versionData.actionSuffix
    return getConfig().isTest ? `test_${action}` : action
}

function setIsTest(value) {
    isTest = value
}

/**
 * 
 * @returns It might return first null and then an empty array and finally an array containing the index structure of communities
 */
function getArticles(config) {
    setConfig(config)
    return getArticlesNormalized()
}

function filterFakeAuthors(articleData, articleIndexData) {
    if (articleData.author === articleIndexData.accountId) {
        return articleData;
    }
}

function getArticleNormalized(articleIndex, action) {
    const articleVersionIndex = Object.keys(versions).findIndex((versionName) => {
        const versionData = versions[versionName]
        return (
            versionData.validBlockHeightRange[0] <= articleIndex.blockHeight
            && articleIndex.blockHeight < versionData.validBlockHeightRange[1]
            || versionData.validBlockHeightRange[1] === undefined
        )
    })

    const articleVersionKey = Object.keys(versions)[articleVersionIndex]
    // const action = versions[articleVersionKey].action
    const key = "main"

    return asyncFetch(" https://api.near.social/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            keys: [`${articleIndex.accountId}/${action}/${key}`],
            blockHeight: articleIndex.blockHeight
        })

    }).then((response) => {
        // console.log("response 2: ", response)
        //ERROR: Check the structure of the response to define "article"
        console.log("response 3: ", response)
        let article = JSON.parse(response.body[articleIndex.accountId][action][key])
        article.blockHeight = articleIndex.blockHeight
        article.articleIndex = articleIndex
        Object.keys(versions).forEach((versionName, index) => {
            if (articleVersionIndex >= index) {
                const versionData = versions[versionName]
                article = versionData.normalizationFunction(article)
            }
        })
        return article
    })
}

function processArticles(articles) {
    console.log(4, articles)
    return Promise.all(articles.map((article) => {
        return article.author
    }).filter((author, index, authorArray) => {
        const firstIndex = authorArray.findIndex((author2) => {
            return author === author2
        })
        return firstIndex === index
    }).map((author) => {
        return getUserSBTs(author).then((userSbts) => {
            return [author, userSbts]
        })
    })).then((uniqueAuthorsSBTs) => {
        console.log("User sbts", uniqueAuthorsSBTs)
        let articlesBySBT = {}
        console.log(3, articles)
        articles.filter((article) => {
            const articleSbt = article.sbts[0]
            if (articleSbt === "public") return true

            const author = article.author
            const [sbtName, sbtClass] = articleSbt.split(" - class ")

            const authorSbtPair = uniqueAuthorsSBTs.find(([author2, _]) => author === author2)
            if (!authorSbtPair) return false

            const authorSbts = authorSbtPair[1]
            const sbtPair = authorSbts.find(([sbtName2, _]) => sbtName === sbtName2)
            if (!sbtPair) return false

            const sbtPairClasses = sbtPair[1].map((sbt) => sbt.metadata.class)
            return sbtPairClasses.includes(parseInt(sbtClass))
        }).forEach((article, index, arr) => {
            const articleSbt = article.sbts[0]
            if (!articlesBySBT[articleSbt]) {
                articlesBySBT[articleSbt] = []
            }
            articlesBySBT[articleSbt].push(article)
        })
        return articlesBySBT
    })
}

// function appendExtraDataToArticle(article) {
//     article.upVotesPromise = getUpVotes(article.articleIndex.value.id, getConfig())
//     // article.upVotesPromise.then((upVotes) => {
//     //     console.log(article.articleIndex.value.id, upVotes.length)
//     // })


//     return article
// }

function processArticlesIndexes(articlesIndexes, action) {
    const validArticlesIndexes = filterInvalidArticlesIndexes(articlesIndexes)
    
    const validLatestEdits = getLatestEdits(validArticlesIndexes);
    
    console.log("articlesIndexes: ", articlesIndexes)
    const articlesIndexesPromises = validLatestEdits.map((articleIndex) => {
        return getArticleNormalized(articleIndex, action)
        // .then((article) => normalizeArticle(article, articleIndex))

        // return filterFakeAuthors(getArticle(articleIndex, action), articleIndex);
    })

    const articlesPromises = Promise.all(articlesIndexesPromises).then((articles) => {
        const nonFakeAuthorsArticles = articles.filter((article, index) => {
            const articleIndex = validLatestEdits[index]
            return article.author === articleIndex.accountId
        })

        // const articlesWithExtraData = nonFakeAuthorsArticles.map(appendExtraDataToArticle)
        // console.log(2, articlesWithExtraData)
        return processArticles(nonFakeAuthorsArticles, validLatestEdits)
    })

    return articlesPromises
}

function getArticleBlackListByBlockHeight() {
    return [
        91092435, 91092174, 91051228, 91092223, 91051203, 98372095, 96414482,
        96412953, 103131250, 106941548, 103053147, 102530777
    ];
}

function getArticleBlackListByRealArticleId() {
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
    // console.log(11, newFormatArticlesIndexes)
    return newFormatArticlesIndexes.filter((articleIndex) => {
        const latestEditForThisArticle = newFormatArticlesIndexes.find(
            (newArticleData) => newArticleData.value.id === articleIndex.value.id
        );
        return (
            JSON.stringify(articleIndex) === JSON.stringify(latestEditForThisArticle)
        );
    });
}

function getArticlesNormalized() {
    const articlesBySbtByVersionPromises = Object.keys(versions).map((version) => {
        // const action = versions[version].action;
        const action = getAction(version)
        const articles = getArticlesIndexes(action, "main").then((articlesIndexes) => processArticlesIndexes(articlesIndexes, action))

        return articles
        // return finalArticlesByVersion.flat()
    })

    return Promise.all(articlesBySbtByVersionPromises).then((articlesBySbtArray) => {
        let output = {}
        articlesBySbtArray.forEach((articlesBySbt) => {
            const sbts = Object.keys(articlesBySbt)
            sbts.forEach((sbtName) => {
                if (!output[sbtName]) {
                    output[sbtName] = []
                }
                output[sbtName].push(...articlesBySbt[sbtName])
            })
        })
        return output
    })
}

function getArticlesIndexes(action, key) {
    const indexUrl = "https://api.near.social/index"
    const articlesPromise = asyncFetch(indexUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action,
            key,
            options: {
                order: "desc"
            }
        })
    }).then((response) => response.body)

    return articlesPromise
}

function processCommunities(communitiesIndexes) {
    const validCommunities = filterValidCommunities(communitiesIndexes)
    const latestEdit = getLatestEdit(validCommunities)
    const nonDeletedLatest = removeDeleted(latestEdit)

    return nonDeletedLatest
}

function filterValidCommunities(communitiesIndexes) {
    const accountIdMatch = filterAccountIdWithCommunityId(communitiesIndexes)

    return accountIdMatch
}

function filterAccountIdWithCommunityId(communitiesIndexes) {
    return communitiesIndexes.filter((communityIndex) => {
        return communityIndex.value.communityData.id.startsWith(communityIndex.accountId)
    })
}

function getLatestEdit(communitiesIndexes) {
    return communitiesIndexes.filter((communityIndex, index) => {
        return communitiesIndexes.findIndex((communityIndex2) => {
            return communityIndex.value.communityData.id === communityIndex2.value.communityData.id
        }) === index
    })
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

    const dateTag = `${creationDate.getDate()}-${creationDate.getMonth() + 1
        }-${creationDate.getFullYear()}`;

    if (!article.tags.includes(dateTag)) article.tags.push(dateTag);

    if (article.blockHeight < 105654020 && article.sbts.includes("public")) {
        article.sbts = ["fractal.i-am-human.near - class 1"];
    }

    return article;
}

// EDIT: set versions you want to handle, considering their action to Social.index and the way to transform to one version to another (normalization)
const versions = {
    old: {
        normalizationFunction: normalizeOldToV_0_0_1,
        actionSuffix: "",
        validBlockHeightRange: [0, 102530777],
    },
    "v0.0.1": {
        normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
        actionSuffix: `_v0.0.1`,
        validBlockHeightRange: [102530777, 103053147],
    },
    "v0.0.2": {
        normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
        actionSuffix: `_v0.0.2`,
        validBlockHeightRange: [103053147, Infinity],
    },
    "v0.0.3": {
        normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
        actionSuffix: `_v0.0.3`,
        validBlockHeightRange: [Infinity, Infinity],
    },
};

function validateArticle(article, ownerId) {
    // ADD SBT VALIDATION
    const expectedStringProperties = [
        "title",
        "author",
        "body",
        "sbt"
    ]
    const expectedArrayProperties = [
        "tags"
    ]
    const errArrMessage = []
    // String properties
    errArrMessage.push(...expectedStringProperties.filter((currentProperty) => {
        const isValidProperty = !article[currentProperty] || typeof article[currentProperty] !== "string"
        return isValidProperty
    }).map((currentProperty) => `Missing ${camelCaseToUserReadable(currentProperty)} or not a string`))
    // Array properties
    errArrMessage.push(...expectedArrayProperties.filter((currentProperty) => {
        return !Array.isArray(article[currentProperty])
    }).map((currentProperty) => `Article ${camelCaseToUserReadable(currentProperty)}'s is not an array`))
    
    const sbtWhiteList = getSBTWhiteList(getConfig())

    if (!ownerId) {
        errArrMessage.push("Owner id not shared")
    }
    if (article.id) {
        errArrMessage.push(`There is already an article with id ${article.id}`)
    }
    if(!sbtWhiteList.map((sbt) => sbt.value).includes(article.sbt)) {
        errArrMessage.push(`Invalid SBT: ${article.sbt}`)
    }
    
    return errArrMessage
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

function composeData(article, metadata) {
    let data = {
      index: {
        [getAction()]: JSON.stringify({
          key: "main",
          value: {
            article,
            metadata
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

function executeSaveCommunity(article, metadata, onCommit, onCancel) {
    const newData = composeData(article, metadata);
    Social.set(newData, {
        force: true,
        onCommit,
        onCancel,
    });

    return article.id
};

function createArticle(config, article, ownerId, onCommit, onCancel) {
    setConfig(config)
    const errors = validateArticle(article, ownerId);
    if (errors && errors.length) {
        return { error: true, data: errors }
    }

    article.id = `article/${ownerId}/${Date.now()}`
    const metadata = generateMetadata()
    const result = executeSaveCommunity(article, metadata, onCommit, onCancel)
    return { error: false, data: result };

};

return { setIsTest, createArticle, getArticles, editCommunity, deleteCommunity, getLatestEdits, getArticleNormalized, getArticlesIndexes }