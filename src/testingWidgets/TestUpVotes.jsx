const { getUpVotes } = VM.require("sayalot.near/widget/lib.upVotes")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")

const [upVotes, setUpVotes] = useState([])

const isTest = !!props.isTest
const config = getConfig(isTest)

function loadUpVotes() {
    const articleId = "article/silkking.near/1709818622924"
    getUpVotes(articleId, config).then((newVotes) => {
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