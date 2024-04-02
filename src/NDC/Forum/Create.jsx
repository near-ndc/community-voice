//NDC.Forum.Create
const { createArticle, editArticle, buildArticle } = VM.require("communityvoice.ndctools.near/widget/lib.article")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice")


const {
  isTest,
  addressForArticles,
  authorForWidget,
  stateUpdate,
  initialBody,
  initialCreateState,
  editArticleData,
  widgets,
  handleFilterArticles,
  handleEditArticle,
  handlerStateUpdate,
  canLoggedUserCreateArticles,
  baseActions,
  handleOnCommitArticle,
  category
} = props;

const errTextNoBody = "ERROR: no article Body",
  errTextNoId = "ERROR: no article Id",
  errTextDublicatedId = "ERROR: there is article with such name";

State.init({
  ...initialCreateState,
  initialBody: props.initialBody ?? "",
  tags:[]
});

function createStateUpdate(obj) {
  State.update(obj);
}

const tagsArray =
  editArticleData && !state.tagsModified ? editArticleData.value.articleData.tags : state.tags;
  
const accountId = context.accountId;

function getRealArticleId() {
  if (editArticleData) {
    return (
      editArticleData.value.metadata.id ??
      `article/${editArticleData.value.metadata.author}/${editArticleData.value.metadata.createdTimestamp}`
    );
  } else {
    return `article/${accountId}/${Date.now()}`;
  }
}

function getArticleData() {
  const args = {
    title: editArticleData.value.articleData.title ?? state.title,
    author: editArticleData.value.metadata.author ?? accountId,
    lastEditor: accountId,
    timeLastEdit: Date.now(),
    timeCreate: editArticleData.value.metadata.createdTimestamp ?? Date.now(),
    body: state.articleBody,
    version: editArticleData ? editArticleData.value.metadata.versionKey + 1 : 0,
    navigation_id: null,
    tags: tagsArray ?? [],
    id: getRealArticleId(),
    category: editArticleData.value.articleData.category ?? category,
  };
  return args;
}

function onCommit(articleId) {
  State.update({
    title: "",
    clearArticleId: true,
    tags: [],
    clearTags: true,
    articleBody: "",
    clearArticleBody: true,
    initalBody: "",
    // showCreatedArticle: true,
    showPreview: false,
    saving: true,
  });

  //if (!Array.isArray(article.tags)) article.tags = Object.keys(article.tags);

  handleOnCommitArticle(articleId);
}

function onCancel() {
  State.update({
    createdArticle: undefined,
    saving: false,
  });
}

const handleCreate = () => {
  const {title, body, tags, category} = getArticleData()

  const articleData = { title, body, tags, category}
  
  const metadataHelper = {
    author: context.accountId,
  }
  createArticle(getConfig(isTest), articleData, metadataHelper, (id) => onCommit(id), onCancel)
}

const handleEdit = () => {
  const {title, body, tags, id, category} = getArticleData()

  const articleData = { title, body, tags, category }

  const articleMetadata = editArticleData.value.metadata 
  
  editArticle(getConfig(isTest), articleData, articleMetadata, ()=>onCommit(id), onCancel)
}

function getInitialMarkdownBody() {
  if (
    editArticleData &&
    (!state.articleBody || state.articleBody === editArticleData.value.articleData.body)
  ) {
    return editArticleData.value.articleData.body;
  } else if (state.articleBody && state.articleBody !== editArticleData.value.articleData.body) {
    return state.articleBody;
  } else {
    return state.initialBody == "" || !state.initialBody
      ? "Post content (markdown supported)"
      : state.initialBody;
  }
}

function switchShowPreview() {
  State.update({
    showPreview: !state.showPreview,
    initialBody: state.articleBody,
  });
}

const GeneralContainer = styled.div`
    background-color: rgb(248, 248, 249);
    margin: 0;
  `;

const Button = styled.button` 
    margin: 0px 1rem; 
    display: inline-block; 
    text-align: center; 
    vertical-align: middle; 
    cursor: pointer; 
    user-select: none; 
    transition: color 0.15s ease-in-out,background-color 0.15s ease-in-out,border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out; 
   
    border: 2px solid transparent; 
    font-weight: 500; 
    padding: 0.3rem 0.5rem; 
    background-color: #010A2D; 
    border-radius: 12px; 
    color: white; 
    text-decoration: none;   
   
    &:hover { 
      color: #010A2D; 
      background-color: white; 
    } 
  `;

const CreationContainer = styled.div`
    background-color: rgb(230, 230, 230);
    border-radius: 20px;
    padding: 1rem 0;
    position: relative;
  `;

const SecondContainer = styled.div`
    min-width: 360px;
    background-color: white;
    padding: 1rem;
  `;

const BoxShadow = styled.div`
    box-shadow: rgba(140, 149, 159, 0.1) 0px 4px 28px 0px;
  `;

const SpinnerContainer = styled.div`
    height: 1rem;
    width: 1rem;
    marginTop: 2px;
  `;

const Spinner = () => {
  return (
    <SpinnerContainer className="spinner-border text-secondary" role="status">
      <span className="sr-only" title="Loading..."></span>
    </SpinnerContainer>
  );
};

const initialTagsObject = {};

Array.isArray(tagsArray) &&
  tagsArray.forEach((tag) => {
    initialTagsObject[tag] = true;
  });

if(state.saving){
  return (
    <Widget
      src={widgets.views.standardWidgets.newStyledComponents.Feedback.Spinner}
    />
  )
}

return (
  <div>
    <GeneralContainer className="pt-2 row card-group">
      <BoxShadow className="rounded-3 p-3 m-3 bg-white col-lg-8 col-md-8 col-sm-12">
        <div>
          <SecondContainer className="rounded">
            {state.showPreview ? (
              <Widget
                src={widgets.views.editableWidgets.generalCard}
                props={{
                  widgets,
                  isTest,
                  data: {
                    blockHeight:-1,
                    accountId,
                    value:{
                      ...buildArticle({
                        title: state.title,
                        body: state.articleBody,
                        tags: tagsArray,
                      },{
                        author: accountId,
                      })
                    }
                  },
                  addressForArticles,
                  handleOpenArticle: () => {},
                  handleFilterArticles: () => {},
                  authorForWidget,
                  handleShareButton: () => {},
                  baseActions,
                  switchShowPreview,
                  isPreview: state.showPreview
                }}
              />
            ) : (
              <div>
                <div className="d-flex flex-column pt-3">
                  <label for="inputArticleId" className="small text-danger">
                    {state.errorId}
                  </label>
                  <Widget
                    src={widgets.views.standardWidgets.fasterTextInput}
                    props={{
                      firstText: state.title,
                      forceClear: state.clearArticleId,
                      stateUpdate: (obj) => State.update(obj),
                      filterText: (e) => e.target.value,
                      placeholder: "Post title (case-sensitive)",
                      editable: editArticleData,
                    }}
                  />
                </div>
                <div className="d-flex flex-column pt-3">
                  <label
                    for="textareaArticleBody"
                    className="small text-danger"
                  >
                    {state.errorBody}
                  </label>
                  <div className="d-flex gap-2">
                    <Widget
                      src={widgets.views.standardWidgets.markownEditorIframe}
                      props={{
                        initialText: getInitialMarkdownBody(),
                        onChange: (articleBody) =>
                          State.update({
                            articleBody,
                            clearArticleBody: false,
                          }),
                        clearArticleBody: state.clearArticleBody,
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column pt-3">
                  <Widget
                    src={widgets.views.editableWidgets.tagsEditor}
                    props={{
                      forceClear: state.clearTags,
                      stateUpdate: (obj) => State.update(obj),
                      initialTagsObject,
                      placeholder: "Input tags",
                      setTagsObject: (tags) => {
                        // state.tags = Object.keys(tags);
                        State.update({
                          tagsModified: true,
                          tags: Object.keys(tags),
                        });
                      },
                    }}
                  />
                </div>
              </div>
            )}
            <div className="mt-2 d-flex justify-content-end">
              <Widget
                src={
                  widgets.views.standardWidgets.newStyledComponents.Input.Button
                }
                props={{
                  className: "info outline mx-2",
                  disabled:
                    state.title.length === 0 || state.articleBody.length === 0,
                  onClick: switchShowPreview,
                  children: (
                    <i
                      className={`bi ${
                        state.showPreview ? "bi-pencil" : "bi-eye-fill"
                      }`}
                    ></i>
                  ),
                }}
              />
              <Widget
                src={
                  widgets.views.standardWidgets.newStyledComponents.Input.Button
                }
                props={{
                  className: "info ",
                  disabled:
                    state.title.length === 0 || state.articleBody.length === 0,
                  onClick: editArticleData ? handleEdit : handleCreate,
                  children: (
                    <div className="d-flex justify-conten-center align-items-center">
                      {state.saving ? (
                        <Spinner />
                      ) : (
                        <>
                          <span>
                            {editArticleData ? "Save edition" : "Post"}
                          </span>
                          <i className="bi bi-check2"></i>
                        </>
                      )}
                    </div>
                  ),
                }}
              />
            </div>
          </SecondContainer>
        </div>
      </BoxShadow>
    </GeneralContainer>
  </div>
);
