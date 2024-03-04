function getConfig(isTest) {
    return {
        isTest,
        baseActions: {
            article: "communityVoiceArticle",
            upVote: "communityVoiceUpVote",
            emoji: "communityVoiceReaction",
            comment: "communityVoiceComment",
        }
    }
}

return { getConfig }