const { getFromIndex } = VM.require("sayalot.near/widget/lib.socialDbIndex");
const { normalize } = VM.require("sayalot.near/widget/lib.normalization");

let config = {};

const currentVersion = "v0.0.3";

function normalizeOldToV_0_0_1(comment) {
  return comment;
}

function normalizeFromV0_0_1ToV0_0_2(comment) {
  return comment;
}

function normalizeFromV0_0_2ToV0_0_3(comment) {
  comment.value.comment.rootId = comment.value.comment.originalCommentId;
  delete comment.value.comment.originalCommentId;
  delete comment.value.comment.id;

  return comment;
}

function getSplittedCommentId(commentId) {
  const splittedBy_ = commentId.split("_");
  const prefix = splittedBy_.shift() + "_";

  const joinedAfterRemovePrefix = splittedBy_.join("_");

  const secondSplit = joinedAfterRemovePrefix.includes("/")
    ? joinedAfterRemovePrefix.split("/")
    : joinedAfterRemovePrefix.split("-");

  secondSplit.unshift(prefix);

  return secondSplit;
}

function normalizeFromV0_0_3ToV0_0_4(comment) {
  const now = Date.now();
  const splitCommentId = getSplittedCommentId(comment.value.comment.commentId);
  splitCommentId.shift(); // Removes first element
  splitCommentId.pop(); // Removes last element
  const author = comment.value.comment.commentId.includes("/")
    ? splitCommentId
    : splitCommentId.join("-");
  comment.value.metadata = {
    id: comment.value.comment.commentId,
    author,
    createdTimestamp: now,
    lastEditTimestamp: now,
    rootId: comment.value.comment.rootId,
    versionKey: "v0.0.4",
  };

  delete comment.value.comment.commentId;
  delete comment.value.comment.rootId;

  return comment;
}

const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    suffixAction: baseAction,
  },
  "v1.0.1": {
    normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
    suffixAction: `-v1.0.1`,
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

function setConfig(newConfig) {
  config = newConfig;
}

function getConfig() {
  return config;
}

function fillAction(version, config) {
  const baseAction = config.baseActions.comment;
  const filledAction = baseAction + version.suffixAction;
  return config.isTest ? `test_${filledAction}` : filledAction;
}

function getCommentBlackListByBlockHeight() {
  return [98588599];
}

function filterInvalidComments(comments) {
  return comments
    .filter(
      (comment) =>
        comment.blockHeight &&
        !getCommentBlackListByBlockHeight().includes(comment.blockHeight) // Comment is not in blacklist
    )
    .filter(
      (comment) =>
        comment.accountId ===
        getUserNameFromCommentId(comment.value.comment.commentId)
    );
}

function getUserNameFromCommentId(commentId) {
  const userNamePlusTimestamp = commentId.split("c_")[1];

  const splittedUserNamePlusTimestamp = userNamePlusTimestamp.split("-");

  splittedUserNamePlusTimestamp.pop();

  const userName = splittedUserNamePlusTimestamp.join("-");

  return userName;
}

function processComments(comments) {
  const lastEditionComments = comments.filter((comment) => {
    const firstCommentWithThisCommentId = comments.find((compComment) => {
      return (
        compComment.value.comment.commentId === comment.value.comment.commentId
      );
    });

    return (
      JSON.stringify(firstCommentWithThisCommentId) === JSON.stringify(comment)
    );
  });

  const lastEditionCommentsWithoutDeletedOnes = lastEditionComments.filter(
    (comment) => !comment.value.comment.isDeleted
  );

  const lastEditionCommentsWithEditionMark =
    lastEditionCommentsWithoutDeletedOnes.map((comment) => {
      const commentsWithThisCommentId = comments.filter((compComment) => {
        return (
          comment.value.comment.commentId ===
          compComment.value.comment.commentId
        );
      });

      if (commentsWithThisCommentId.length > 1) {
        comment.isEdition = true;
      }

      return comment;
    });

  return lastEditionCommentsWithEditionMark;
}

function getComments(articleId, config) {
  setConfig(config);
  const commentsByVersionPromise = Object.keys(versions).map(
    (version, index, arr) => {
      const action = fillAction(versions[version], config);

      return getFromIndex(action, articleId).then((comments) => {
        const validComments = filterInvalidComments(comments);

        return validComments.map((comment) => {
          return normalize(comment, versions, index);
        });
      });
    }
  );

  return Promise.all(commentsByVersionPromise).then((commentsByVersion) => {
    return processComments(commentsByVersion.flat());
  });
}

function getAction(version, config) {
  //version and config are optative for testing
  const baseAction =
    config.baseActions.comment ?? getConfig().baseActions.comment;
  const versionData = version ? versions[version] : versions[currentVersion];
  const action = baseAction + versionData.suffixAction;
  return config.isTest || getConfig().isTest ? `test_${action}` : action;
}

function composeCommentData(
  comment,
  replyingTo,
  articleId,
  isDelete,
  version,
  config
) {
  // if (replyingTo) {
  //   //We add the following so the user been replied get's a notification
  //   comment.text = `@${replyingTo} ${comment.text}`;
  // }

  let data = {
    index: {
      [getAction(version, config)]: JSON.stringify({
        key: articleId,
        value: {
          type: "md",
          ...comment,
        },
      }),
    },
  };

  // TODO handle notifications properly
  // const mentions = isDelete ? [] : extractMentions(comment.text);

  // if (mentions.length > 0) {
  //   const dataToAdd = getNotificationData(
  //     "mentionOnComment",
  //     mentions,
  //     `https://near.social/${
  //       widgets.thisForum
  //     }?sharedArticleId=${articleId}&sharedCommentId=${comment.commentId}${
  //       isTest ? "&isTest=t" : ""
  //     }`
  //   );

  //   data.post = dataToAdd.post;
  //   data.index.notify = dataToAdd.index.notify;
  // }

  return data;
}

function executeSaveComment(
  comment,
  replyingTo,
  articleId,
  isDelete,
  version,
  config
) {
  if (comment.text) {
    //version and config are optative for testing
    const newData = composeCommentData(
      comment,
      replyingTo,
      articleId,
      isDelete,
      version,
      config
    );
    Social.set(newData, {
      force: true,
      onCommit,
      onCancel,
    });

    return comment.commentData.commentId;
  }
}

function createComment(props) {
  const {
    config,
    userMetadataHelper,
    commentData,
    replyingTo,
    articleId,
    onClick,
    onCommit,
    onCancel,
  } = props;
  // interface commentData {
  //   isDelete: boolean,
  //   commentText: string,
  // }

  setConfig(config);

  const metadataHelper = {
    ...userMetadataHelper,
    idPrefix: "c",
    versionKey: currentVersion,
  };

  let metadata = generateMetadata(metadataHelper);
  metadata.articleId = articleId;
  metadata.replyingTo = replyingTo;

  const comment = {
    commentData,
    metadata,
  };

  const result = executeSaveComment(comment, onClick, onCommit, onCancel);

  return { error: false, data: result };
}

return {
  getComments,
  functionsToTest: {
    normalizeOldToV_0_0_1,
    normalizeFromV0_0_1ToV0_0_2,
    normalizeFromV0_0_2ToV0_0_3,
    normalizeFromV0_0_3ToV0_0_4,
    setConfig,
    getConfig,
    fillAction,
    getCommentBlackListByBlockHeight,
    filterInvalidComments,
    getUserNameFromCommentId,
    processComments,
    getComments,
    getSplittedCommentId,
    composeCommentData,
  },
};
