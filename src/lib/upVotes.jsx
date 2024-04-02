const { getFromIndex } = VM.require("communityvoice.ndctools.near/widget/lib.socialDbIndex");
const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
  "communityvoice.ndctools.near/widget/lib.metadata"
);

const { getNotificationData } = VM.require(
  "communityvoice.ndctools.near/widget/lib.notifications"
);

let config = {};
const ID_PREFIX = "upVote"
const currentVersion = "v0.0.3";

function setConfig(value) {
  config = value;
}

function getConfig() {
  return config;
}

function normalizeOldToV_0_0_1(upVote) {
  return upVote;
}

function normalizeFromV0_0_1ToV0_0_2(upVote) {
  upVote.sbts = ["public"];
  return upVote;
}

function normalizeFromV0_0_2ToV0_0_3(upVote) {
  const now = Date.now()
  if (upVote.value.isDelete) {
    upVote.value.metadata = {
      id,
      isDelete: true,
      deleteTimestamp: now,
    };
    delete upVote.value.isDelete;
    return upVote;
  }

  const author = upVote.value.upVoteId.split("/")[1]
  upVote.value.metadata = {
    id: upVote.value.upVoteId,
    author,
    createdTimestamp: now,
    lastEditTimestamp: now,
    versionKey: "v0.0.3",
  };
  delete upVote.value.upVoteId;
  delete upVote.value.sbts;
  return upVote;
}

function normalizeFromV0_0_3ToV0_0_4(upVote) {
  return upVote;
}

const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    actionSuffix: "",
  },
  "v0.0.1": {
    normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
    actionSuffix: `-v0.0.1`,
  },
  "v0.0.2": {
    normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
    actionSuffix: `_v0.0.2`,
  },
  "v0.0.3": {
    normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
    actionSuffix: `_v0.0.3`,
  },
};

function getUpVotesData(action, id) {
  return getFromIndex(action, id);
}

function fillAction(version) {
  const baseAction = getConfig().baseActions.upVote;
  const filledAction = baseAction + version.actionSuffix;
  return getConfig().isTest ? `test_${filledAction}` : filledAction;
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
    .filter((upVote) => upVote.value.metadata.id) // Has id
    .filter(
      (upVote) =>
        !getUpVoteBlackListByBlockHeight().includes(upVote.blockHeight) // Blockheight is not in blacklist
    );
}

function normalizeUpVote(upVote, versionsIndex) {
  const versionsKeys = Object.keys(versions);
  for (let i = versionsIndex; i < versionsKeys.length; i++) {
    const version = versions[versionsKeys[i]];
    upVote = version.normalizationFunction(upVote);
  }
  return upVote;
}

function isActive(upVote) {
  return upVote.value.metadata && !upVote.value.metadata.isDelete;
}

function getUpVotes(config, articleId) {
  setConfig(config);
  const upVotesByVersionPromise = Object.keys(versions).map(
    (version, versionIndex, arr) => {
      const action = fillAction(versions[version]);

      return getUpVotesData(action, articleId).then((upVotes) => {
        const validUpVotes = filterInvalidUpVotes(upVotes);
        const latestUpVotes = getLatestEdits(validUpVotes);

        const activeUpVotes = latestUpVotes.filter(isActive);

        const normalizedVotes = activeUpVotes.map((upVote) =>
          normalizeUpVote(upVote, versionIndex)
        );

        return normalizedVotes;
      });
    }
  );
  return Promise.all(upVotesByVersionPromise).then((upVotesByVersion) => {
    return upVotesByVersion.flat();
  });
}

function getAction(version) {
  const baseAction = getConfig().baseActions.upVote;
  const versionData = version ? versions[version] : versions[currentVersion];
  const action = baseAction + versionData.actionSuffix;
  return getConfig().isTest ? `test_${action}` : action;
}

function composeData(upVote) {
  //version and config are optative for testing
  let data = {
    index: {
      [getAction()]: JSON.stringify({
        key: upVote.metadata.articleId,
        value: {
          ...upVote,
        },
      }),
    },
  };

  if(upVote.metadata.isDelete) return data

  const articleIdSplitted = upVote.metadata.articleId.split("/");
  const articleAuthor = articleIdSplitted[1];
  
  const dataToAdd = getNotificationData(
    getConfig(),
    "upVote",
    [],
    upVote.metadata,
    {author: articleAuthor}
  );

  data.post = dataToAdd.post;
  data.index.notify = dataToAdd.index.notify;

  return data;
}

function executeSaveUpVote(
  upVote,
  onCommit,
  onCancel
) {
  //version and config are optative for testing
  const newData = composeData(upVote);
  Social.set(newData, {
    force: true,
    onCommit,
    onCancel,
  });
}

function createUpVote(
  config,
  articleId,
  author,
  onCommit,
  onCancel
) {
  setConfig(config);

  const metadataHelper = {
    author,
    idPrefix: ID_PREFIX,
    versionKey: currentVersion,
  };

  const metadata = generateMetadata(metadataHelper);

  const upVote = {
    metadata: {
      ...metadata,
      articleId
    },
  }
  const result = executeSaveUpVote(upVote, onCommit, onCancel);
  return { error: false, data: result };

}

function deleteUpVote(
  config,
  articleId,
  upVoteId,
  onCommit,
  onCancel
) {
  setConfig(config);

  const deleteMetadata = buildDeleteMetadata(upVoteId);
  const upVote = {
    metadata: {
      ...deleteMetadata,
      articleId
    },
  };
  executeSaveUpVote(upVote, onCommit, onCancel);
}

return {
  getUpVotes,
  createUpVote,
  deleteUpVote,
  functionsToTest: {
    normalizeOldToV_0_0_1,
    normalizeFromV0_0_1ToV0_0_2,
    normalizeFromV0_0_2ToV0_0_3,
    getUpVotesData,
    fillAction,
    getUpVoteBlackListByBlockHeight,
    getLatestEdits,
    filterInvalidUpVotes,
    normalizeUpVote,
    composeData,
    executeSaveUpVote,
    createUpVote,
    deleteUpVote,
  },
};
