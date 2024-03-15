function getConfig(isTest) {
    return {
        isTest,
        baseActions: {
            article: "communityVoiceArticle",
            upVote: "communityVoiceUpVote",
            reaction: "communityVoiceReaction",
            comment: "communityVoiceComment",
        }
    }
}

return { getConfig }