function getConfig(isTest,networkId) {
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
        forumURL: `${authorForWidget}/widget/${configWidget}`
    }
}

return { getConfig }