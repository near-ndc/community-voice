const { getUserSBTs } = VM.require("sayalot.near/widget/lib.SBT")

const [userSbts, setSbts] = useState([])

function loadSbts(index) {
    getUserSBTs("silkking.near").then((newArticles) => {
        setSbts(newArticles)
    })
}

useEffect(() => {
    loadSbts()
    setInterval(() => {
        console.log("Loading sbts interval", Date.now() / 1000)
        loadSbts()
    }, 10000)
}, [])

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Sbts: {userSbts.length}</div>
    {/* <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={() => modifyCommunity(communities[0])}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button> */}
    { userSbts && userSbts.length && <div>
        {userSbts.map((userSbt, index) => 
        {
            return (<div key={index}>{JSON.stringify(userSbt, null, "\n\t")}</div>)
        })}
    </div>}
</>