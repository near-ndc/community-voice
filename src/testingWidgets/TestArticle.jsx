const { getArticles } = VM.require("sayalot.near/widget/lib.article")

const [articlesBySbt, setArticlesBySbt] = useState({})

const config = {
    baseActions: {
        article: "communityVoiceArticle",
        upVote: "communityVoiceUpVote"
    }
}

function loadArticles() {
    getArticles(config).then((newArticles) => {
        console.log(1, newArticles)
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

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>SBTs: {Object.keys(articlesBySbt).length}</div>
    <div>Articles: {Object.keys(articlesBySbt).reduce((sum, sbtName) => articlesBySbt[sbtName].length + sum, 0)}</div>
    {/* <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
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