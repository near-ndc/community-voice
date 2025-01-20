function isHuman(accountId) {
    if (!accountId) {
        return false
    }
    const isUniqueId = useCache(
        () =>
            asyncFetch(
                `https://api.holonym.io/sybil-resistance/gov-id/near?action-id=123456789&user=${accountId}`
            ).then((res) => res.isUniqueId),
        accountId + 'holonym_gov_id',
        { subscribe: false }
    )
    const isUniquePhone = useCache(
        () =>
            asyncFetch(
                `https://api.holonym.io/sybil-resistance/phone/near?action-id=123456789&user=${accountId}`
            ).then((res) => res?.isUniquePhone),
        accountId + 'holonym_phone',
        { subscribe: false }
    )
    const isNadabotHuman = useCache(
        () =>
            Near.asyncView('v1.nadabot.near', 'is_human', {
                account_id: accountId,
            }).then((res) => res),
        accountId + 'is_human',
        { subscribe: false }
    )
    return isUniqueId || isUniquePhone || isNadabotHuman
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
                    You cannot perform this action because you are neither a
                    verified NADA bot user nor Holonym-verified.
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
