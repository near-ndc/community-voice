const { getFromIndex } = VM.require("communityvoice.ndctools.near/widget/lib.socialDbIndex")
const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
    "communityvoice.ndctools.near/widget/lib.metadata"
);
const { normalizeId } = VM.require("communityvoice.ndctools.near/widget/lib.normalization")

let config = {}
const ID_PREFIX = "reaction"
const CURRENT_VERSION = "v0.0.2"

function setConfig(value) {
    config = value
}

function getConfig() {
    return config
}

function getAction(version) {
    const baseAction = getConfig().baseActions.reaction;
    const versionData = version ? versions[version] : versions[CURRENT_VERSION];
    const action = baseAction + versionData.actionSuffix;
    return getConfig().isTest ? `test_${action}` : action;
}

function normalizeOldToV_0_0_1(reaction) {
    reaction.value.sbts = ["public"];

    return reaction;
}

function normalizeFromV0_0_1ToV0_0_2(reaction, extraParams) {
    const { elementReactedId } = extraParams
    const reactionData = {
        emoji: reaction.value.reaction,
        elementReactedId,
    }

    const split = reaction.value.reactionId.split("-")
    const createdTimestamp = parseInt(split[split.length - 1])

    const metadata = {
        id: normalizeId(reaction.value.reactionId, ID_PREFIX),
        author: reaction.accountId,
        createdTimestamp: createdTimestamp,
        lastEditTimestamp: createdTimestamp,
        versionKey: "v0.0.2"
    }
    return {
        ...reaction,
        value: {
            reactionData,
            metadata
        }
    }
}

function normalizeFromV0_0_2ToV0_0_3(reaction) {
    return reaction
}

const versions = {
    old: {
        normalizationFunction: normalizeOldToV_0_0_1,
        actionSuffix: "",
    },
    "v0.0.1": {
        normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
        actionSuffix: `_v0.0.1`,
    },
    "v0.0.2": {
        normalizationFunction: normalizeFromV0_0_2ToV0_0_3,
        actionSuffix: `_v0.0.2`,
    }
};

function fillAction(version) {
    const baseAction = getConfig().baseActions.reaction
    const filledAction = baseAction + version.actionSuffix
    return getConfig().isTest ? `test_${filledAction}` : filledAction
}

function getReactionBlackListByBlockHeight() {
    return [];
}

function filterInvalidReactions(reactions) {
    return reactions
        .filter((reaction) => reaction.value.reactionId || reaction.value.metadata.id) // Has id
        .filter(
            (reaction) =>
                !getReactionBlackListByBlockHeight().includes(reaction.blockHeight) // Blockheight is not in blacklist
        );
}

function normalizeReaction(reaction, versionsIndex, elementReactedId) {
    const extraParams = { elementReactedId }
    const versionsKeys = Object.keys(versions)
    for (let i = versionsIndex; i < versionsKeys.length; i++) {
        const version = versions[versionsKeys[i]]
        reaction = version.normalizationFunction(reaction, extraParams)
    }
    return reaction
}

function getLatestEdits(reactions) {
    return reactions.filter((obj) => {
        const userLatestInteraction = reactions.find(
            (reaction) => reaction.accountId === obj.accountId
        );
        return JSON.stringify(userLatestInteraction) === JSON.stringify(obj);
    });
}

function getReactionsNormalized(elementReactedId) {
    return Object.keys(versions).map((version, versionIndex) => {
        const action = fillAction(versions[version]);
        return getFromIndex(action, elementReactedId).then((allReactions) => {
            const validReactions = filterInvalidReactions(allReactions);

            const latestEdits = getLatestEdits(validReactions);

            const normalizedReactions = latestEdits.map((reaction) => normalizeReaction(reaction, versionIndex, elementReactedId))

            return normalizedReactions

        });
    });
}

function groupReactions(reactions, loggedUserAccountId) {
    const userEmoji = undefined;
    const accountsGroupedByReaction = {};
    reactions.forEach((reaction) => {
        const emoji = reaction.value.reactionData.emoji.split(" ")[0];
        if (reaction.accountId === loggedUserAccountId) {
            userEmoji = emoji;
        }
        if (!accountsGroupedByReaction[emoji]) {
            accountsGroupedByReaction[emoji] = [];
        }
        accountsGroupedByReaction[emoji].push(reaction.accountId);
    });
    const reactionsStatistics = Object.keys(accountsGroupedByReaction).map(
        (reaction) => {
            return {
                accounts: accountsGroupedByReaction[reaction],
                emoji: reaction,
            };
        }
    );

    return { reactionsStatistics, userEmoji };
}

function getInitialEmoji() {
    return "🤍 Like";
}

function getEmojis() {
    return [
        "❤️ Positive",
        "🙏 Thank you",
        "💯 Definitely",
        "👀 Thinking",
        "🔥 Awesome",
        "👍 Like",
        "🙌 Celebrate",
        "👏 Applause",
        "⚡ Lightning",
        "⋈ Bowtie",
    ]
}

function getReactions(config, elementReactedId, loggedUserAccountId) {
    setConfig(config)
    const normReactionsPromise = getReactionsNormalized(elementReactedId);

    return Promise.all(normReactionsPromise).then((normReactions) => {
        const lastReactions = normReactions.flat()

        const groupedReactions = groupReactions(lastReactions, loggedUserAccountId);
        return groupedReactions
    })
}

function validateEmoji(emoji) {
    const errArrMessage = [];
    if (!emoji) {
        errArrMessage.push("You can only react with an emoji")
    }
    if (!getEmojis().includes(emoji)) {
        errArrMessage.push(`The emoji ${emoji} is not available`)
    }
    return errArrMessage
}

function composeData(reaction) {
    return {
        index: {
            [getAction()]: JSON.stringify({
                key: reaction.reactionData.elementReactedId,
                value: {
                    ...reaction,
                },
            }),
        },
    };
}

/**
 * 
 * @param {*} emoji 
 * @param {*} elementReactedId May be an article or a comment
 * @param {*} onCommit 
 * @param {*} onCancel 
 */
function createReaction(config, emoji, elementReactedId, author, onCommit, onCancel) {
    setConfig(config)
    const errors = validateEmoji(emoji)
    if (errors && errors.length) {
        return { error: true, data: errors };
    }

    const metadata = generateMetadata({
        idPrefix: ID_PREFIX,
        author,
        versionKey: CURRENT_VERSION
    })

    const reaction = {
        reactionData: {
            emoji,
            elementReactedId
        },
        metadata,
    };

    const data = composeData(reaction)

    Social.set(data, {
        force: true,
        onCommit,
        onCancel,
    });

    return { error: false, data: "Reaction created successfully" };

}

return { getEmojis, getReactions, createReaction }