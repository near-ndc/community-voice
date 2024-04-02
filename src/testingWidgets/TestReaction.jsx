const { getReactions, createReaction } = VM.require("communityvoice.ndctools.near/widget/lib.reactions")
const { getConfig } = VM.require("communityvoice.ndctools.near/widget/config.CommunityVoice")

const [reactions, setReactions] = useState({reactionsStatistics: [], userReaction: undefined})

const articleId = "ayelen.near-1699406465524"
const isTest = !!props.isTest
const config = getConfig(isTest)

function onCommit() {
    console.log("On commit")
}

function onCancel() {
    console.log("On cancel")
}

function loadReactions() {
    
    getReactions(config, articleId, context.accountId).then((newReactions) => {
        setReactions(newReactions)
    })
}

function addReaction() {
    const emoji = "❤️ Positive"
    const elementReactedId = articleId
    const author = context.accountId
    
    const result = createReaction(config, emoji, elementReactedId, author, onCommit, onCancel)
    if(result.error) {
        setErrors(result.data)
    }
}

useEffect(() => {
    
    loadReactions()
    setInterval(() => {
        console.log("Loading reactions interval", Date.now() / 1000)
        loadReactions()
    }, 15000)
}, [])

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Reaction types: {reactions.reactionsStatistics.length}</div>
    <div>User emoji: {reactions.userEmoji ?? "No user reaction"}</div>
    <button onClick={addReaction}>Test new reaction</button>
    {/* <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { reactions.reactionsStatistics.length && 
        <div>
            {reactions.reactionsStatistics.map((emoji, index) => 
            {
                return (<div key={index}>Emoji: {emoji.emoji}. Total accounts: {emoji.accounts.length}. Accounts: {JSON.stringify(emoji.accounts)}</div>)
            })}
        </div>
    }
    { reactions.reactionsStatistics.length && 
        <div> Total reactions:
            {reactions.reactionsStatistics.reduce((totalReactions, currEmoji) => 
            {
                return totalReactions + currEmoji.accounts.length
            }, 0)}
        </div>
    }

</>