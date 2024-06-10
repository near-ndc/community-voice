// Community voice
const { getConfig } = VM.require(
    'chatter.cheddar.near/widget/config.CommunityVoice'
) || { getConfig: () => {} }
const { getCategories } = VM.require(
    'chatter.cheddar.near/widget/lib.categories'
) || { getCategories: () => {} }

let {
    isTest,
    accountId,
    sb: sharedBlockheight,
    st: sharedTag,
    said: sharedArticleId,
    scid: sharedCommentId,
    ss: sharedSearch,
} = props

State.init({ categories: getCategories(), category: getCategories().value })

const handleChangeCategory = (category) => {
    State.update({ category })
}

const sharedData = {
    sharedBlockheight: sharedBlockheight
        ? Number(sharedBlockheight)
        : undefined,
    sharedTag,
    sharedArticleId,
    sharedCommentId,
    sharedSearch,
}

const componentsOwner = 'chatter.cheddar.near'
const authorForWidget = 'chatter.cheddar.near'
const configWidget = 'home'

const widgets = {
    thisForum: `${authorForWidget}/widget/${configWidget}`,

    views: {
        editableWidgets: {
            ndcForum: `${componentsOwner}/widget/Cheddar.Forum`,
            create: `${componentsOwner}/widget/Cheddar.Forum.Create`,
            header: `${componentsOwner}/widget/Cheddar.NavBar`,
            showArticlesList: `${componentsOwner}/widget/Cheddar.Forum.AllArticlesList`,
            showArticlesListSortedByAuthors: `${componentsOwner}/widget/Cheddar.AllArticlesSortByAuthors`,
            articlesByAuthorCard: `${componentsOwner}/widget/Cheddar.ArticlesByAuthorCard`,
            generalCard: `${componentsOwner}/widget/Cheddar.GeneralCard`,
            articleView: `${componentsOwner}/widget/Cheddar.ArticleView`,
            reactions: `${componentsOwner}/widget/Cheddar.Reactions`,
            addComment: `${componentsOwner}/widget/Cheddar.AddComment`,
            commentView: `${componentsOwner}/widget/Cheddar.CommentView`,
            upVoteButton: `${componentsOwner}/widget/Cheddar.UpVoteButton`,
            profileShortInlineBlock: `${componentsOwner}/widget/Profile.ShortInlineBlock`,
            tagsEditor: `${componentsOwner}/widget/TagsEditor`,
            kanbanBoard: `${componentsOwner}/widget/Cheddar.KanbanBoard`,
            compactPost: `${componentsOwner}/widget/Cheddar.CompactPost`,
            articleHistory: `${componentsOwner}/widget/Cheddar.ArticleHistory.Handler`,
            articleHistoryFirstContainer: `${componentsOwner}/widget/Cheddar.ArticleHistory.Container`,
            articleHistorySecondContainer: `${componentsOwner}/widget/Cheddar.ArticleHistory.SecondContainer`,
        },
        standardWidgets: {
            fasterTextInput: `f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/fasterTextInput`,
            markownEditorIframe: `f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/MarkdownEditorIframe`,
            styledComponents: 'rubycop.near/widget/NDC.StyledComponents',
            newStyledComponents: {
                Element: {
                    Badge: 'nearui.near/widget/Element.Badge',
                    User: 'nearui.near/widget/Element.User',
                },
                Feedback: {
                    Spinner: 'nearui.near/widget/Feedback.Spinner',
                },
                Input: {
                    Button: 'nearui.near/widget/Input.Button',
                    Checkbox: 'nearui.near/widget/Input.Checkbox',
                    Select: 'nearui.near/widget/Input.Select',
                },
            },
            socialMarkdown: 'mob.near/widget/SocialMarkdown',
            profileOverlayTrigger: 'mob.near/widget/Profile.OverlayTrigger',
            profileImage: 'mob.near/widget/ProfileImage',
            wikiOnSocialDB_TooltipProfiles: `testwiki.near/widget/WikiOnSocialDB_TooltipProfiles`,
            navBarImg: 'mob.near/widget/Image',
        },
    },

    libs: {
        libSBT: `chatter.cheddar.near/widget/lib.SBT`,
        libComment: `chatter.cheddar.near/widget/lib.comment`,
        libArticle: `chatter.cheddar.near/widget/lib.article`,
        libReactions: `chatter.cheddar.near/widget/lib.reactions`,
        libUpVotes: `chatter.cheddar.near/widget/lib.upVotes`,
        libNotifications: `chatter.cheddar.near/widget/lib.notifications`,
    },
}

const brand = {
    brandName: 'Cheddar Chatter',
    logoHref:
        'https://ipfs.near.social/ipfs/bafkreiao5zwk4ww7jbj2du6io3xwdkcw2nzbpk4gtadpwbcdlfsqfnxfli',
    logoRemWidth: 12,
    logoRemHeight: 4,
}

const baseActions = {
    commentBaseAction: 'sayALotComment',
    articlesBaseAction: 'sayALotArticle',
    upVoteBaseAction: 'sayALotUpVote',
    reactionBaseAction: 'sayALotReaction',
}

const kanbanColumns = ['Open', 'Claimed', 'In Work', 'Closed']

const kanbanRequiredTags = []
const kanbanExcludedTags = []

return (
    <>
        <Widget
            src={widgets.views.editableWidgets.ndcForum}
            props={{
                isTest,
                accountId,
                authorForWidget,
                widgets,
                brand,
                baseActions,
                kanbanColumns,
                kanbanRequiredLabels,
                kanbanExcludedLabels,
                handleChangeCategory,
                categories: state.categories,
                category: state.category,
                sharedData,
            }}
        />
    </>
)
