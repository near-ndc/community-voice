function getConfig(isTest,networkId) {
    return {
        isTest,
        networkId,
        baseActions: {
            article: "communityVoiceArticle",
            upVote: "communityVoiceUpVote",
            reaction: "communityVoiceReaction",
            comment: "communityVoiceComment",
        }
    }
}

return { getConfig }