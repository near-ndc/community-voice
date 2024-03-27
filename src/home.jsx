// SayALot
const { getSBTWhiteList } = VM.require("cv.near/widget/lib.SBT");
const { getConfig } = VM.require("cv.near/widget/config.CommunityVoice");

let {
  isTest,
  accountId,
  SBH,
  STG,
  SAID,
  SCID,
  SSRCH,
  STPC,
} = props;

const sharedData = {
  SBH: SBH ? Number(SBH) : undefined,
  STG,
  SAID,
  SCID,
  SSRCH,
  STPC,
} 

function createSbtOptions() {
  return getSBTWhiteList(getConfig(isTest));
}

const sbtWhiteList = getSBTWhiteList(getConfig(isTest)).map((sbt) => sbt.value)
const componentsOwner = "cv.near";
const authorForWidget = "cv.near";
const configWidget = "home";

const widgets = {
  thisForum: `${authorForWidget}/widget/${configWidget}`,

  views: {
    editableWidgets: {
      ndcForum: `${componentsOwner}/widget/NDC.Forum`,
      create: `${componentsOwner}/widget/NDC.Forum.Create`,
      header: `${componentsOwner}/widget/NDC.NavBar`,
      showArticlesList: `${componentsOwner}/widget/NDC.Forum.AllArticlesList`,
      showArticlesListSortedByAuthors: `${componentsOwner}/widget/NDC.AllArticlesSortByAuthors`,
      articlesByAuthorCard: `${componentsOwner}/widget/NDC.ArticlesByAuthorCard`,
      generalCard: `${componentsOwner}/widget/NDC.GeneralCard`,
      articleView: `${componentsOwner}/widget/NDC.ArticleView`,
      reactions: `${componentsOwner}/widget/NDC.Reactions`,
      addComment: `${componentsOwner}/widget/NDC.AddComment`,
      commentView: `${componentsOwner}/widget/NDC.CommentView`,
      upVoteButton: `${componentsOwner}/widget/NDC.UpVoteButton`,
      profileShortInlineBlock: `${componentsOwner}/widget/Profile.ShortInlineBlock`,
      tagsEditor: `${componentsOwner}/widget/TagsEditor`,
      kanbanBoard: `${componentsOwner}/widget/NDC.KanbanBoard`,
      compactPost: `${componentsOwner}/widget/NDC.CompactPost`,
      articleHistory: `${componentsOwner}/widget/NDC.ArticleHistory.Handler`,
    },
    standardWidgets: {
      fasterTextInput: `f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/fasterTextInput`,
      markownEditorIframe: `f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/MarkdownEditorIframe`,
      styledComponents: "rubycop.near/widget/NDC.StyledComponents",
      newStyledComponents: {
        Element: {
          Badge: "nearui.near/widget/Element.Badge",
          User: "nearui.near/widget/Element.User",
        },
        Feedback: {
          Spinner: "nearui.near/widget/Feedback.Spinner",
        },
        Input: {
          Button: "nearui.near/widget/Input.Button",
          Checkbox: "nearui.near/widget/Input.Checkbox",
          Select: "nearui.near/widget/Input.Select",
        },
      },
      socialMarkdown: "mob.near/widget/SocialMarkdown",
      profileOverlayTrigger: "mob.near/widget/Profile.OverlayTrigger",
      profileImage: "mob.near/widget/ProfileImage",
      wikiOnSocialDB_TooltipProfiles: `testwiki.near/widget/WikiOnSocialDB_TooltipProfiles`,
      navBarImg: "mob.near/widget/Image",
    },
  },

  libs: {
    libSBT: `cv.near/widget/lib.SBT`,
    libComment: `cv.near/widget/lib.comment`,
    libArticle: `cv.near/widget/lib.article`,
    libReactions: `cv.near/widget/lib.reactions`,
    libUpVotes: `cv.near/widget/lib.upVotes`,
    libNotifications: `cv.near/widget/lib.notifications`,
  },
};

const brand = {
  brandName: "Community Voice",
  logoHref:
    "https://ipfs.near.social/ipfs/bafkreifhkslni6dlocxya35vjft3fefk2am5uzkagmjjzobdjqlhrnbjz4",
  logoRemWidth: 12,
  logoRemHeight: 4,
};

const baseActions = {
  commentBaseAction: "sayALotComment",
  articlesBaseAction: "sayALotArticle",
  upVoteBaseAction: "sayALotUpVote",
  reactionBaseAction: "sayALotReaction",
};

const kanbanColumns = ["Open", "Claimed", "In Work", "Closed"];

const kanbanRequiredTags = [];
const kanbanExcludedTags = [];

return (
  <>
    {sbtWhiteList ? (
      <Widget
        src={widgets.views.editableWidgets.ndcForum}
        props={{
          isTest,
          accountId,
          sbtWhiteList,
          authorForWidget,
          widgets,
          brand,
          baseActions,
          createSbtOptions,
          kanbanColumns,
          kanbanRequiredLabels,
          kanbanExcludedLabels,
          sharedData
        }}
      />
    ) : (
      <Widget
        src={widgets.views.standardWidgets.newStyledComponents.Feedback.Spinner}
      />
    )}
  </>
);
