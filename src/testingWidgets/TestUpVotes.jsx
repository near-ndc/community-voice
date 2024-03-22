const { getUpVotes, addUpVote } = VM.require("sayalot.near/widget/lib.upVotes")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")

const [upVotes, setUpVotes] = useState([])

const isTest = !!props.isTest
const config = getConfig(isTest)
const articleId = "article/rodrigos.near/1710843635815"

function loadUpVotes() {
    getUpVotes(config, articleId).then((newVotes) => {
        setUpVotes(newVotes)
    })
}

useEffect(() => {
    
    loadUpVotes()
    setInterval(() => {
        console.log("Loading upvotes interval", Date.now() / 1000)
        loadUpVotes()
    }, 15000)
}, [])

function newUpVote() {
    const upVoteData = {
        articleId
    }

    const result = addUpVote(config, articleId, context.accountId, onCommit, onCancel)
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
    <div>Upvotes: {upVotes.length}</div>
    <button onClick={newUpVote}>Test new upVote</button>
    <button onClick={removeUpVote}>Test remove upVote</button>
    { upVotes && upVotes.length && <div>
        {upVotes.map((upVote, index) => 
        {
            return (<div key={index}>{JSON.stringify(upVote)}</div>)
        })}
    </div>}
</>