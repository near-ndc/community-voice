const { getFromIndex } = VM.require("communityvoice.ndctools.near/widget/lib.socialDbIndex");
const { normalize, normalizeId } = VM.require(
  "communityvoice.ndctools.near/widget/lib.normalization"
);
const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
  "communityvoice.ndctools.near/widget/lib.metadata"
);

const { extractMentions, getNotificationData } = VM.require(
  "communityvoice.ndctools.near/widget/lib.notifications"
);

let config = {};

const currentVersion = "v0.0.4";

function getSplittedCommentIdV0_0_3(commentId) {
  const commentIdWithoutPrefix = commentId.slice(2);
  const prefix = "c-";

  const oldFormatID = prefix + commentIdWithoutPrefix;

  const newCommentID = normalizeId(oldFormatID, "comment");

  const splitCommentId = newCommentID.split("/");

  return splitCommentId;
  // }
}

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

function normalizeFromV0_0_3ToV0_0_4(comment) {
  const now = Date.now();

  // const splitCommentId = getSplittedCommentIdV0_0_3(comment.value.metadata.id);
  const splitCommentId = getSplittedCommentIdV0_0_3(
    comment.value.comment.commentId
  );
  
  comment.value.commentData = {text: comment.value.comment.text};
  const author = splitCommentId[1];
  comment.value.metadata = {
    id: splitCommentId.join("/"),
    author,
    createdTimestamp: now,
    lastEditTimestamp: now,
    rootId: comment.value.comment.rootId,
    versionKey: "v0.0.4",
  };

  delete comment.value.comment.commentId;
  delete comment.value.comment.rootId;
  delete comment.value.comment.timestamp;
  delete comment.value.comment.text;
  delete comment.value.comment;
  delete comment.isEdition;

  return comment;
}

function normalizeFromV0_0_4ToV0_0_5(comment) {
  return comment;
}

const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    suffixAction: "",
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
  "v0.0.4": {
    normalizationFunction: normalizeFromV0_0_4ToV0_0_5,
    suffixAction: `_v0.0.4`,
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
  return [98588599, 115199907, 115238101];
}

function filterInvalidComments(comments) {
  return comments
    .filter(
      (comment) =>
        comment.blockHeight &&
        !getCommentBlackListByBlockHeight().includes(comment.blockHeight) // Comment is not in blacklist
    )
    .filter((comment) => {
      return (
        comment.accountId ===
        getUserNameFromCommentId(
          comment.value.metadata.id ?? comment.value.comment.commentId
        )
      );
    });
}

function getUserNameFromCommentId(commentId) {
  let userName;
  if (commentId.startsWith("c/") || commentId.startsWith("comment/")) {
    const splittedCommentId = commentId.split("/");
    userName = splittedCommentId[1];
  } else if (commentId.startsWith("c_")) {
    const userNamePlusTimestamp = commentId.split("c_")[1];

    const splittedUserNamePlusTimestamp = userNamePlusTimestamp.split("-");

    splittedUserNamePlusTimestamp.pop();

    userName = splittedUserNamePlusTimestamp.join("-");
  }

  return userName;
}

function processComments(comments) {
  const lastEditionComments = comments.filter((comment) => {
    const firstCommentWithThisCommentId = comments.find((compComment) => {
      return compComment.value.metadata.id === comment.value.metadata.id;
    });

    return (
      JSON.stringify(firstCommentWithThisCommentId) === JSON.stringify(comment)
    );
  });

  const lastEditionCommentsWithoutDeletedOnes = lastEditionComments.filter(
    (comment) => !comment.value.metadata.isDelete
  );

  const lastEditionCommentsWithEditionMark =
    lastEditionCommentsWithoutDeletedOnes.map((comment) => {
      const commentsWithThisCommentId = comments.filter((compComment) => {
        return (
          comment.value.metadata.id === compComment.value.metadata.commentId
        );
      });

      if (commentsWithThisCommentId.length > 1) {
        comment.value.metadata.isEdition = true;
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

      return getFromIndex(action, articleId, "asc").then((comments) => {
        const validComments = filterInvalidComments(comments);

        const normalizedComments = validComments.map((comment) => {
          return normalize(comment, versions, index);
        });

        return normalizedComments;
      });
    }
  );

  return Promise.all(commentsByVersionPromise).then((commentsByVersion) => {
    return processComments(commentsByVersion.flat());
  });
}

function getAction(parameterVersion, parameterConfig) {
  //parameterVersion and parameterCconfig are optative for testing
  const baseAction =
    parameterConfig.baseActions.comment ?? getConfig().baseActions.comment;

  const versionData = parameterVersion
    ? versions[parameterVersion]
    : versions[currentVersion];

  const action = baseAction + versionData.suffixAction;

  return parameterConfig.isTest || getConfig().isTest
    ? `test_${action}`
    : action;
}

function composeCommentData(comment, version, config) {
  // if (comment.metadata.replyingTo) {
  //   //We add the following so the user been replied get's a notification
  //   comment.commentData.text = `@${comment.metadata.replyingTo} ${comment.commentData.text}`;
  // }

  let data = {
    index: {
      [getAction(version, config)]: JSON.stringify({
        key: comment.metadata.articleId,
        value: {
          type: "md",
          ...comment,
        },
      }),
    },
  };

  if(comment.metadata.isDelete) return data
  
  const mentions = comment.commentData.isDelete ? [] : extractMentions(comment.commentData.text);

  const articleIdSplitted = comment.metadata.articleId.split("/");
  const articleAuthor = articleIdSplitted[1];

  const dataToAdd = getNotificationData(
    getConfig(),
    mentions.length > 0 ? "mentionOnComment" : "comment",
    mentions,
    comment.metadata,
    {author: articleAuthor}
  );

  data.post = dataToAdd.post;
  data.index.notify = dataToAdd.index.notify;
  

  return data;
}

function executeSaveComment(
  comment,
  onCommit,
  onCancel,
  parameterVersion,
  parameterConfig
) {
  //parameterVersion and parameterConfig are optative for testing
  const newData = composeCommentData(
    comment,
    parameterVersion ?? currentVersion,
    parameterConfig ?? config
  );

  Social.set(newData, {
    force: true,
    onCommit,
    onCancel,
  });

  return comment.metadata.id;
}

function createComment(props) {
  const {
    config,
    author,
    commentText,
    replyingTo,
    articleId,
    onCommit,
    onCancel,
  } = props;

  setConfig(config);

  const metadataHelper = {
    author,
    idPrefix: "comment",
    versionKey: currentVersion,
  };

  let metadata = generateMetadata(metadataHelper);
  metadata.articleId = articleId;
  metadata.rootId = replyingTo;

  const comment = {
    commentData: { text: commentText },
    metadata,
  };

  const result = executeSaveComment(comment, onCommit, onCancel);

  return { error: !result, data: result };
}

function editComment(props) {
  const { config, comment, onCommit, onCancel } = props;

  setConfig(config);

  //TODO ask Dani abaut the second parameter in this case
  // let metadata = updateMetadata(comment.metadata, currentVersion);
  let metadata = updateMetadata(comment.value.metadata, currentVersion);
  metadata.isEdition = true;

  //===========================================================================================================================================================================
  // interface comment {
  //   commentData: {text: string},
  //   metadata
  // }
  //===========================================================================================================================================================================

  const newComment = {
    commentData: { text: comment.value.commentData.text },
    metadata,
  };

  const result = executeSaveComment(newComment, onCommit, onCancel);

  return { error: !result, data: result };
}

function deleteComment(props) {
  const { config, commentId, articleId, rootId, onCommit, onCancel } = props;

  setConfig(config);

  let metadata = buildDeleteMetadata(commentId);
  metadata.articleId = articleId;
  metadata.rootId = rootId;

  const comment = {
    metadata,
  };

  const result = executeSaveComment(comment, onCommit, onCancel);

  return { error: !result, data: result };
}

return {
  getComments,
  createComment,
  editComment,
  deleteComment,
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
    getSplittedCommentIdV0_0_3,
    composeCommentData,
    createComment,
    editComment,
    deleteComment,
  },
};
