const { getArticles, createArticle } = VM.require("sayalot.near/widget/lib.article")
const { getSBTWhiteList } = VM.require("sayalot.near/widget/lib.SBT")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")


const [articlesBySbt, setArticlesBySbt] = useState({})
const [errors, setErrors] = useState([])

const isTest = !!props.isTest

const config = getConfig(isTest)

function loadArticles() {
    getArticles(config).then((newArticles) => {
        setArticlesBySbt(newArticles)
    })
}

useEffect(() => {
    loadArticles()
    setInterval(() => {
        console.log("Loading articles interval", Date.now() / 1000)
        loadArticles()
    }, 30000)
}, [])

function failNewArticle() {
    const failedArticle = {
        title: undefined,
        author: context.accountId,
        body: "",
        sbt: "",
        tags: "",   
    }

    const result = createArticle(config, failedArticle, context.accountId)
    if(result.error) {
        setErrors(result.data)
    }
}

function newArticle() {
    const sbtWhiteList = getSBTWhiteList(config)
    console.log(1, sbtWhiteList)
    const article = {
        title: "Test",
        author: context.accountId,
        body: "This is a test",
        sbt: sbtWhiteList[0].value,
        tags: [],   
    }

    const result = createArticle(config, article, context.accountId)
    if(result.error) {
        setErrors(result.data)
    }
}

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>SBTs: {Object.keys(articlesBySbt).length}</div>
    <div>Articles: {Object.keys(articlesBySbt).reduce((sum, sbtName) => articlesBySbt[sbtName].length + sum, 0)}</div>
    <button onClick={failNewArticle}>Test fail new article</button>
    <button onClick={newArticle}>Test new article</button>
    {/* <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { articlesBySbt && Object.keys(articlesBySbt).length && <div>
        {Object.keys(articlesBySbt).map((sbtName, index) => 
        {
            const articles = articlesBySbt[sbtName]
            return (<div key={index}>
                <span>{sbtName} {articles.length}</span>
                <span>{articles.map((article, index2) => {
                    <div key={index2}>{article.articleId}'s upvotes: {article.upVote}</div>
                })}</span>
            </div>) 
        })}
    </div>}
</>