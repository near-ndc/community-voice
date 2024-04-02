// NDC.Forum
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice");
const { getArticles, deleteArticle } = VM.require("communityvoice.ndctools.near/widget/lib.article");
const { isValidUser } = VM.require("communityvoice.ndctools.near/widget/lib.SBT");
//===============================================INITIALIZATION=====================================================
let {
  isTest,
  accountId,
  authorForWidget,
  widgets,
  brand,
  baseActions,
  kanbanColumns,
  kanbanRequiredTags,
  kanbanExcludedTags,
  handleChangeCategory,
  categories,
  category,
  sharedData,
} = props;

const [searchInputValue, setSearchInputValue] = useState("");

accountId = context.accountId;

function getInitialFilter() {
  if (sharedData.sharedBlockheight) {
    return {
      parameterName: "getPost",
      parameterValue: sharedData.sharedBlockheight,
    };
  } else if (sharedData.sharedTag) {
    return {
      parameterName: "tag",
      parameterValue: sharedData.sharedTag,
    };
  } else if (authorShared) {
    return {
      parameterName: "author",
      parameterValue: authorShared,
    };
  } else if (sharedData.sharedArticleId) {
    return {
      parameterName: "articleId",
      parameterValue: sharedData.sharedArticleId,
    };
  } else {
    return {
      parameterName: "",
    };
  }
}

const [articlesToRender, setArticlesToRender] = useState([]);
// loggedUserHaveSbt and canLoggedUserCreateArticle probably have the same behaviour. Check
const [loggedUserHaveSbt, setLoggedUserHaveSbt] = useState(false)
const [canLoggedUserCreateArticle, setCanLoggedUserCreateArticle] =
useState(false);
const [showShareModal, setShowShareModal] = useState(false);
const [sharedElement, setSharedElement] = useState(undefined);
const [showShareSearchModal, setShowShareSearchModal] = useState(false);
const [sharingSearch, setSharingSearch] = useState(false);
const [linkCopied, setLinkCopied] = useState(false);
const [filterBy, setFilterBy] = useState(getInitialFilter());
const [loadingArticles, setLoadingArticles] = useState(true)

function loadArticles(category) {
  const userFilters = { category: category };
  console.log("Reloading categories", category)
  getArticles(getConfig(isTest), userFilters).then((newArticles) => {
    setArticlesToRender(newArticles)
    setLoadingArticles(false)
  })
}

useEffect(() => {
  setLoadingArticles(true)
  loadArticles(category);
  const intervalId = setInterval(() => {
    loadArticles(category);
  }, 30000);
  return () => clearInterval(intervalId);
}, [category]);

useEffect(() => {
  isValidUser(context.accountId,getConfig(isTest, context.networkId)).then(isValid=>{
    setLoggedUserHaveSbt(isValid)
    setCanLoggedUserCreateArticle(isValid)
  })
  //TODO change isValidUser name to getIsValidUser
}, [context.accountId])

accountId = context.accountId;

const tabs = {
  SHOW_ARTICLES_LIST: { id: 0 },
  SHOW_ARTICLE: { id: 1 },
  ARTICLE_WORKSHOP: { id: 2 },
  SHOW_ARTICLES_LIST_BY_AUTHORS: { id: 3 },
  //SHOW_KANBAN_VIEW: { id: 4 },
};

function getInitialTabId() {
  if (sharedData.sharedBlockheight || sharedData.sharedArticleId) {
    return tabs.SHOW_ARTICLE.id;
  } else {
    return tabs.SHOW_ARTICLES_LIST.id;
  }
}

State.init({
  displayedTabId: getInitialTabId(),
  articleToRenderData: {},
  authorsProfiles: [],
  firstRender: !isNaN(sharedData.sharedBlockheight) || typeof sharedData.sharedArticleId === "string",
});

//=============================================END INITIALIZATION===================================================

//==================================================CONSTS==========================================================

const profile = props.profile ?? Social.getr(`${accountId}/profile`);

if (profile === null) {
  return "Loading";
}

let authorProfile = {};
if (filterBy.parameterName == "author") {
  authorProfile = Social.getr(`${filterBy.parameterValue}/profile`);
}

const navigationPills = [
  { id: tabs.SHOW_ARTICLES_LIST.id, title: "Articles" },
  { id: tabs.SHOW_ARTICLES_LIST_BY_AUTHORS.id, title: "Authors" },
  // { id: tabs.SHOW_KANBAN_VIEW.id, title: "Kanban" },
];

const navigationButtons = [
  // { id: tabs.ARTICLE_WORKSHOP.id, title: "+Create article" },
];

const initialBodyAtCreation = state.editArticleData.value.articleData.body;

//=================================================END CONSTS=======================================================

//=================================================GET DATA=========================================================
const finalArticles = state.articles;

function filterArticlesByTag(tag, articles) {
  return articles.filter((article) => {
    return article.value.articleData.tags.includes(tag);
  });
}

function filterArticlesByAuthor(author, articles) {
  return articles.filter((article) => {
    return article.value.metadata.author === author;
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
    return articles.filter(
      (article) => article.value.metadata.id === articleId
    );
  } else {
    return [];
  }
}

if (filterBy.parameterName === "tag") {
  setArticlesToRender(filterArticlesByTag(
    filterBy.parameterValue,
    articlesToRender
  ));
} else if (filterBy.parameterName === "author") {
  setArticlesToRender(filterArticlesByAuthor(
    filterBy.parameterValue,
    articlesToRender
  ));
} else if (filterBy.parameterName === "getPost") {
  setArticlesToRender(filterOnePostByBlockHeight(
    filterBy.parameterValue,
    articlesToRender
  ));

  if (articlesToRender.length > 0) {
    State.update({ articleToRenderData: articlesToRender[0] });
  }
} else if (filterBy.parameterName === "articleId") {
  setArticlesToRender(filterOnePostByArticleId(
    filterBy.parameterValue,
    articlesToRender
  ));
  if (articlesToRender.length > 0) {
    State.update({ articleToRenderData: articlesToRender[0] });
  }
}
//===============================================END GET DATA=======================================================

//=============================================STYLED COMPONENTS====================================================
const AppContainer = styled.div`
  max-width: 1800px;
  margin: 0 auto;
`;

const SecondContainer = styled.div`
  margin: 0 2rem;
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
  color: #474d55;
`;

const ShowLinkShared = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f2f6fa;
  padding: 1rem 2rem;
  border-radius: 17px;
`;

const LinkShared = styled.span`
  color: #0065ff;
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
            onClick={() => {
              setShowShareSearchModal(false);
              setShowShareModal(false);
              setLinkCopied(false);
              setSharedElement(undefined);
              setSharingSearch(false);
            }}
          ></CloseIcon>
        </ClosePopUpContainer>
        <h3>Share</h3>
        <PopUpDescription>
          {sharedElement.value
            ? "Use this link to share the article"
            : sharingSearch
            ? "Use this link to share the search"
            : "Can't share yet. Reload the app and try again."}
        </PopUpDescription>
        <ShowLinkShared>
          {(sharedElement.value || sharingSearch) && (
            <LinkShared>{getLink()}</LinkShared>
          )}
          <ClipboardContainer>
            {(sharedElement.value || sharingSearch) && (
              <ClipboardIcon
                className="bi-clipboard"
                onClick={() => {
                  clipboard.writeText(getLink());
                  setLinkCopied(true);
                }}
              />
            )}
            {linkCopied && <CopiedFeedback>Copied!</CopiedFeedback>}
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

const getCategoriesSelectorLabel = () => {
  return (
    <>
      <span>Post & Filter by Categories</span>

      <SmallButton>
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip>
              <p className="m-0">Topics for Community SBT Holders.</p>
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
function onCommitDeletArticle() {
  setArticlesToRender([])
  setTimeout(() => {
    loadArticles()
  }, 3000);
  setFilterBy({ parameterName: "", parameterValue: {} });
  State.update({
    showDeleteModal: false,
    deleteArticleData: undefined,
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    articleToRenderData: undefined,
    editArticleData: undefined,
  });
}

function deletePostListener() {
  State.update({ saving: true });
  const article = state.deleteArticleData;
  deleteArticle(
    getConfig(isTest),
    article.value.metadata.id,
    onCommitDeletArticle,
    closeDeleteArticleModal
  );
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
  articleBody:
    state.editArticleData.value.articleData.body ?? initialBodyAtCreation,
  tags: state.editArticleData.value.articleData.tags
    ? getValidEditArticleDataTags()
    : {},
  libsCalls: { comment: {}, article: {}, emojis: {}, upVotes: {} },
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
  setFilterBy({
    parameterName: filter.filterBy,
    parameterValue: filter.value,
  });
  State.update({
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    editArticleData: undefined,
  });
}

function handleBackButton() {
  loadArticles()
  if (props.editArticleData) {
    setFilterBy({
      parameterName: "",
      parameterValue: undefined,
      handleBackClicked: true,
    });
    State.update({
      displayedTabId: tabs.SHOW_ARTICLE.id,
      editArticleData: undefined,
      firstRender: false,
    });
  } else {
    setFilterBy({
      parameterName: "",
      parameterValue: undefined,
      handleBackClicked: true,
    });
    State.update({
      displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
      articleToRenderData: {},
      editArticleData: undefined,
      firstRender: false,
    });
  }
}

function handleGoHomeButton() {
  setFilterBy({ parameterName: "", parameterValue: {} });
  State.update({
    displayedTabId: tabs.SHOW_ARTICLES_LIST.id,
    articleToRenderData: {},
    editArticleData: undefined,
  });
  loadArticles()
}

function handlePillNavigation(navegateTo) {
  State.update({ displayedTabId: navegateTo, editArticleData: undefined });
}

function handleShareButton(showShareModal, sharedElement) {
  setShowShareModal(showShareModal)
  setSharedElement(sharedElement)
}

function handleShareSearch(showShareSearchModal, newSearchInputValue) {
  //showShareSearchModal is a boolean
  setShowShareSearchModal(showShareSearchModal);
  setSharingSearch(true);
  setSearchInputValue(newSearchInputValue ?? "");
}

function getLink() {
  const baseUrl = `https://near.org/${widgets.thisForum}?${
    isTest && "isTest=true"
  }`
  if (sharingSearch) {
    const link = `${baseUrl}${
      filterBy.parameterName === "tag"
        ? `&st=${filterBy.parameterValue}`
        : ""
    }${
      searchInputValue !== "" ? `&ss=${searchInputValue}` : ""
    }`;
    return link;
  } else {
    const link = `${baseUrl}&${sharedElement.key}=${sharedElement.value}`;
    return link;
  }
}

function handleOnCommitArticle(articleId) {
  setTimeout(() => {
    const userFilters = {id: articleId, sbt: undefined}
    getArticles(getConfig(isTest), userFilters).then((newArticles) => {
      if(newArticles && newArticles.length > 0){
        State.update({
          displayedTabId: tabs.SHOW_ARTICLE.id,
          articleToRenderData: newArticles[0]
        });
      }
    })
  }, 3000);
}
let category2=category
//===============================================END FUNCTIONS======================================================
return (
  <AppContainer>
    <SecondContainer>
      {state.showDeleteModal && renderDeleteModal()}
      {(showShareModal || showShareSearchModal) && renderShareInteraction()}
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
          filterParameter: filterBy.parameterName,
          handleBackButton,
          tabs,
          sbtsNames,
          widgets,
        }}
      />
      {state.displayedTabId == tabs.SHOW_ARTICLES_LIST.id && (
        <div className="my-3 col-lg-8 col-md-8 col-sm-12">
          <Widget
            src={widgets.views.standardWidgets.newStyledComponents.Input.Select}
            props={{
              label: getCategoriesSelectorLabel(),
              value: category2,
              onChange: (e)=>{
                category2=e
                handleChangeCategory(e)
                
              },
              options: categories
            }}
          />
        </div>
      )}
    {state.displayedTabId == tabs.SHOW_ARTICLES_LIST.id && (
      loadingArticles?
        <Widget
          src={widgets.views.standardWidgets.newStyledComponents.Feedback.Spinner}
        />
      :
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
            loggedUserHaveSbt,
            handleShareButton,
            handleShareSearch,
            canLoggedUserCreateArticles,
            filterBy,
            baseActions,
            handleOnCommitArticle,
            sharedSearchInputValue: sharedData.sharedSearch,
            category
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
          loggedUserHaveSbt
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
            kanbanColumns,
            sharedCommentId,
            loggedUserHaveSbt,
            handleOnCommitArticle,
            category
          }}
        />
      )}
    </SecondContainer>
  </AppContainer>
);
