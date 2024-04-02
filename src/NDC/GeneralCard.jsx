// NDC.GeneralCard
const { getUpVotes } = VM.require("communityvoice.ndctools.near/widget/lib.upVotes")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice");

//===============================================INITIALIZATION=====================================================

const {
  widgets,
  isTest,
  data,
  handleOpenArticle,
  handleFilterArticles,
  addressForArticles,
  authorForWidget,
  handleShareButton,
  handleEditArticle,
  baseActions,
  switchShowPreview,
  isPreview,
  loggedUserHaveSbt
} = props;

if (!Array.isArray(data.value.articleData.tags) && typeof data.value.articleData.tags === "object") {
  data.value.articleData.tags = Object.keys(data.value.articleData.tags);
}

data.value.articleData.tags = data.value.articleData.tags.filter((tag) => tag !== undefined && tag !== null);

const tags = data.value.articleData.tags;
const accountId = data.value.metadata.author;
const title = data.value.articleData.title;
const content = data.value.articleData.body;
const timeLastEdit = data.value.metadata.lastEditTimestamp;
const id = data.value.metadata.id ?? `${data.author}-${data.metadata.createdTiemestamp}`;
const [upVotes, setUpVotes] = useState(undefined)
const [loadingUpVotes, setLoadingUpVotes] = useState(true)

function loadUpVotes() {
  getUpVotes(getConfig(isTest),id).then((newVotes) => {
    setUpVotes(newVotes)
    setLoadingUpVotes(false)
  })
}

useEffect(() => {
    loadUpVotes()
    setInterval(() => {
        loadUpVotes()
    }, 30000)
}, [])


function stateUpdate(obj) {
  State.update(obj);
}

State.init({
  verified: true,
  start: true,
  voted: false,
  sliceContent: true,
});
//=============================================END INITIALIZATION===================================================

//===================================================CONSTS=========================================================

//=================================================END CONSTS=======================================================

//==================================================FUNCTIONS=======================================================
function getPublicationDate(creationTimestamp) {
  if (creationTimestamp == 0) {
    return "Creation timestamp passed wrong";
  }
  return new Date(creationTimestamp).toDateString();
}

function getUserName() {
  const profile = data.authorProfile;

  return profile.name ?? getShortUserName();
}

const getShortUserName = () => {
  const userId = accountId;

  if (userId.length === 64) return `${userId.slice(0, 4)}..${userId.slice(-4)}`;
  const name = userId.slice(0, -5); // truncate .near

  return name.length > 20 ? `${name.slice(0, 20)}...` : name;
};

function toggleShowModal() {
  State.update({ showModal: !state.showModal });
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
    align-items: center;
    padding: 0px;
    gap: 12px;
    width: 100%;
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
const HeaderButtonsContainer = styled.div`
    display: flex;
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

const ArticleBodyContainer = styled.div`
    margin: 0 0.5rem 0.5rem 0.5rem;
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
    padding: 0px;
    width: 100%;
  `;
const TextLowerSectionContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 4px;
    width: 239px;
    height: 24px;
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

const CallLibrary = styled.div`
    display: none;
  `;
//============================================END STYLED COMPONENTS=================================================

//=================================================MORE STYLES======================================================

const profileImageStyles = {
  width: profilePictureStyles.width,
  height: profilePictureStyles.height,
  borderRadius: profilePictureStyles.borderRadius,
  overflow: "hidden",
};

//===============================================END MORE STYLES====================================================

//=================================================COMPONENTS=======================================================

const inner = (
  <div className="d-flex flex-row mx-1">
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
          const filter = { filterBy: "tag", value: tag };

          return (
            <div onClick={() => handleFilterArticles(filter)}>
              {tag && (
                <Widget
                  src={
                    widgets.views.standardWidgets.newStyledComponents.Element
                      .Badge
                  }
                  props={{
                    children: tag,
                    variant: "round info outline",
                    size: "lg",
                  }}
                />
              )}
            </div>
          );
        })}
    </>
  );
};

const renderArticleBody = () => {
  let displayedContent = state.sliceContent ? content.slice(0, 1000) : content;
  return (
    <ArticleBodyContainer>
      <Widget
        src={widgets.views.standardWidgets.socialMarkdown}
        props={{
          text: displayedContent,
          onHashtag: (hashtag) => (
            <span
              key={hashtag}
              className="d-inline-flex"
              style={{ fontWeight: 500 }}
            >
              <a
                href={`https://near.org/${authorForWidget}/widget/${widgets.thisForum}?st=${hashtag}`}
                target="_blank"
              >
                #{hashtag}
              </a>
            </span>
          ),
        }}
      />
      {state.sliceContent && content.length > 1000 && (
        <Widget
          src={widgets.views.standardWidgets.styledComponents}
          props={{
            Button: {
              text: `Show more`,
              size: "sm",
              className: "w-100 justify-content-center",
              onClick: () => {
                State.update({ sliceContent: false });
              },
              icon: <i className="bi bi-chat-square-text-fill"></i>,
            },
          }}
        />
      )}
    </ArticleBodyContainer>
  );
};

//===============================================END COMPONENTS====================================================

//===================================================RENDER========================================================

return (
  <CardContainer
    className={`bg-white rounded-3 p-3 m-3 ${
      isPreview ? "" : "col-lg-8 col-md-8 col-sm-12"
    }`}
  >
    <Card>
      {state.showModal && (
        <Widget
          src={widgets.views.editableWidgets.addComment}
          props={{
            widgets,
            article: data,
            isReplying: false,
            isTest,
            username: data.author,
            id,
            onCloseModal: toggleShowModal,
            baseActions,
          }}
        />
      )}
      <HeaderCard className="d-flex justify-content-between pb-1 border-bottom border-dark">
        <div className="d-flex align-items-center gap-2">
          <Widget
            src={widgets.views.standardWidgets.profileOverlayTrigger}
            props={{ accountId, children: inner }}
          />
          {
            //   <HeaderContent>
            //   <HeaderContentText
            //     onClick={() => {
            //       handleOpenArticle(data);
            //     }}
            //   >
            //     <NominationName>{getUserName()}</NominationName>
            //     <NominationUser>{getShortUserName()}</NominationUser>
            //   </HeaderContentText>
            // </HeaderContent>
          }
        </div>
        <HeaderButtonsContainer>
          <Widget
            src={widgets.views.editableWidgets.upVoteButton}
            props={{
              isTest,
              authorForWidget,
                reactedElementData: data,
                widgets,
                disabled: isPreview || !loggedUserHaveSbt,
                articleSbts,
                upVotes,
                baseActions,
                loadUpVotes,
                loadingUpVotes,
                setLoadingUpVotes,
                setUpVotes,
              }}
          />
          <Widget
            src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
            props={{
              size: "sm",
              className: "info outline icon",
              children: <i className="bi bi-share"></i>,
              onClick: () =>
                handleShareButton(true, {
                  key: "said",
                  type: "sharedArticleId",
                  value: data.value.metadata.id,
                }),
            }}
          />
        </HeaderButtonsContainer>
      </HeaderCard>
      <KeyIssuesHeader>
        <KeyIssuesTitle
          role="button"
          onClick={() => {
            handleOpenArticle(data);
          }}
        >
          {title}
        </KeyIssuesTitle>
      </KeyIssuesHeader>
      <KeyIssuesContent>
        <KeyIssuesContainer>{renderArticleBody()}</KeyIssuesContainer>
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
            <TextLowerSectionContainer
              className="align-items-center"
              onClick={() => {
                handleOpenArticle(data);
              }}
            >
              <i className="bi bi-clock"></i>
              <TimestampText>
                <span>{getPublicationDate(timeLastEdit)}</span>
                <span>by</span>
                <b>{author}</b>
              </TimestampText>
            </TextLowerSectionContainer>
            <Widget
              src={widgets.views.editableWidgets.reactions}
              props={{
                widgets,
                isTest,
                authorForWidget,
                elementReactedId: id,
                disabled: isPreview || !loggedUserHaveSbt,
                baseActions,
              }}
            />
          </ButtonsLowerSection>
          <div className="d-flex w-100 align-items-center">
            <div className="d-flex w-100 gap-2 justify-content-start">
              <Widget
                src={
                  widgets.views.standardWidgets.newStyledComponents.Input.Button
                }
                props={{
                  children: (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="mx-1 d-none d-lg-block">
                        Add comment
                      </span>
                      <i className="bi bi-chat-square-text-fill"></i>
                    </div>
                  ),
                  disabled: !loggedUserHaveSbt,
                  size: "sm",
                  className: "info outline w-25",
                  onClick: isPreview
                    ? () => {}
                    : toggleShowModal,
                }}
              />
              <Widget
                src={
                  widgets.views.standardWidgets.newStyledComponents.Input.Button
                }
                props={{
                  children: (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="mx-1 d-none d-lg-block">View</span>
                      <i className="bi bi-eye fs-6"></i>
                    </div>
                  ),
                  size: "sm",
                  className: "info w-25",
                  onClick: () => handleOpenArticle(data),
                }}
              />
              {context.accountId === data.author && (
                <Widget
                  src={
                    widgets.views.standardWidgets.newStyledComponents.Input
                      .Button
                  }
                  props={{
                    children: (
                      <div className="d-flex align-items-center justify-content-center">
                        <span className="mx-1 d-none d-lg-block">Edit</span>
                        <i className="bi bi-pencil"></i>
                      </div>
                    ),
                    className: `info w-25`,
                    onClick: () =>
                      isPreview
                        ? switchShowPreview()
                        : handleEditArticle(data),
                  }}
                />
              )}
            </div>
          </div>
        </LowerSectionContainer>
      </LowerSection>
    </Card>
  </CardContainer>
);
