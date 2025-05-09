const { getSBTWhiteList, isValidUser, getUserSBTs } = VM.require(
    'chatter.cheddar.near/widget/lib.SBT'
)

const { displayTestsResults } = VM.require(
    'chatter.cheddar.near/widget/tests.lib.tester'
)

function testGetSBTWhiteListWorking() {
    const fnName = 'testGetSBTWhiteListWorking'

    let functionGetSBTWhiteList
    try {
        functionGetSBTWhiteList = getSBTWhiteList()
    } catch (err) {
        return {
            isError: true,
            msg: err.message,
            fnName,
        }
    }

    const expectedWhiteList = [
        {
            value: 'fractal.i-am-human.near - class 1',
            title: 'General',
            default: true,
        },
        { value: 'community.i-am-human.near - class 1', title: 'OG' },
        { value: 'community.i-am-human.near - class 2', title: 'Contributor' },
        {
            value: 'community.i-am-human.near - class 3',
            title: 'Core Contributor',
        },
        { value: 'elections.ndc-gwg.near - class 2', title: 'HoM' },
        { value: 'elections.ndc-gwg.near - class 3', title: 'CoA' },
        { value: 'elections.ndc-gwg.near - class 4', title: 'TC' },
        { value: 'public', title: 'Public' },
    ]

    const isError =
        JSON.stringify(functionGetSBTWhiteList) !==
        JSON.stringify(expectedWhiteList)
    return {
        isError: isError,
        msg: isError
            ? `Items don't match output ${functionGetSBTWhiteList}, expected ${expectedWhiteList}`
            : '',
        fnName,
    }
}

function testIsValidUserReturningCorrectly() {
    const fnName = 'testIsValidUserReturningCorrectly'

    const selectedSBTToCheckCredentials = ['fractal.i-am-human.near - class 1']

    let functionIsValidUser
    try {
        functionIsValidUser = isValidUser(
            'blaze.near',
            selectedSBTToCheckCredentials
        )
    } catch (err) {
        return {
            isError: true,
            msg: err.message,
            fnName,
        }
    }

    const expectedBlazeCredentials04D03M2024Y = {
        'fractal.i-am-human.near - class 1': true,
        'community.i-am-human.near - class 1': true,
        'community.i-am-human.near - class 2': true,
        'community.i-am-human.near - class 3': false,
        'elections.ndc-gwg.near - class 2': false,
        'elections.ndc-gwg.near - class 3': true,
        'elections.ndc-gwg.near - class 4': false,
        public: true,
    }

    const isError =
        functionIsValidUser !==
        expectedBlazeCredentials04D03M2024Y[selectedSBTToCheckCredentials]
    return {
        isError: isError,
        msg: isError
            ? `Blaze ${expectedBlazeCredentials04D03M2024Y[selectedSBTToCheckCredentials] ? 'do' : "doesn't"} have the following SBT: ${selectedSBTToCheckCredentials} and it's returning ${functionIsValidUser}`
            : '',
        fnName,
    }
}

return (
    <>
        {displayTestsResults([
            {
                fnName: 'testGetSBTWhiteListWorking',
                fn: testGetSBTWhiteListWorking,
            },
            {
                fnName: 'testIsValidUserReturningCorrectly',
                fn: testIsValidUserReturningCorrectly,
            },
        ])}
    </>
)
