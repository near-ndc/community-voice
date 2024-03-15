const { getFromIndex } = VM.require("sayalot.near/widget/lib.socialDbIndex")

let config = {}
const currentVersion = "v0.0.3"

function setConfig(value) {
  config = value
}

function getConfig() {
  return config
}

function normalizeOldToV_0_0_1(upVote) {
  return upVote;
}

function normalizeFromV0_0_1ToV0_0_2(upVote) {
  upVote.sbts = ["public"];
  return upVote;
}

function normalizeFromV0_0_2ToV0_0_3(upVote) {
  if(upVote.value.isDelete) {
    upVote.value.metadata = {
      id,
      isDelete: true,
      deleteTimestamp: Date.now()  
    }
    delete upVote.value.isDelete
    return upVote
  }

  const splitUpVoteId = upVote.value.upVoteId.split("-")
  splitUpVoteId.shift() // Removes first element
  splitUpVoteId.pop() // Removes last element
  const author = splitUpVoteId.join("-")
  upVote.value.metadata = {
    id: upVote.value.upVoteId,
    author,
    sbt: upVote.value.sbts[0],
    createdTimestamp: Date.now(),
    lastEditTimestamp: Date.now(),
    versionKey: "v0.0.3"
  }
  delete upVote.value.upVoteId
  delete upVote.value.sbts
  return upVote;
}

function normalizeFromV0_0_3ToV0_0_4(upVote) {
  return upVote;
}

const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    suffixAction: "",
  },
  "v0.0.1": {
    normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
    suffixAction: `-v0.0.1`,
  },
  "v0.0.2": {
    normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
    suffixAction: `_v0.0.2`,
  },
  "v0.0.3": {
    normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
    suffixAction: `_v0.0.3`,
  },
};

function getUpVotesData(action, id) {
  return getFromIndex(action, id)
}

function fillAction(version, isTest) {
  const baseAction = getConfig().baseActions.upVote
  const filledAction = baseAction + version.suffixAction
  return isTest ? `test_${filledAction}` : filledAction
}

function getUpVoteBlackListByBlockHeight() {
  return [];
}

function getLatestEdits(upVotes) {
  return upVotes.filter((obj) => {
    const userLatestInteraction = upVotes.find(
      (vote) => vote.accountId === obj.accountId
    );
    return JSON.stringify(userLatestInteraction) === JSON.stringify(obj);
  });
}

function filterInvalidUpVotes(upVotes) {
  return upVotes
  .filter((upVote) => upVote.value.upVoteId) // Has id
  .filter(
    (upVote) =>
      !getUpVoteBlackListByBlockHeight().includes(upVote.blockHeight) // Blockheight is not in blacklist
  );
}

function normalizeUpVote(upVote, versionsIndex) {
  const versionsKeys = Object.keys(versions)
  for(let i = versionsIndex; i < versionsKeys.length; i++) {
    const version = versions[versionsKeys[i]]
    upVote = version.normalizationFunction(upVote)
  }
  return upVote
}

function isActive(upVote) {
  return upVote.value.metadata && !upVote.value.metadata.isDelete
}

function getUpVotes(articleId, config) {
  setConfig(config)
  const upVotesByVersionPromise = Object.keys(versions).map((version, versionIndex, arr) => {
    const action = fillAction(versions[version])
    return getUpVotesData(action, articleId)
  });

  return Promise.all(upVotesByVersionPromise).then((upVotesByVersion) => {
    const upVotes = upVotesByVersion.flat()
    const validUpVotes = filterInvalidUpVotes(upVotes)
    const normalizedVotes = nonDeletedVotes.map((upVote) => normalizeUpVote(upVote, versionIndex))
    const latestUpVotes = getLatestEdits(validUpVotes)

    const nonDeletedVotes = latestUpVotes.filter((vote) => {
      return !vote.value.isDelete;
    });


    return normalizedVotes
  })
}

function validateUpVoteData(article) {
  // ADD SBT VALIDATION
  // const expectedStringProperties = ["title", "body"];
  // const expectedArrayProperties = ["tags"];
  const errArrMessage = [];
  // String properties
  // errArrMessage.push(
  //   ...expectedStringProperties
  //     .filter((currentProperty) => {
  //       const isValidProperty =
  //         !article[currentProperty] ||
  //         typeof article[currentProperty] !== "string";
  //       return isValidProperty;
  //     })
  //     .map(
  //       (currentProperty) =>
  //         `Missing ${camelCaseToUserReadable(currentProperty)} or not a string`
  //     )
  // );
  // Array properties
  // errArrMessage.push(
  //   ...expectedArrayProperties
  //     .filter((currentProperty) => {
  //       return !Array.isArray(article[currentProperty]);
  //     })
  //     .map(
  //       (currentProperty) =>
  //         `Article ${camelCaseToUserReadable(
  //           currentProperty
  //         )}'s is not an array`
  //     )
  // );

  return errArrMessage;
}

function validateNewUpVote(upVoteData) {
  const errorArray = validateUpVoteData(upVoteData);
  return errorArray;
}

function createUpVote(
  config,
  upVoteData,
  userMetadataHelper,
  onCommit,
  onCancel
) {
  setConfig(config);
  const errors = validateNewUpVote(upVoteData, author);
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
    articleData: upVoteData,
    metadata,
  };
  const result = executeSaveArticle(article, onCommit, onCancel);
  return { error: false, data: result };

}



return { getUpVotes, normalizeOldToV_0_0_1, normalizeFromV0_0_1ToV0_0_2, normalizeFromV0_0_2ToV0_0_3, getUpVotesData, fillAction, getUpVoteBlackListByBlockHeight, getLatestEdits, filterInvalidUpVotes, normalizeUpVote }
