const { getComments } = VM.require("sayalot.near/widget/lib.comment")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")

const [comments, setComments] = useState([])

function loadComments() {
    const articleId = "blaze.near-1708108768232"
    getComments(articleId, getConfig()).then((newComments) => {
        setComments(newComments)
    })
}

useEffect(() => {
    
    loadComments()
    setInterval(() => {
        console.log("Loading comments interval", Date.now() / 1000)
        loadComments()
    }, 30000)
}, [])

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Comments: {comments.length}</div>
    {/* <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { comments && comments.length && <div>
        {comments.map((upVote, index) => 
        {
            return (<div key={index}>{JSON.stringify(upVote)}</div>)
        })}
    </div>}
</>