const { getEmojis } = VM.require("sayalot.near/widget/lib.emojis")
const { getConfig } = VM.require("sayalot.near/widget/config.CommunityVoice")

const [emojis, setEmojis] = useState({reactionsStatistics: [], userReaction: undefined})

function loadEmojis() {
    const articleId = "blaze.near-1708108768232"
    getEmojis(articleId, getConfig(), context.accountId).then((newEmojis) => {
        console.log(1000, newEmojis)
        setEmojis(newEmojis)
    })
}

useEffect(() => {
    
    loadEmojis()
    setInterval(() => {
        console.log("Loading emojis interval", Date.now() / 1000)
        loadEmojis()
    }, 30000)
}, [])

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Emojis types: {emojis.reactionsStatistics.length}</div>
    <div>User reaction: {emojis.userReaction ?? "No user reaction"}</div>
    {/* <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { emojis.reactionsStatistics.length && 
        <div>
            {emojis.reactionsStatistics.map((emoji, index) => 
            {
                return (<div key={index}>Emoji: {emoji.emoji}. Total accounts: {emoji.accounts.length}. Accounts: {JSON.stringify(emoji.accounts)}</div>)
            })}
        </div>
    }
    { emojis.reactionsStatistics.length && 
        <div> Total emojis:
            {emojis.reactionsStatistics.reduce((totalReactions, currEmoji) => 
            {
                return totalReactions + currEmoji.accounts.length
            }, 0)}
        </div>
    }

</>