const { getUpVotes } = VM.require("sayalot.near/widget/lib.upVotes")

const [upVotes, setUpVotes] = useState([])

function loadUpVotes() {
    const articleId = "blaze.near-1708108768232"
    const baseAction = "communityVoiceUpVote"
    getUpVotes(articleId, baseAction).then((newVotes) => {
        setUpVotes(newVotes)
    })
}

useEffect(() => {
    
    loadUpVotes()
    setInterval(() => {
        console.log("Loading upvotes interval", Date.now() / 1000)
        loadUpVotes()
    }, 30000)
}, [])

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Upvotes: {upVotes.length}</div>
    {/* <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { upVotes && upVotes.length && <div>
        {upVotes.map((upVote, index) => 
        {
            return (<div key={index}>{JSON.stringify(upVote)}</div>)
        })}
    </div>}
</>