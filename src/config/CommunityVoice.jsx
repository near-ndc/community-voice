function getConfig(isTest,networkId, lookForArchives) {
    const componentsOwner = "communityvoice.ndctools.near";
    const authorForWidget = "communityvoice.ndctools.near";
    const configWidget = "home";
    return {
        isTest,
        networkId,
        baseActions: {
            article: lookForArchives ? "archive/communityVoiceArticle" : "communityVoiceArticle",
            upVote: lookForArchives ? "archive/communityVoiceUpVote" : "communityVoiceUpVote",
            reaction: lookForArchives ? "archive/communityVoiceReaction" : "communityVoiceReaction",
            comment: lookForArchives ? "archive/communityVoiceComment" : "communityVoiceComment",
        },
        componentsOwner,
        authorForWidget,
        forumURL: `${authorForWidget}/widget/${configWidget}`
    }
}

return { getConfig }