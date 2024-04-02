const { camelCaseToUserReadable, isValidUrl } = VM.require("communityvoice.ndctools.near/widget/lib.strings");
const { generateMetadata, updateMetadata } = VM.require("communityvoice.ndctools.near/widget/lib.metadata");

const baseAction = "cv_communities";
const testAction = `test_${baseAction}`
const prodAction = `dev_${baseAction}`
const version = "0.0.1"

let isTest = false

function getCommunitiesTypes() {
    return [
        {
            id: 0,
            title: "Public",
            description: "Anyone can view, post and comment."
        },
        {
            id: 1,
            title: "Restricted",
            description: "Anyone can view this community, but only approved members can post."
        },
        {
            id: 2,
            title: "Private access",
            description: "Only approved users can view and post in this community."
        }
]
}

function getAction() {
    const envAction = isTest ? testAction : prodAction
    return `${envAction}_v${version}`
}

function setIsTest(value) {
    isTest = value
}

function validateCommunityData(communityData) {
    const expectedStringProperties = [
        "name",
        "description",
        "backgroundImage",
        "profileImage"
    ]
    const expectedUrlProperties = [
        "backgroundImage",
        "profileImage"
    ]
    const isTypeOk = 0 <= communityData.type && communityData.type < getCommunitiesTypes().length
    const errArrMessage = []
    // String properties
    errArrMessage.push(...expectedStringProperties.map((currentProperty) => {
        const isValidProperty = communityData[currentProperty]
        if (!isValidProperty) return `Missing ${camelCaseToUserReadable(currentProperty)}`
        return undefined
    }).filter((str) => str !== undefined))
    // Url properties
    errArrMessage.push(...expectedUrlProperties.map((currentProperty) => {
        const isValidProperty = isValidUrl(communityData[currentProperty])
        if (!isValidProperty) return `Invalid url for ${camelCaseToUserReadable(currentProperty)}`
        return undefined
    }).filter((str) => str !== undefined))
    if (!isTypeOk) {
        errArrMessage.push("Type should be between 0 and 2")
    }
    return errArrMessage
}

function composeData(communityData, metadata) {
    let data = {
        index: {
            [getAction()]: JSON.stringify({
                key: "main",
                value: {
                    communityData,
                    metadata,
                },
            }),
        },
    };

    return data;
}

function composeDeleteData(communityData) {
    let data = {
        index: {
            [getAction()]: JSON.stringify({
                key: "main",
                value: {
                    communityData: {
                        id: communityData.id
                    },
                    isDelete: true
                },
            }),
        },
    };

    return data;
}

function executeSaveCommunity(communityData, metadata, onCommit, onCancel) {
    const newData = composeData(communityData, metadata);
    Social.set(newData, {
        force: true,
        onCommit,
        onCancel,
    });
};

function executeDeleteCommunity(communityData, onCommit, onCancel) {
    const newData = composeDeleteData(communityData)

    Social.set(newData, {
        force: true,
        onCommit,
        onCancel,
    });
}

/**
 * 
 * @param {*} communityData 
 * @param {*} ownerId Context doesn't seem to work on imported widgets
 * @param {*} onCommit 
 * @param {*} onCancel 
 * @returns 
 */
function createCommunity(communityData, ownerId, onCommit, onCancel) {
    const errors = validateCommunityData(communityData);
    if (!ownerId) {
        return { error: true, data: ["Owner id not shared"] }
    }
    if (errors && errors.length) {
        return { error: true, data: errors }
    }
    if (communityData.id) {
        return { error: true, data: ["There is already a community with this id"] }
    }

    communityData.id = `cd/${ownerId}/${Date.now()}`
    const metadata = generateMetadata()
    executeSaveCommunity(communityData, metadata, onCommit, onCancel)

    const result = "Community created successfully"
    return { error: false, data: result };
}

/**
 * 
 * @returns It might return first null and then an empty array and finally an array containing the index structure of communities
 */
function getCommunities() {
    const action = getAction()
    const communities = Social.index(action, "main", {
        order: "desc",
        subscribe,
        // limit: 10,
    }) || []

    return processCommunities(communities)
}

function processCommunities(communitiesIndexes) {
    const validCommunities = filterValidCommunities(communitiesIndexes)
    const latestEdit = getLatestEdit(validCommunities)
    const nonDeletedLatest = removeDeleted(latestEdit)

    return nonDeletedLatest
}

function filterValidCommunities(communitiesIndexes) {
    const accountIdMatch = filterAccountIdWithCommunityId(communitiesIndexes)

    return accountIdMatch
}

function filterAccountIdWithCommunityId(communitiesIndexes) {
    return communitiesIndexes.filter((communityIndex) => {
        return communityIndex.value.communityData.id.startsWith(communityIndex.accountId)
    })
}

function getLatestEdit(communitiesIndexes) {
    return communitiesIndexes.filter((communityIndex, index) => {
        return communitiesIndexes.findIndex((communityIndex2) => {
            return communityIndex.value.communityData.id === communityIndex2.value.communityData.id
        }) === index
    })
}

function removeDeleted(communitiesIndexes) {
    return communitiesIndexes.filter((communityIndex) => {
        return !communityIndex.value.isDelete
    })
}

function editCommunity(communityIndex, onCommit, onCancel) {
    const communityData = communityIndex.value.communityData;
    const errors = validateCommunityData(communityData);
    if (errors && errors.length) {
        return { error: true, data: errors }
    }
    if (!communityData.id) {
        return { error: true, data: ["Community id not provided"] }
    }

    const metadata = updateMetadata(communityIndex.value.metadata)
    executeSaveCommunity(communityData, metadata, onCommit, onCancel)
    const result = "Community edited successfully"
    return { error: false, data: result };
}

function deleteCommunity(communityData, onCommit, onCancel) {
    if (!communityData.id) {
        return { error: true, data: ["Community id not provided"] }
    }

    executeDeleteCommunity(communityData, onCommit, onCancel)
    const result = "Community removed successfully"
    return { error: false, data: result };
}

return { setIsTest, createCommunity, getCommunities, editCommunity, deleteCommunity }