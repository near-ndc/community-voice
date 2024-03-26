// NDC.Forum
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice");
const { getArticles, deleteArticle } = VM.require("sayalot.near/widget/lib.article");
const { isValidUser, getUserSBTs } = VM.require("sayalot.near/widget/lib.SBT");
//===============================================INITIALIZATION=====================================================
let {
  sharedBlockHeight,
  tagShared,
  isTest,
  accountId,
  sbtWhiteList,
  authorForWidget,
  widgets,
  brand,
  baseActions,
  createSbtOptions,
  kanbanColumns,
  kanbanRequiredTags,
  kanbanExcludedTags,
  sharedArticleId,
  sharedCommentId,
  sharedSearchInputValue,
  topicShared,
} = props;

const splitedTopic = topicShared ? topicShared.split("-class") : undefined;

const topicSharedFirstPart = splitedTopic && splitedTopic[0];
const topicSharedSecondPart = splitedTopic && splitedTopic[1];

if (topicSharedFirstPart !== "public" && topicSharedFirstPart !== undefined) {
  topicShared = `${topicSharedFirstPart} - class ${topicSharedSecondPart}`;
}

sharedBlockHeight = Number(sharedBlockHeight);

const initSbtsNames = topicShared ? [topicShared] : [sbtWhiteList[0]];

const sbtsNames = state.sbt;

const [articlesToRender, setArticlesToRender] = useState([])
const [canLoggedUserCreateArticle, setCanLoggedUserCreateArticle] = useState(false)

function loadArticles() {
  const userFilters = {id: undefined, sbt: undefined}
  getArticles(getConfig(isTest), userFilters).then((newArticles) => {
    setArticlesToRender(newArticles)
  })
}

useEffect(() => {
  loadArticles()
  isValidUser(context.accountId,getConfig(isTest, context.networkId)).then(isValid=>setCanLoggedUserCreateArticle(isValid))
  const intervalId = setInterval(() => {
    loadArticles()
  }, 30000)
  return () => clearInterval(intervalId)
}, [])

accountId = context.accountId;

const tabs = {
  SHOW_ARTICLES_LIST: { id: 0 },
  SHOW_ARTICLE: { id: 1 },
  ARTICLE_WORKSHOP: { id: 2 },
  SHOW_ARTICLES_LIST_BY_AUTHORS: { id: 3 },
  SHOW_KANBAN_VIEW: { id: 4 },
};

function getInitialFilter() {
  if (sharedBlockHeight) {
    return {
      parameterName: "getPost",
      parameterValue: sharedBlockHeight,
    };
  } else if (tagShared) {
    return {
      parameterName: "tag",
      parameterValue: tagShared,
    };
  } else if (authorShared) {
    return {
      parameterName: "author",
      parameterValue: authorShared,
    };
  } else if (sharedArticleId) {
    return {
      parameterName: "articleId",
      parameterValue: sharedArticleId,
    };
  } else {
    return {
      parameterName: "",
    };
  }
}

function getInitialTabId() {
  if (sharedBlockHeight || sharedArticleId) {
    return tabs.SHOW_ARTICLE.id;
  } else {
    return tabs.SHOW_ARTICLES_LIST.id;
  }
}

State.init({
  displayedTabId: getInitialTabId(),
  articleToRenderData: {},
  filterBy: getInitialFilter(),
  authorsProfiles: [],
  sbtsNames: initSbtsNames,
  sbts: topicShared ? [topicShared] : initSbtsNames,
  firstRender: !isNaN(sharedBlockHeight) || typeof sharedArticleId === "string",
});

//=============================================END INITIALIZATION===================================================

//==================================================CONSTS==========================================================

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

let authorProfile = {};
if (state.filterBy.parameterName == "author") {
  authorProfile = Social.getr(`${state.filterBy.parameterValue}/profile`);
}

const navigationPills = [
  { id: tabs.SHOW_ARTICLES_LIST.id, title: "Articles" },
  { id: tabs.SHOW_ARTICLES_LIST_BY_AUTHORS.id, title: "Authors" },
  { id: tabs.SHOW_KANBAN_VIEW.id, title: "Kanban" },
];

const navigationButtons = [
  // { id: tabs.ARTICLE_WORKSHOP.id, title: "+Create article" },
];

const sbts = state.sbts;

const initialBodyAtCreation = state.editArticleData.value.articleData.body;

//=================================================END CONSTS=======================================================

//=================================================GET DATA=========================================================
const finalArticles = state.articles;

// function getArticlesToRender() {
//   if (
//     (sharedBlockHeight || sharedArticleId) &&
//     finalArticles &&
//     state.firstRender
//   ) {
//     let finalArticlesSbts = Object.keys(finalArticles);
//     let allArticles = [];

//     finalArticlesSbts.forEach((sbt) => {
//       allArticles = [...allArticles, ...finalArticles[sbt]];
//     });

//     return allArticles;
//   } else {
//     return finalArticles[sbts[0]];
//   }
// }

//const articlesToRender = getArticlesToRender() ?? [];

function filterArticlesByTag(tag, articles) {
  return articles.filter((article) => {
    return article.tags.includes(tag);
  });
}

function filterArticlesByAuthor(author, articles) {
  return articles.filter((article) => {
    return article.author === author;
  });
}

function filterOnePostByBlockHeight(blockHeight, articles) {
  if (articles) {
    return articles.filter((article) => article.blockHeight === blockHeight);
  } else {
    return [];
  }
}

function filterOnePostByArticleId(articleId, articles) {
  if (articles) {
    return articles.filter((article) => article.value.metadata.id === articleId);
  } else {
    return [];
  }
}

if (state.filterBy.parameterName === "tag") {
  articlesToRender = filterArticlesByTag(
    state.filterBy.parameterValue,
    articlesToRender
  );
} else if (state.filterBy.parameterName === "author") {
  articlesToRender = filterArticlesByAuthor(
    state.filterBy.parameterValue,
    articlesToRender
  );
} else if (state.filterBy.parameterName === "getPost") {
  articlesToRender = filterOnePostByBlockHeight(
    state.filterBy.parameterValue,
    articlesToRender
  );

  if (articlesToRender.length > 0) {
    State.update({ articleToRenderData: articlesToRender[0] });
  }
} else if (state.filterBy.parameterName === "articleId") {
  articlesToRender = filterOnePostByArticleId(
    state.filterBy.parameterValue,
    articlesToRender
  );
  console.log("articlesToRenderData - Forum.jsx - line 254", articlesToRender[0])
  if (articlesToRender.length > 0) {
    State.update({ articleToRenderData: articlesToRender[0] });
  }
}
//===============================================END GET DATA=======================================================

//=============================================STYLED COMPONENTS====================================================
const CallLibrary = styled.div`
  display: none;
`;

const ShareInteractionGeneralContainer = styled.div`
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    backdrop-filter: blur(10px);
    z-index: 1;
`;

const ShareInteractionMainContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  padding: 1rem;
  border-radious: 12px;
`;

const ClosePopUpContainer = styled.div`
  display: flex;  
  flex-direction: row-reverse;
`;

const CloseIcon = styled.div`
  cursor: pointer;
`;

const PopUpDescription = styled.p`
  color: #474D55;
`;

const ShowLinkShared = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #F2F6FA;
  padding: 1rem 2rem;
  border-radius: 17px;
`;

const LinkShared = styled.span`
  color: #0065FF;
  word-wrap: anywhere;
`;

const ClipboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0.5rem;
  min-width: 2.5rem;
`;

const ClipboardIcon = styled.i`
  color: ${state.linkCopied ? "#0065FF" : "black"};
  transition: color 0.3s linear;
  cursor: pointer;
`;

const CopiedFeedback = styled.span`
  font-size: 0.7rem;
  color: #6c757d;
`;

const SmallButton = styled.button`
position: relative;
  border: 0;
  background: transparent;
  width: 35px;
  height: 35px;
`;
//===========================================END STYLED COMPONENTS==================================================

//================================================COMPONENTS========================================================
const renderShareInteraction = () => {
  return (
    <ShareInteractionGeneralContainer>
      <ShareInteractionMainContainer>
        <ClosePopUpContainer>
          <CloseIcon
            className="bi bi-x"
            onClick={() =>
              State.update({
                showShareSearchModal: false,
                showShareModal: false,
                linkCopied: false,
                sharedElement: undefined,
                sharingSearch: false,
              })
            }
          ></CloseIcon>
        </ClosePopUpContainer>
        <h3>Share</h3>
        <PopUpDescription>
          {state.sharedElement.value
            ? "Use this link to share the article"
            : state.sharingSearch
            ? "Use this link to share the search"
            : "Can't share yet. Reload the app and try again."}
        </PopUpDescription>
        <ShowLinkShared>
          {(state.sharedElement.value || state.sharingSearch) && (
            <LinkShared>{getLink()}</LinkShared>
          )}
          <ClipboardContainer>
            {(state.sharedElement.value || state.sharingSearch) && (
              <ClipboardIcon
                className="bi-clipboard"
                onClick={() => {
                  clipboard.writeText(getLink());
                  State.update({ linkCopied: true });
                }}
              />
            )}
            {state.linkCopied && <CopiedFeedback>Copied!</CopiedFeedback>}
          </ClipboardContainer>
        </ShowLinkShared>
      </ShareInteractionMainContainer>
    </ShareInteractionGeneralContainer>
  );
};

const renderDeleteModal = () => {
  const ModalCard = styled.div`
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  `;
  const ModalContainer = styled.div`
    display: flex;
    width: 400px;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid transparent;
    margin-left: auto;
    margin-right: auto;
    margin-buttom: 50%;
    @media only screen and (max-width: 480px) {
      width: 90%;
    }
  `;
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    align-self: stretch;
  `;
  const Footer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: end;
    gap: 16px;
    align-self: stretch;
  `;

  return (
    <ModalCard>
      <ModalContainer>
        <Container>
          <h3 className="w-100">Delete this post?</h3>
          <Footer>
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: "Yes, delete it",
                onClick: deletePostListener,
                variant: "danger",
              }}
            />
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Input.Button
              }
              props={{
                children: "Cancel",
                onClick: closeDeleteArticleModal,
                variant: "info outline",
              }}
            />
          </Footer>
        </Container>
      </ModalContainer>
    </ModalCard>
  );
};

const renderSelectorLabel = () => {
  return (
    <>
      <span>Post & Filter Topics by SBT</span>

      <SmallButton>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              <p className="m-0">Topics for Community SBT Holders.</p>
              <p className="m-0">Anyone can post to Public.</p>
            </Tooltip>
          }
        >
          <i className="bi bi-info-circle"></i>
        </OverlayTrigger>
      </SmallButton>
    </>
  );
};
//==============================================END COMPONENTS======================================================

//=================================================FUNCTIONS========================================================
function stateUpdate(obj) {
  State.update(obj);
}

function onCommitDeletArticle() {
  State.update({
    showDeleteModal: false,
    deleteArticleData: undefined,
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    articleToRenderData: undefined,
    filterBy: { parameterName: "", parameterValue: {} },
    editArticleData: undefined,
  });
}

function deletePostListener() {
  State.update({ saving: true });
  const article = state.deleteArticleData;
  deleteArticle(getConfig(isTest), article.value.metadata.id, onCommitDeletArticle, closeDeleteArticleModal)
}

function getValidEditArticleDataTags() {
  let tags = state.editArticleData.value.articleData.tags ?? [];
  let newFormatTags = {};

  tags &&
    tags.map((tag) => {
      newFormatTags[tag] = "";
    });
  return newFormatTags;
}

const initialCreateState = {
  title: state.editArticleData.value.articleData.title ?? "",
  articleBody: state.editArticleData.value.articleData.body ?? initialBodyAtCreation,
  tags: state.editArticleData.value.articleData.tags ? getValidEditArticleDataTags() : {},
  libsCalls: { comment: {}, article: {}, emojis: {}, upVotes: {} },
  sbts: [sbtWhiteList[0]],
};

function handleOpenArticle(articleToRenderData) {
  State.update({
    displayedTabId: tabs.SHOW_ARTICLE.id,
    articleToRenderData,
    editArticleData: undefined,
  });
}

function handleEditArticle(articleData) {
  State.update({
    displayedTabId: tabs.ARTICLE_WORKSHOP.id,
    editArticleData: articleData,
  });
}

function handleDeleteArticle(articleData) {
  State.update({
    showDeleteModal: true,
    deleteArticleData: articleData,
  });
}

function closeDeleteArticleModal() {
  State.update({
    showDeleteModal: false,
    deleteArticleData: undefined,
  });
}

function handleFilterArticles(filter) {
  State.update({
    filterBy: {
      parameterName: filter.filterBy,
      parameterValue: filter.value,
    },
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    editArticleData: undefined,
  });
}

function handleBackButton() {
  props.editArticleData
    ? State.update({
        displayedTabId: tabs.SHOW_ARTICLE.id,
        editArticleData: undefined,
        firstRender: false,
        filterBy: {
          parameterName: "",
          parameterValue: undefined,
          handleBackClicked: true,
        },
      })
    : State.update({
        displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
        articleToRenderData: {},
        editArticleData: undefined,
        firstRender: false,
        filterBy: {
          parameterName: "",
          parameterValue: undefined,
          handleBackClicked: true,
        },
      });
}

function handleGoHomeButton() {
  State.update({
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    articleToRenderData: {},
    filterBy: { parameterName: "", parameterValue: {} },
    editArticleData: undefined,
  });
}

function handlePillNavigation(navegateTo) {
  State.update({ displayedTabId: navegateTo, editArticleData: undefined });
}

function handleSbtSelection(selectedSbt) {
  State.update({
    sbts: [selectedSbt],
  });
}

function handleShareButton(showShareModal, sharedElement) {
  //showShareModal is a boolean
  //sharedElement is and object like the example: {
  //   type: string,
  //   value: number||string,
  // }
  State.update({ showShareModal, sharedElement });
}

function handleShareSearch(showShareSearchModal, searchInputValue) {
  //showShareSearchModal is a boolean
  State.update({ showShareSearchModal, sharingSearch: true, searchInputValue });
}

function getLink() {
  if (state.sharingSearch) {
    return `https://near.social/${widgets.thisForum}?${isTest && "isTest=t&"}${
      state.filterBy.parameterName === "tag"
        ? `tagShared=${state.filterBy.parameterValue}&`
        : ""
    }topicShared=${sbts[0].replace(/\s+/g, "")}${
      state.searchInputValue !== "" &&
      `&sharedSearchInputValue=${state.searchInputValue}`
    }`;
  } else {
    return `https://near.social/${widgets.thisForum}?${isTest && "isTest=t&"}${
      state.sharedElement.type
    }=${state.sharedElement.value}`;
  }
}

function handleOnCommitArticle(articleToRenderData) {
  State.update({
    articleToRenderData,
    displayedTabId: tabs.SHOW_ARTICLE.id,
  });
}

//===============================================END FUNCTIONS======================================================
return (
  <>
    {state.showDeleteModal && renderDeleteModal()}
    {(state.showShareModal || state.showShareSearchModal) &&
      renderShareInteraction()}
    <Widget
      src={widgets.views.editableWidgets.header}
      props={{
        isTest,
        handleGoHomeButton,
        handlePillNavigation,
        brand,
        pills: navigationPills,
        navigationButtons,
        displayedTabId: state.displayedTabId,
        handleFilterArticles,
        filterParameter: state.filterBy.parameterName,
        handleBackButton,
        tabs,
        sbtsNames,
        widgets,
      }}
    />
    {/* {(state.displayedTabId == tabs.SHOW_ARTICLES_LIST.id ||
      state.displayedTabId == tabs.SHOW_KANBAN_VIEW.id) && (
      <div className="my-3 col-lg-8 col-md-8 col-sm-12">
        <Widget
          src={widgets.views.standardWidgets.newStyledComponents.Input.Select}
          props={{
            label: renderSelectorLabel(),
            value: sbts[0],
            onChange: handleSbtSelection,
            options: createSbtOptions(),
          }}
        />
      </div>
    )} */}
    {articlesToRender && state.displayedTabId == tabs.SHOW_ARTICLES_LIST.id && (
      <Widget
        src={widgets.views.editableWidgets.showArticlesList}
        props={{
          isTest,
          articlesToRender,
          tabs,
          widgets,
          addressForArticles,
          handleOpenArticle,
          handleFilterArticles,
          authorForWidget,
          initialCreateState,
          editArticleData: state.editArticleData,
          handleEditArticle,
          showCreateArticle: canLoggedUserCreateArticle,
          sbtWhiteList,
          sbts,
          handleShareButton,
          handleShareSearch,
          canLoggedUserCreateArticles,
          filterBy: state.filterBy,
          baseActions,
          handleOnCommitArticle,
          sharedSearchInputValue,
        }}
      />
    )}
    {state.articleToRenderData.value.articleData.title &&
      state.displayedTabId == tabs.SHOW_ARTICLE.id && (
        <Widget
          src={widgets.views.editableWidgets.articleView}
          props={{
            isTest,
            widgets,
            handleFilterArticles,
            articleToRenderData: state.articleToRenderData,
            authorForWidget,
            handleEditArticle,
            handleShareButton,
            handleDeleteArticle,
            baseActions,
            kanbanColumns,
            sharedCommentId,
          }}
        />
      )}

    {state.displayedTabId == tabs.SHOW_ARTICLES_LIST_BY_AUTHORS.id && (
      <Widget
        src={widgets.views.editableWidgets.showArticlesListSortedByAuthors}
        props={{
          isTest,
          finalArticles: articlesToRender,
          tabs,
          widgets,
          handleOpenArticle,
          handleFilterArticles,
          authorForWidget,
        }}
      />
    )}

    {state.displayedTabId == tabs.ARTICLE_WORKSHOP.id && (
      <Widget
        src={widgets.views.editableWidgets.create}
        props={{
          isTest,
          addressForArticles,
          authorForWidget,
          widgets,
          initialBody: initialBodyAtCreation,
          initialCreateState,
          editArticleData: state.editArticleData,
          handleFilterArticles,
          handleEditArticle,
          sbtWhiteList,
          sbts,
          canLoggedUserCreateArticles,
          baseActions,
          handleOnCommitArticle,
        }}
      />
    )}

    {state.displayedTabId === tabs.SHOW_KANBAN_VIEW.id && (
      <Widget
        src={widgets.views.editableWidgets.kanbanBoard}
        props={{
          isTest,
          widgets,
          kanbanColumns,
          handleOpenArticle,
          handleFilterArticles,
          handleShareButton,
          authorForWidget,
          finalArticles: articlesToRender,
          sbts,
          kanbanRequiredTags,
          kanbanExcludedTags,
          baseActions,
        }}
      />
    )}
  </>
);
