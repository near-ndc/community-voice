const { setIsTest, createCommunity, getCommunities, editCommunity, deleteCommunity } = VM.require("cv.near/widget/lib.Communities")
const { parseError } = VM.require("cv.near/widget/lib.errorParser")

const [communities, setCommunities] = useState([])
const [errors, setErrors] = useState([])
const [intervalId, setIntervalId] = useState(0)

setIsTest(true)

function onCommit() {
    console.log("On commit executed")
}

function onCancel() {
    console.log("On cancel executed")
}

useEffect(() => {
    const waitTime = !communities || communities.length === 0 ? 200 : 5000
    if(intervalId !== 0) {
        clearInterval(intervalId)
    }
    const newIntervalId = setInterval(() => {
        loadCommunities()
    }, waitTime)
    setIntervalId(newIntervalId)
}, [communities])

function loadCommunities() {
    const newCommunities = getCommunities()
    console.log(newCommunities)
    setCommunities(newCommunities)
    
}

function failNewCommunity() {
    const community = {
        name: "", // Should not be empty or undefined
        description: "Description", // Should not be empty or undefined
        type: 0, // Should not be between 0 and 2
        backgroundImage: "https://www.google.com", // Should not be empty or undefined and should be a valid url
        profileImage: "https://www.google.com", // Should not be empty or undefined and should be a valid url
    }

    // const res = createCommunity(community, context.accountId, onCommit, onCancel) // User must be logged in and parameter should be passed
    const res = createCommunity(community, undefined, onCommit, onCancel)
    if (res.error) {
        console.log("Data", res.data)
        setErrors(res.data)
    }
}

function newCommunity() {
    const community = {
        name: "Hello",
        description: "Description",
        type: 0,
        backgroundImage: "https://www.google.com",
        profileImage: "https://www.google.com",
    }

    const res = createCommunity(community, context.accountId, onCommit, onCancel)
    if (res.error) {
        console.log("Data", res.data)
        setErrors(res.data)
    }
}

function modifyCommunity() {
    const community = {
        id: "kenrou-it.testnet-1708116044393",
        name: "Hello edited again",
        description: "Description edited again",
        type: 1,
        backgroundImage: "https://www.google.com.ar",
        profileImage: "https://www.google.com.ar",
    }

    const res = editCommunity(community, onCommit, onCancel)
    if (res.error) {
        console.log("Data", res.data)
        setErrors(res.data)
    }
}

function removeCommunity() {
    const community = {
        id: "kenrou-it.testnet-1708116044393",
        name: "Hello edited again",
        description: "Description edited again",
        type: 1,
        backgroundImage: "https://www.google.com.ar",
        profileImage: "https://www.google.com.ar",
    }

    const res = deleteCommunity(community, onCommit, onCancel)
    console.log("Community removed")
    if (res.error) {
        console.log("Data", res.data)
        setErrors(res.data)
    }
}

return <>
    <div>
    {errors && errors.length ? errors.map((err, index) => {
        return <div key={index}>{err}</div>
    }) : "No error"}
    </div>
    <div>Communities: {communities.length}</div>
    <button onClick={failNewCommunity}>Test fail new community</button>
    <button onClick={newCommunity}>Test new community</button>
    <button onClick={modifyCommunity}>Test edit community</button>
    <button onClick={removeCommunity}>Test remove community</button>
    { communities && communities.length && <div>
        {communities.map((community, index) => 
        {
            return (<div key={index}>{JSON.stringify(community, null, "\n\t")}</div>)
        })}
    </div>}
</>