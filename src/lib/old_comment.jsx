// lib.comment
const {
  mainStateUpdate,
  isTest,
  stateUpdate,
  functionsToCallByLibrary,
  callLibs,
  baseAction,
  widgets,
  usersSBTs,
} = props;

const libName = "comment"; // EDIT: set lib name
const functionsToCall = functionsToCallByLibrary[libName];

let resultFunctionsToCallByLibrary = Object.assign(
  {},
  functionsToCallByLibrary
);
let resultFunctionsToCall = [];

const currentVersion = "0.0.3"; // EDIT: Set version

const prodAction = `${baseAction}_v${currentVersion}`; // TODO consider versions
// const prodAction = `${baseAction}`;
const testAction = `test_${prodAction}`;
const action = isTest ? testAction : prodAction;

// START LIB CALLS SECTION
// interface FunctionCall {
//     functionName: string,
//     key: string, // The state of the caller will be updated with this string as a key
//     props: Record<string, any> // function parameters as object
// }

// type LibsCalls = Record<string, FunctionCall> // Key is lib name after lib.

const libSrcArray = [widgets.libs.libSBT]; // string to lib widget // EDIT: set libs to call

const imports = { notifications: ["getNotificationData"] };

const libsCalls = {};
libSrcArray.forEach((libSrc) => {
  const libName = libSrc.split("lib.")[1];
  libsCalls[libName] = [];
});

State.init({
  libsCalls, // is a LibsCalls object
  notifications: {},
});
// END LIB CALLS SECTION

function log(message) {
  console.log(`lib.${libName}`, message);
}

function logError(message) {
  console.error(`lib.${libName}`, message);
}

function libStateUpdate(obj) {
  State.update(obj);
}

// START LIB FUNCTIONS: EDIT set functions you need

function canUserCreateComment(props) {
  const { accountId, sbtsNames } = props;

  if (sbtsNames.includes("public")) return true;

  if (accountId) {
    setAreValidUsers([accountId], sbtsNames);
  } else {
    return false;
  }

  let allSBTsValidations = [];

  let result;

  let userCredentials =
    usersSBTs.find((data) => data.user === accountId).credentials ??
    state[`isValidUser-${accountId}`];

  if (userCredentials) {
    const allSBTs = Object.keys(userCredentials);

    allSBTs.forEach((sbt) => {
      sbt !== "public" && allSBTsValidations.push(userCredentials[sbt]);
    });

    result = allSBTsValidations.includes(true);
  }

  resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
    const discardCondition =
      call.functionName === "canUserCreateComment" && result !== undefined;
    return !discardCondition;
  });

  return result;
}

function setAreValidUsers(accountIds, sbtsNames) {
  const newLibCalls = Object.assign({}, state.libsCalls);

  if (newLibsCalls && !newLibsCalls.SBT) {
    logError("Key SBT is not set in lib.", libName);
  }

  accountIds.forEach((accountId) => {
    const isCallPushed =
      newLibCalls.SBT.find((libCall) => {
        return (
          libCall.functionName === "isValidUser" &&
          libCall.props.accountId === accountId
        );
      }) !== undefined;
    const isCallReturned = state[`isValidUser-${accountId}`] !== undefined;

    if (isCallPushed || isCallReturned) {
      return;
    }

    const existingUserSBTs = usersSBTs.find(
      (userSBTs) => userSBTs.user === accountId
    );

    if (!existingUserSBTs) {
      newLibCalls.SBT.push({
        functionName: "isValidUser",
        key: `isValidUser-${accountId}`,
        props: {
          accountId,
        },
      });
    }
  });
  State.update({ libCalls: newLibCalls });
}

function createComment(props) {
  const { comment, replyingTo, articleId, onClick, onCommit, onCancel } = props;

  if (comment.commentId) {
    console.error(
      "comment.commentId should not be provided when creating comment"
    );
    return;
  }

  const commentId = `c_${context.accountId}-${Date.now()}`;

  comment.commentId = commentId;

  onClick();

  saveComment(comment, replyingTo, articleId, onCommit, onCancel, false);

  resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
    return call.functionName !== "createComment";
  });

  return comment;
}

function deleteComment(props) {
  const { comment, articleId, onCommit, onCancel } = props;

  if (!comment.commentId) {
    console.error("comment.commentId should be provided when editing comment");
    return;
  }

  const replyingTo = undefined;

  comment.isDeleted = true;

  saveComment(comment, replyingTo, articleId, onCommit, onCancel, true);

  resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
    return call.functionName !== "deleteComment";
  });

  return comment;
}

function editComment(props) {
  const { comment, articleId, onClick, onCommit, onCancel } = props;

  if (!comment.commentId) {
    console.error("comment.commentId should be provided when editing comment");
    return;
  }

  const replyingTo = undefined;

  onClick();

  saveComment(comment, replyingTo, articleId, onCommit, onCancel, false);

  resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
    return call.functionName !== "editComment";
  });

  return comment;
}

function getNotificationData(type, accountId, url) {
  if (state.notifications.getNotificationData) {
    return state.notifications.getNotificationData(type, accountId, url);
  }
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

function composeCommentData(comment, replyingTo, articleId, isDelete) {
  if (replyingTo) {
    //We add the following so the user been replied get's a notification
    comment.text = `@${replyingTo} ${comment.text}`;
  }

  const data = {
    index: {
      [action]: JSON.stringify({
        key: articleId,
        value: {
          type: "md",
          comment,
        },
      }),
    },
  };

  const mentions = isDelete ? [] : extractMentions(comment.text);

  if (mentions.length > 0) {
    const dataToAdd = getNotificationData(
      "mentionOnComment",
      mentions,
      `https://near.social/${
        widgets.thisForum
      }?sharedArticleId=${articleId}&sharedCommentId=${comment.commentId}${
        isTest ? "&isTest=t" : ""
      }`
    );

    data.post = dataToAdd.post;
    data.index.notify = dataToAdd.index.notify;
  }

  return data;
}

function saveComment(
  comment,
  replyingTo,
  articleId,
  onCommit,
  onCancel,
  isDelete
) {
  if (comment.text) {
    const newData = composeCommentData(
      comment,
      replyingTo,
      articleId,
      isDelete
    );
    Social.set(newData, {
      force: true,
      onCommit,
      onCancel,
    });
  }
}

function getComments(action, id, subscribe) {
  return Social.index(action, id, {
    order: "desc",
    subscribe,
  });
}

function getCommentBlackListByBlockHeight() {
  return [98588599];
}

function getUserNameFromCommentId(commentId) {
  const userNamePlusTimestamp = commentId.split("c_")[1];

  const splittedUserNamePlusTimestamp = userNamePlusTimestamp.split("-");

  splittedUserNamePlusTimestamp.pop();

  const userName = splittedUserNamePlusTimestamp.join("-");

  return userName;
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

function getValidComments(props) {
  const { env, articleSbts, id } = props;
  // Call other libs
  const normComments = getCommentsNormalized(env, id);

  // Keep last edit from every article
  const lastEditionComments = normComments.filter((comment) => {
    const firstCommentWithThisCommentId = normComments.find((compComment) => {
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
      const commentsWithThisCommentId = normComments.filter((compComment) => {
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

  const commentsAuthors = lastEditionCommentsWithEditionMark.map((comment) => {
    return comment.accountId;
  });

  setAreValidUsers(commentsAuthors, articleSbts);

  resultFunctionsToCall = resultFunctionsToCall.filter((call) => {
    const discardCondition =
      call.functionName === "getValidComments" &&
      state[`isValidUser-${call.props.accountId}`] !== undefined;
    return !discardCondition;
  });

  const finalComments = filterValidComments(
    lastEditionCommentsWithEditionMark,
    articleSbts
  );

  return sortComments(finalComments);
}

function filterValidator(comments, articleSbts) {
  if (articleSbts.includes("public")) return comments;

  return comments.filter((comment) => {
    let allSBTsValidations = [];

    let result;

    let userCredentials =
      usersSBTs.find((data) => data.user === comment.accountId).credentials ??
      state[`isValidUser-${comment.accountId}`];

    if (userCredentials) {
      const allSBTs = Object.keys(userCredentials);

      allSBTs.forEach((sbt) => {
        sbt !== "public" && allSBTsValidations.push(userCredentials[sbt]);
      });

      result = allSBTsValidations.includes(true);
    }

    return result;
  });
}

function filterValidComments(comments, articleSbts) {
  let filteredComments = filterValidator(
    filteredComments ?? comments,
    articleSbts
  );

  return filteredComments;
}

function sortComments(comments) {
  comments.sort((c1, c2) => {
    return c1.value.comment.timestamp - c2.value.comment.timestamp;
  });

  return comments;
}

function getCommentsNormalized(env, id) {
  const commentsByVersion = Object.keys(versions).map((version, index, arr) => {
    const action = versions[version].action;
    const subscribe = index + 1 === arr.length;

    const comments = getComments(action, id, subscribe);
    if (!comments) return [];

    const validComments = filterInvalidComments(comments);

    return validComments;
  });

  return normalizeLibData(commentsByVersion);
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
  return comment;
}
// END LIB FUNCTIONS

// EDIT: set functions you want to export
function callFunction(call) {
  if (call.functionName === "createComment") {
    return createComment(call.props);
  } else if (call.functionName === "editComment") {
    return editComment(call.props);
  } else if (call.functionName === "deleteComment") {
    return deleteComment(call.props);
  } else if (call.functionName === "getValidComments") {
    return getValidComments(call.props);
  } else if (call.functionName === "canUserCreateComment") {
    return canUserCreateComment(call.props);
  }
}

// EDIT: set versions you want to handle, considering their action to Social.index and the way to transform to one version to another (normalization)
const versions = {
  old: {
    normalizationFunction: normalizeOldToV_0_0_1,
    action: props.isTest ? `test_${baseAction}` : baseAction,
  },
  "v1.0.1": {
    normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
    action: props.isTest ? `test_${baseAction}-v1.0.1` : `${baseAction}-v1.0.1`,
  },
  "v0.0.2": {
    normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
    action: props.isTest ? `test_${baseAction}_v0.0.2` : `${baseAction}_v0.0.2`,
  },
  "v0.0.3": {
    normalizationFunction: normalizeFromV0_0_3ToV0_0_4,
    action: props.isTest ? `test_${baseAction}_v0.0.3` : `${baseAction}_v0.0.3`,
  },
};

function normalizeLibData(libDataByVersion) {
  let libData;

  Object.keys(versions).forEach((version, index, array) => {
    const normFn = versions[version].normalizationFunction;
    const normLibData = libDataByVersion[index].map((libData, i) => {
      return normFn(libData);
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

if (functionsToCall && functionsToCall.length > 0) {
  const updateObj = Object.assign({}, functionsToCallByLibrary);
  resultFunctionsToCall = [...functionsToCall];
  functionsToCall.forEach((call) => {
    updateObj[call.key] = callFunction(call);
  });

  resultFunctionsToCallByLibrary[libName] = resultFunctionsToCall;
  updateObj.functionsToCallByLibrary = resultFunctionsToCallByLibrary;

  const oldUsersSBTs = usersSBTs;
  // {
  //   user: string,
  //   credentials: {},
  // }

  const newUsersSBTs = Object.keys(state).map((key) => {
    if (key.includes("isValidUser-")) {
      if (state[key] !== undefined) {
        const user = key.split("isValidUser-")[1];
        const credentials = state[key];

        const oldUsers = oldUsersSBTs.map((userSbts) => userSbts.user);

        if (!oldUsers.includes(user)) {
          return {
            user,
            credentials,
          };
        }
      }
    }
  });

  const finalUsersSBTs = [...oldUsersSBTs, ...newUsersSBTs].filter(
    (userSBTs) => userSBTs !== undefined
  );

  if (finalUsersSBTs[0]) {
    mainStateUpdate({ usersSBTs: finalUsersSBTs });
  }

  stateUpdate(updateObj);
}

// function callLibs(
//   src,
//   stateUpdate,
//   functionsToCallByLibrary,
//   extraProps,
//   callerWidget
// ) {
//   return (
//     <Widget
//       src={src}
//       props={{
//         isTest,
//         stateUpdate,
//         functionsToCallByLibrary,
//         callLibs,
//         widgets,
//         ...extraProps,
//       }}
//     />
//   );
// }

return (
  <>
    {libSrcArray.map((src) => {
      return callLibs(
        src,
        libStateUpdate,
        state.libsCalls,
        {},
        `lib.${libName}`
      );
    })}

    <Widget
      src={`${widgets.libs.libNotifications}`}
      props={{
        stateUpdate: libStateUpdate,
        imports: imports["notifications"],
        fatherNotificationsState: state.notifications,
      }}
    />
  </>
);
