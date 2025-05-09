const { getUpVotes, createUpVote, deleteUpVote } = VM.require(
    'chatter.cheddar.near/widget/lib.upVotes'
)
const { getConfig } = VM.require(
    'chatter.cheddar.near/widget/config.CommunityVoice'
)

const [upVotes, setUpVotes] = useState([])

const isTest = !!props.isTest
const config = getConfig(isTest)
const articleId = 'article/rodrigos.near/1710843635815'

function loadUpVotes() {
    getUpVotes(config, articleId).then((newVotes) => {
        setUpVotes(newVotes)
    })
}

useEffect(() => {
    loadUpVotes()
    setInterval(() => {
        console.log('Loading upvotes interval', Date.now() / 1000)
        loadUpVotes()
    }, 15000)
}, [])

function newUpVote() {
    const result = createUpVote(
        config,
        articleId,
        context.accountId,
        onCommit,
        onCancel
    )
    if (result.error) {
        setErrors(result.data)
    }
}

function removeUpVote() {
    deleteUpVote(
        config,
        articleId,
        upVotes[0].value.metadata.id,
        onCommit,
        onCancel
    )
}

return (
    <>
        <div>
            {errors && errors.length
                ? errors.map((err, index) => {
                      return <div key={index}>{err}</div>
                  })
                : 'No error'}
        </div>
        <div>Upvotes: {upVotes.length}</div>
        <button onClick={newUpVote}>Test new upVote</button>
        <button onClick={removeUpVote}>Test remove upVote</button>
        {upVotes && upVotes.length && (
            <div>
                {upVotes.map((upVote, index) => {
                    return <div key={index}>{JSON.stringify(upVote)}</div>
                })}
            </div>
        )}
    </>
)
