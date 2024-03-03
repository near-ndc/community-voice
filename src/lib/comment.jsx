const { getFromIndex } = VM.require("sayalot.near/widget/lib.socialDbIndex")
const { normalize } = VM.require("sayalot.near/widget/lib.normalization")

let config = {}

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
    config = newConfig
}

function getConfig() {
    return config
}


function fillAction(version, isTest) {
    const baseAction = getConfig().baseActions.comment
    const filledAction = baseAction + version.suffixAction
    return isTest ? `test_${filledAction}` : filledAction
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

    return lastEditionCommentsWithEditionMark
}

function getComments(articleId, config) {
    setConfig(config)
    const commentsByVersionPromise = Object.keys(versions).map((version, index, arr) => {
        const action = fillAction(versions[version])

        return getFromIndex(action, articleId).then((comments) => {
            const validComments = filterInvalidComments(comments);

            return validComments.map((comment) => {
                return normalize(comment, versions, index)
            });
        })
    });

    return Promise.all(commentsByVersionPromise).then((commentsByVersion) => {
        return processComments(commentsByVersion.flat())
    })
}

return { getComments }