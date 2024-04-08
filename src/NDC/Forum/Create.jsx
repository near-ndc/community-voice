//NDC.Forum.Create
const { createArticle, editArticle, buildArticle } = VM.require("communityvoice.ndctools.near/widget/lib.article")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice")

if(!createArticle || !editArticle || !buildArticle || !getConfig){
  return <div className="spinner-border" role="status"></div>
}

const {
  isTest,
  authorForWidget,
  widgets,
  editArticleData,
  handleFilterArticles,
  handleOnCommitArticle,
  category,
  loggedUserHaveSbt
} = props;

const [title, setTitle] = useState(editArticleData.value.articleData.title ?? "")
const [tags, setTags] = useState(editArticleData.value.articleData.tags ?? [])
const [body, setBody] = useState(editArticleData.value.articleData.body ?? "Post content (markdown supported)")
const [clearTags, setClearTags] = useState(false)
const [clearArticleBody, setClearArticleBody] = useState(false)
const [showPreview, setShowPreview] = useState(false)
const [saving, setSaving] = useState(false)
  
function onCommit(articleId) {
  setClearTags(true)
  setClearArticleBody(true)
  setTitle("")
  setBody("")
  setTags([])
  setShowPreview(false)
  setSaving(true)
  handleOnCommitArticle(articleId);
}

function onCancel() {
  setSaving(false)
}

const handleCreate = () => {
  const articleData = { title, body, tags, category}
  
  const metadataHelper = {
    author: context.accountId,
  }

  createArticle(getConfig(isTest), articleData, metadataHelper, (id) => onCommit(id), onCancel)
}

const handleEdit = () => {
  const articleData = { 
    title: editArticleData.value.articleData.title, 
    body, 
    tags, 
    category: editArticleData.value.articleData.category,
  }

  const articleMetadata = editArticleData.value.metadata 
  
  editArticle(getConfig(isTest), articleData, articleMetadata, ()=>onCommit(editArticle.value.metadata.id), onCancel)
}

function toggleShowPreview() {
  setShowPreview(showPreview=>!showPreview)
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

if(saving){
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
            {showPreview ? (
              <Widget
                src={widgets.views.editableWidgets.generalCard}
                props={{
                  widgets,
                  isTest,
                  article: {
                    blockHeight:-1,
                    accountId: context.accountId,
                    value:{
                      ...buildArticle({
                        title: title,
                        body: body,
                        tags: tags,
                      },{
                        author: context.accountId,
                      })
                    }
                  },
                  handleOpenArticle: () => {},
                  handleFilterArticles: () => {},
                  authorForWidget,
                  handleShareButton: () => {},
                  handleEditArticle: () => {},
                  toggleShowPreview,
                  isPreview: showPreview,
                  loggedUserHaveSbt
                }}
              />
            ) : (
              <div>
                <div className="d-flex flex-column pt-3">
                  <Widget
                    src={widgets.views.editableWidgets.fasterTextInput}
                    props={{
                      title,
                      setTitle,
                      placeholder: "Post title (case-sensitive)",
                      editable: editArticleData,
                    }}
                  />
                </div>
                <div className="d-flex flex-column pt-3">
                  <div className="d-flex gap-2">
                    <Widget
                      src={widgets.views.editableWidgets.markdownEditorIframe}
                      props={{
                        initialText: body,
                        onChange: (body) => setBody(body),
                        clear: clearArticleBody,
                      }}
                    />
                  </div>
                </div>
                <div className="d-flex flex-column pt-3">
                  <Widget
                    src={widgets.views.editableWidgets.tagsEditor}
                    props={{
                      tags,
                      setTags,
                      clearTags,
                      setClearTags,
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
                    title.length === 0 || body.length === 0,
                  onClick: toggleShowPreview,
                  children: (
                    <i
                      className={`bi ${
                        showPreview ? "bi-pencil" : "bi-eye-fill"
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
                    title.length === 0 || body.length === 0,
                  onClick: editArticleData ? handleEdit : handleCreate,
                  children: (
                    <div className="d-flex justify-conten-center align-items-center">
                      {saving ? (
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
