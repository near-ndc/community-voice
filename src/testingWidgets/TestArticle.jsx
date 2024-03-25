const { getArticles, createArticle, editArticle, deleteArticle } = VM.require("sayalot.near/widget/lib.article")
const { getSBTWhiteList } = VM.require("sayalot.near/widget/lib.SBT")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")


const [articles, setArticles] = useState([])
const [errors, setErrors] = useState([])

const isTest = !!props.isTest

const config = getConfig(isTest)

function onCommit() {
    console.log("Executing on commit")
}

function onCancel() {
    console.log("Executing on cancel")
}

function loadArticles() {
    const userFilters = {id: undefined, sbt: undefined, authors: ["silkking.near", "rodrigos.near"]}
    getArticles(config, userFilters).then((newArticles) => {
        setArticles(newArticles)
    })
}

useEffect(() => {
    loadArticles()
    setInterval(() => {
        console.log("Loading articles interval", Date.now() / 1000)
        loadArticles()
    }, 15000)
}, [])

function failNewArticle() {
    const sbtWhiteList = getSBTWhiteList(config)

    const failedArticleData = {
        title: undefined,
        body: "Test",
        tags: [],   
    }

    const metadataHelper = {
        author: context.accountId,
    }

    const result = createArticle(config, failedArticleData, metadataHelper, onCommit, onCancel)
    if(result.error) {
        setErrors(result.data)
    }
}

function newArticle() {
    const sbtWhiteList = getSBTWhiteList(config)

    const articleData = {
        title: "Test title",
        body: "Test body",
        tags: ["hello"],   
    }

    const metadataHelper = {
        author: context.accountId,
    }

    const result = createArticle(config, articleData, metadataHelper, onCommit, onCancel)
    if(result.error) {
        setErrors(result.data)
    }
}

function modifyArticle(article) {
    const articleData = article.value.articleData
    const metadata = article.value.metadata
    articleData.body = "This is a test editing an article"
    const result = editArticle(config, articleData, metadata, onCommit, onCancel)
    if(result.error) {
        setErrors(result.data)
    }
}

function removeArticle(article) {
    console.log("Removing article", article.value.metadata.id)
    deleteArticle(config, article.value.metadata.id, onCommit, onCancel)
}

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Articles: {articles.length}</div>
    <button onClick={failNewArticle}>Test fail new article</button>
    <button onClick={newArticle}>Test new article</button>
    <button onClick={() => modifyArticle(articles[0])}>Test edit article</button>
    <button onClick={() => removeArticle(articles[0])}>Test remove article</button>
    { articles.length && <div>
        {articles.map((article, index) => 
        {
            return (<div key={index}>
                    {index + 1})
                    {JSON.stringify(article, null, 2)}
                    <br/>
            </div>) 
        })}
    </div>}
</>