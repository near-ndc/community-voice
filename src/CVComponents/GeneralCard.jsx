// CommunityVoice.GeneralCard
// Comes from NDC.GeneralCard
//===============================================INITIALIZATION=====================================================
const { widgets, isTest, data } = props;

if (!widgets) {
  widgets = {
    thisForum:
      "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/home",
    views: {
      editableWidgets: {
        ndcForum:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.Forum",
        create:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.Forum.Create",
        header:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.NavBar",
        showArticlesList:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.Forum.AllArticlesList",
        showArticlesListSortedByAuthors:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.AllArticlesSortByAuthors",
        articlesByAuthorCard:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.ArticlesByAuthorCard",
        generalCard:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/CommunityVoice.GeneralCard",
        articleBody:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/CommunityVoice.ArticleBody",
        articleView:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.ArticleView",
        reactions:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.Reactions",
        addComment:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/CommunityVoice.AddComment",
        commentView:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.CommentView",
        upVoteButton:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.UpVoteButton",
        profileShortInlineBlock:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/Profile.ShortInlineBlock",
        tagsEditor:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/TagsEditor",
        kanbanBoard:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.KanbanBoard",
        compactPost:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.CompactPost",
        articleHistory:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/NDC.ArticleHistory.Handler",
      },
      standardWidgets: {
        fasterTextInput:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/fasterTextInput",
        markownEditorIframe:
          "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/MarkdownEditorIframe",
        styledComponents: "rubycop.near/widget/NDC.StyledComponents",
        newStyledComponents: {
          Element: {
            Badge:
              "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/Element.Badge",
            User: "nearui.near/widget/Element.User",
          },
          Feedback: {
            Spinner: "nearui.near/widget/Feedback.Spinner",
          },
          Input: {
            Button:
              "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/Input.Button",
            Checkbox: "nearui.near/widget/Input.Checkbox",
            Select: "nearui.near/widget/Input.Select",
          },
        },
        socialMarkdown: "mob.near/widget/SocialMarkdown",
        profileOverlayTrigger: "mob.near/widget/Profile.OverlayTrigger",
        profileImage: "mob.near/widget/ProfileImage",
        wikiOnSocialDB_TooltipProfiles:
          "testwiki.near/widget/WikiOnSocialDB_TooltipProfiles",
        navBarImg: "mob.near/widget/Image",
      },
    },
    libs: {
      libSBT:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.SBT",
      libComment:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.comment",
      libArticle:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.article",
      libEmojis:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.emojis",
      libUpVotes:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.upVotes",
      libNotifications:
        "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/lib.notifications",
    },
  };
}

const { RenderButton } = VM.require(
  widgets.views.standardWidgets.newStyledComponents.Input.button
);
const { RenderBadge, RenderMultipleBadge } = VM.require(
  widgets.views.standardWidgets.newStyledComponents.Element.Badge
);
const { RenderBodyNew, RenderBodyOld } = VM.require(
  widgets.views.editableWidgets.articleBody
);

if (!data) {
  data = {
    title: "aa",
    author: "ayelen.near",
    lastEditor: "ayelen.near",
    timeLastEdit: 1707411253704,
    timeCreate: 1699406465524,
    body: "asd\n@ayelen.near",
    version: 2,
    navigation_id: null,
    tags: ["7-11-2023", "test"],
    id: "ayelen.near-1699406465524",
    sbts: ["fractal.i-am-human.near - class 1"],
    blockHeight: 112398490,
    upVotes: [
      {
        accountId: "ayelen.near",
        blockHeight: 106745180,
        value: {
          upVoteId: "uv-ayelen.near-1701189001307",
          sbts: ["fractal.i-am-human.near - class 1"],
        },
      },
      {
        accountId: "silkking.near",
        blockHeight: 105302475,
        value: {
          upVoteId: "uv-silkking.near-1699543277363",
          sbts: ["fractal.i-am-human.near - class 1"],
        },
      },
    ],
  };
}

data.tags = data.tags.filter((tag) => tag !== undefined && tag !== null);

const tags = data.tags;
const accountId = data.author;
const title = data.title;
const content = data.body;
const id = data.id ?? `${data.author}-${data.timeCreate}`;
const upVotes = data.upVotes;

//For the moment we'll allways have only 1 sbt in the array. If this change remember to do the propper work in lib.SBT and here.
const articleSbts = articleToRenderData.sbts ?? data.sbts ?? [];

function stateUpdate(obj) {
  State.update(obj);
}

State.init({
  sliceContent: true,
});
//=============================================END INITIALIZATION===================================================

//===================================================CONSTS=========================================================
const canLoggedUserCreateComment = true;

//=================================================END CONSTS=======================================================

//==================================================FUNCTIONS=======================================================
function getPublicationDate(creationTimestamp) {
  if (creationTimestamp == 0) {
    return "Creation timestamp passed wrong";
  }
  return new Date(creationTimestamp).toDateString();
}

//================================================END FUNCTIONS=====================================================

//==============================================STYLED COMPONENTS===================================================

const CardContainer = styled.div`
  box-shadow: rgba(140, 149, 159, 0.1) 0px 4px 28px 0px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  gap: 16px;
  background: rgba(140, 149, 159, 0.1) 0px 4px 28px 0px;
  border-radius: 10px;
`;
const HeaderCard = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0px;
  gap: 12px;
  width: 100%;
  flex-wrap: wrap;
`;

const profilePictureStyles = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
};
const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 4px;
  width: 70%;
`;
const HeaderRightSideContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;
const HeaderContentText = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  cursor: pointer;
`;
const NominationName = styled.p`
  font-weight: 500;
  font-size: 14px;
  margin: 0;
  align-items: center;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const NominationUser = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  margin: 0px;
  line-height: 120%;
  display: flex;
  align-items: center;
  color: #828688;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const KeyIssues = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 12px;
  gap: 12px;
  background: #ffffff;
  border: 1px solid rgb(248, 248, 249);
  border-radius: 6px;
  width: 100%;
`;
const KeyIssuesContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;
  width: 100%;
`;
const KeyIssuesHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 0px;
  gap: 12px;
`;
const KeyIssuesTitle = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 120%;
  margin-bottom: 0;
`;
const KeyIssuesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 8px;
  overflow-y: scroll;
  max-height: 250px;
  width: 100%;
  border: 1px solid rgb(248, 248, 249);
  border-radius: var(--bs-border-radius-lg) !important;
`;

const LowerSection = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 8px;
`;
const LowerSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 12px;
  align-self: stretch;
`;
const ButtonsLowerSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: inherit;
  padding: 0px;
  width: 100%;
`;
const TimeContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
  cursor: pointer;

  flex-grow: 1;
`;
const TimestampText = styled.div`
  font-style: italic;
  font-weight: 300;
  font-size: 11px;
  line-height: 14px;
  margin: 0px;
  gap: 2px;
  color: #000000;

  b {
    font-weight: 600;
  }
`;
const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0px;
  gap: 4px;
  width: 87px;
  height: 28px;
`;
const TagSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex-wrap: wrap;
  overflow: hidden;
  cursor: pointer;
`;

const Element = styled.div`
  width: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;

  &:hover {
    border-radius: 6px;
    background: #f8f8f9;
  }
`;
//============================================END STYLED COMPONENTS=================================================

//=================================================MORE STYLES======================================================

//===============================================END MORE STYLES====================================================

//=================================================COMPONENTS=======================================================

const inner = (
  <div className="d-flex flex-row mx-1 mw-50">
    <Widget
      src={widgets.views.standardWidgets.newStyledComponents.Element.User}
      props={{
        accountId,
        options: {
          showHumanBadge: true,
          showImage: true,
          showSocialName: true,
          shortenLength: 20,
        },
      }}
    />
  </div>
);

const renderTags = () => {
  return (
    <>
      {tags &&
        tags.map((tag) => {
          return (
            <div>
              {tag &&
                RenderBadge({
                  children: tag,
                  variant: "disabled",
                  size: "md",
                })}
            </div>
          );
        })}
    </>
  );
};

const renderBottomButtonsSection = () => {
  const number = 0;
  const joinedButtons = {
    thumbs: [
      {
        children: <>{`${number}`}</>,
        icon: { ubication: "before", name: "bi-hand-thumbs-up" },
        onClick: () => {
          //console.log("Button thumbs up clicked");
        },
      },
      {
        children: <>{`${number}`}</>,
        icon: { ubication: "after", name: "bi-hand-thumbs-down" },
        onClick: () => {
          //console.log("Button thumbs down clicked");
        },
      },
    ],
  };

  const simpleButtons = {
    comments: {
      children: <>{`${number} Comments`}</>,
      icon: { ubication: "before", name: "bi-chat-left" },
      onClick: () => {
        //console.log("Button comment clicked");
      },
    },
    reactions: {
      children: <>{`${number} Reactions`}</>,
      icon: { ubication: "before", name: "bi-emoji-smile" },
      onClick: () => {
        //console.log("Button reactions clicked");
      },
    },
    save: {
      children: <>Save</>,
      icon: { ubication: "before", name: "bi-bookmark" },
      onClick: () => {
        //console.log("Button save clicked");
      },
    },
  };

  return (
    <>
      {Object.keys(joinedButtons).map((button) =>
        RenderMultipleBadge({
          variant: "info soft openSans cursorPointer",
          size: "lg",
          buttonsData: joinedButtons[button],
        })
      )}
      {Object.keys(simpleButtons).map((button) =>
        RenderBadge({
          variant: "info soft openSans cursorPointer",
          size: "lg",
          children: simpleButtons[button].children,
          onClickFunction: simpleButtons[button].onClick,
          icon: simpleButtons[button].icon,
        })
      )}
    </>
  );
};

//===============================================END COMPONENTS====================================================

//===================================================RENDER========================================================

return (
  <CardContainer className="bg-white rounded-3 p-3 m-3 col-12">
    <Card>
      <HeaderCard className="d-flex justify-content-between pb-1">
        <div className="d-flex align-items-center gap-2">
          <Widget
            src={widgets.views.standardWidgets.profileOverlayTrigger}
            props={{ accountId, children: inner }}
          />
        </div>
        <HeaderRightSideContainer>
          <TimeContainer className="align-items-center">
            <TimestampText>
              <span>{getPublicationDate(data.timeCreate)}</span>
            </TimestampText>
          </TimeContainer>
          {RenderButton({
            size: "sm",
            className: "info soft icon",
            children: <i className="bi bi-flag"></i>,
            onClick: () => {
              //console.log("click flag button");
            },
          })}
          {RenderButton({
            size: "sm",
            className: "info soft icon",
            children: <i className="bi bi-share"></i>,
            onClick: () => {
              //console.log("click share button");
            },
          })}
        </HeaderRightSideContainer>
      </HeaderCard>
      <KeyIssuesHeader>
        <KeyIssuesTitle
          role="button"
          onClick={() => {
            // handleOpenArticle(data);
          }}
        >
          {title}
        </KeyIssuesTitle>
      </KeyIssuesHeader>
      <KeyIssuesContent>
        <KeyIssuesContainer>
          {RenderBodyOld({
            widgets,
            authorForWidget,
            content,
            sliceContent: state.sliceContent,
          })}
        </KeyIssuesContainer>
      </KeyIssuesContent>
      <LowerSection>
        <LowerSectionContainer>
          {tags.length > 0 && (
            <KeyIssues>
              <KeyIssuesContent>
                <KeyIssuesHeader>
                  <KeyIssuesTitle>Tags</KeyIssuesTitle>
                </KeyIssuesHeader>
                <div className="d-flex w-100">
                  <TagSection>{renderTags()}</TagSection>
                </div>
              </KeyIssuesContent>
            </KeyIssues>
          )}
          <ButtonsLowerSection>
            {renderBottomButtonsSection()}
          </ButtonsLowerSection>
        </LowerSectionContainer>
      </LowerSection>
    </Card>
  </CardContainer>
);
