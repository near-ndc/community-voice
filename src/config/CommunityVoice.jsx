function getConfig(isTest, networkId) {
    const componentsOwner = 'chatter.cheddar.near'
    const authorForWidget = 'chatter.cheddar.near'
    const configWidget = 'home'

    return {
        isTest,
        networkId,
        baseActions: {
            article: 'cheddarChatterArticle',
            upVote: 'cheddarChatterUpVote',
            reaction: 'cheddarChatterReaction',
            comment: 'cheddarChatterComment',
        },
        componentsOwner,
        authorForWidget,
        forumURL: `${authorForWidget}/widget/${configWidget}`,
    }
}

return { getConfig }
