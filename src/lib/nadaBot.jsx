function isHuman(accountId) {
    return true
    // console.log(
    //     Near.view('v1.nadabot.near', 'is_human', { account_id: 'tortum.near' })
    // )
    // return !accountId
    //     ? false
    //     : Near.view('v1.nadabot.near', 'is_human', { account_id: accountId })
}

const Container = styled.div`
    button[disabled] button {
        cursor: not-allowed;
    }
`

const HumanityWrapperButton = ({ children, accountId, ...props }) => {
    const isDisabled = !isHuman(accountId)
    const elemet = (
        <button
            {...props}
            style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                ...props.style,
            }}
            disabled={isDisabled}
        >
            {children}
        </button>
    )

    return isDisabled ? (
        <OverlayTrigger
            placement={'auto'}
            overlay={
                <Tooltip>
                    You cannot perform this action because you are not a
                    verified NADA bot human.
                </Tooltip>
            }
        >
            <Container>{elemet}</Container>
        </OverlayTrigger>
    ) : (
        elemet
    )
}
return { isHuman, HumanityWrapperButton }
