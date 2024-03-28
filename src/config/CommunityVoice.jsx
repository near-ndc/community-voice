function getConfig(isTest,networkId) {
    const componentsOwner = "cv.near";
    const authorForWidget = "cv.near";
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
        forumURL: `${authorForWidget}/widget/${configWidget}`
    }
}

return { getConfig }