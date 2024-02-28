const { getFromIndex } = VM.require("sayalot.near/widget/lib.socialDbIndex")

let config = {}

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

function getUpVotes(articleId, config) {
  setConfig(config)
  const upVotesByVersionPromise = Object.keys(versions).map((version, versionIndex, arr) => {
    const action = fillAction(versions[version])

    return getUpVotesData(action, articleId).then((upVotes) => {
      const validUpVotes = filterInvalidUpVotes(upVotes)
      const latestUpVotes = getLatestEdits(validUpVotes)

      const nonDeletedVotes = latestUpVotes.filter((vote) => {
        return !vote.value.isDelete;
      });

      const normalizedVotes = nonDeletedVotes.map((upVote) => normalizeUpVote(upVote, versionIndex))

      return normalizedVotes
    })
  });
  return Promise.all(upVotesByVersionPromise).then((upVotesByVersion) => {
    return upVotesByVersion.flat()
  })
}



return { getUpVotes }