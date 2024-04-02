// NDC.Forum.AllArticlesList
const { arrayIncludesIgnoreCase } = VM.require("communityvoice.ndctools.near/widget/lib.strings")

//===============================================INITIALIZATION=====================================================

let {
  isTest,
  stateUpdate,
  articlesToRender,
  tabs,
  widgets,
  addressForArticles,
  handleFilterArticles,
  handleOpenArticle,
  authorForWidget,
  initialCreateState,
  editArticleData,
  handleEditArticle,
  showCreateArticle,
  handleShareButton,
  handleShareSearch,
  loggedUserHaveSbt,
  filterBy,
  baseActions,
  handleOnCommitArticle,
  sharedSearchInputValue,
  category,
  sharedData,
} = props;

if(!articlesToRender) return <></>

const [searchInputValue, setSearchInputValue] = useState(
  sharedSearchInputValue ?? ""
);

function filterArticlesBySearch(articles, searchInputValue) {
  if(!searchInputValue || searchInputValue === "") return articles
  return articles.filter((article) => {
    const { title, body } = article.value.articleData
    const { author } = article.value.metadata
    const arr = [ title, body, author ]
    if (arr.some((item) => item === undefined)) return false
    
    return arrayIncludesIgnoreCase(arr, searchInputValue)        
  });
}

const articlesFilteredBySearch = filterArticlesBySearch(articlesToRender, searchInputValue);

const fiveDaysTimeLapse = 5 * 24 * 60 * 60 * 1000;
const newestArticlesWithUpVotes = articlesFilteredBySearch
  .filter((article) => article.value.metadata.lastEditTimestamp > Date.now() - fiveDaysTimeLapse)
  // .sort((a, b) => b.timeLastEdit - a.timeLastEdit);

const olderArticlesWithUpVotes = articlesFilteredBySearch
  .filter((article) => article.value.metadata.lastEditTimestamp < Date.now() - fiveDaysTimeLapse)
  // .sort((a, b) => b.upVotes.length - a.upVotes.length);

const sortedArticlesToRender = [
  ...newestArticlesWithUpVotes,
  ...olderArticlesWithUpVotes,
];

//=============================================END INITIALIZATION===================================================

//===================================================CONSTS=========================================================

const AcordionContainer = styled.div`
  --bs-accordion-border-width: 0px !important;
`;

const NoMargin = styled.div`
  margin: 0 0.75rem;
`;

const AccordionBody = styled.div`
  padding: 0;
`;

const ArticlesListContainer = styled.div`
  background-color: rgb(248, 248, 249);
  margin: 0;
`;

const CallLibrary = styled.div`
  display: none;
`;

const IconCursorPointer = styled.i`
  cursor: pointer;
`;

const ShareSearchRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-content: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
`;

const ShareSearchText = styled.h6`
  margin-bottom: 0;
  margin-left: 1rem;
  margin-right: 1rem;
`;

const SearchResult = styled.span`
  margin-left: 0.5rem;
  font-size: small;
`;

//=================================================END CONSTS=======================================================

//==================================================FUNCTIONS=======================================================

function getDateLastEdit(timestamp) {
  const date = new Date(Number(timestamp));
  const dateString = {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
  return dateString;
}

function handleSearch(e) {
  setSearchInputValue(e.target.value);
}

//================================================END FUNCTIONS=====================================================
return (
  <>
    {loggedUserHaveSbt ? (
      <>
        <AcordionContainer className="accordion" id="accordionExample">
          <NoMargin className="accordion-item">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button collapsed border border-2"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <h6 className="m-0">+ Create post</h6>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <AccordionBody className="accordion-body">
                <Widget
                  src={widgets.views.editableWidgets.create}
                  props={{
                    isTest,
                    addressForArticles,
                    authorForWidget,
                    stateUpdate,
                    widgets,
                    initialCreateState,
                    editArticleData,
                    handleFilterArticles,
                    handleEditArticle,
                    initialBody: "",
                    canLoggedUserCreateArticles: loggedUserHaveSbt,
                    baseActions,
                    handleOnCommitArticle,
                    category
                  }}
                />
              </AccordionBody>
            </div>
          </NoMargin>
        </AcordionContainer>
      </>
    ) : (
      <h6>You can't post since you don't own any SBT</h6>
    )}
    <Widget
      src={widgets.views.standardWidgets.styledComponents}
      props={{
        Input: {
          label: "Search",
          value: searchInputValue,
          type: "text",
          placeholder: "You can search by title, content or author",
          handleChange: handleSearch,
        },
      }}
    />
    {searchInputValue &&
      searchInputValue !== "" &&
      sortedArticlesToRender.length > 0 && (
        <SearchResult className="text-secondary">
          {`Found ${sortedArticlesToRender.length} articles searching for "${searchInputValue}"`}
        </SearchResult>
      )}
    <ShareSearchRow>
      <ShareSearchText>Share search</ShareSearchText>
      <Widget
        src={widgets.views.standardWidgets.newStyledComponents.Input.Button}
        props={{
          size: "sm",
          className: "info outline icon",
          children: <i className="bi bi-share"></i>,
          onClick: () => handleShareSearch(true, searchInputValue),
        }}
      />
    </ShareSearchRow>
    <h5>Previous articles will be loaded in the following days</h5>
    <NoMargin>
      {filterBy.parameterName === "tag" && (
        <div className="mt-3">
          <h6>Filter by tag:</h6>
          <div className="d-flex align-items-center ">
            <Widget
              src={
                widgets.views.standardWidgets.newStyledComponents.Element.Badge
              }
              props={{
                children: filterBy.parameterValue,
                variant: "round info",
                size: "lg",
              }}
            />
            <IconCursorPointer
              className="bi bi-x"
              onClick={() => handleFilterArticles({ filterBy: "", value: "" })}
            ></IconCursorPointer>
          </div>
        </div>
      )}
      <ArticlesListContainer className="row card-group py-3">
        {sortedArticlesToRender.length > 0 ? (
          sortedArticlesToRender.map((article, i) => {
            const authorProfileCall = Social.getr(
              `${article.value.metadata.author}/profile`
            );

            if (authorProfileCall) {
              article.authorProfile = authorProfileCall;
            }

            // If some widget posts data different than an array it will be ignored
            if (!Array.isArray(article.value.articleData.tags))
              article.value.articleData.tags = [];
            return (
              <div key={article.value.metadata.id}>
                <Widget
                  src={widgets.views.editableWidgets.generalCard}
                  props={{
                    widgets,
                    isTest,
                    data: article,
                    displayOverlay: true,
                    renderReactions: true,
                    addressForArticles,
                    handleOpenArticle,
                    handleFilterArticles,
                    authorForWidget,
                    handleShareButton,
                    handleEditArticle,
                    baseActions,
                    loggedUserHaveSbt
                  }}
                />
              </div>
            );
          })
        ) : (
          <h5>{`No articles ${
            searchInputValue !== ""
              ? `have been found searching for ${searchInputValue}`
              : "uploaded yet"
          }`}</h5>
        )}
      </ArticlesListContainer>
    </NoMargin>
  </>
);
