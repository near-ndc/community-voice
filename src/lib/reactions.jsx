const { getFromIndex } = VM.require("sayalot.near/widget/lib.socialDbIndex")
const { generateMetadata, updateMetadata, buildDeleteMetadata } = VM.require(
    "sayalot.near/widget/lib.metadata"
  );

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
  const versionData = version ? versions[version] : versions[currentVersion];
  const action = baseAction + versionData.actionSuffix;
  //   console.log(1, version, baseAction, versionData, action);
  return getConfig().isTest ? `test_${action}` : action;
}

const versions = {
    old: {
        normalizationFunction: normalizeOldToV_0_0_1,
        suffixAction: "",
    },
    "0.0.1": {
        normalizationFunction: normalizeFromV0_0_1ToV0_0_2,
        suffixAction: `_v0.0.1`,
    },
};

function fillAction(version) {
    const baseAction = getConfig().baseActions.emoji
    const filledAction = baseAction + version.suffixAction
    return isTest ? `test_${filledAction}` : filledAction
}

function getReactionBlackListByBlockHeight() {
    return [];
}

function filterInvalidReactions(reactions) {
    return reactions
        .filter((reaction) => reaction.value.reactionId) // Has id
        .filter(
            (reaction) =>
                !getReactionBlackListByBlockHeight().includes(reaction.blockHeight) // Blockheight is not in blacklist
        );
}

function getReactions(action, elementReactedId) {
    return getFromIndex(action, elementReactedId)
}

function normalizeEmoji(emoji, versionsIndex) {
    const versionsKeys = Object.keys(versions)
    for (let i = versionsIndex; i < versionsKeys.length; i++) {
        const version = versions[versionsKeys[i]]
        emoji = version.normalizationFunction(emoji)
    }
    return emoji
}

function getLatestEdits(emojis) {
    return emojis.filter((obj) => {
        const userLatestInteraction = emojis.find(
            (emoji) => emoji.accountId === obj.accountId
        );
        return JSON.stringify(userLatestInteraction) === JSON.stringify(obj);
    });
}

function getEmojisNormalized(elementReactedId) {
    return Object.keys(versions).map((version) => {
        const action = fillAction(versions[version]);
        return getReactions(action, elementReactedId).then((allReactions) => {
            const validReactions = filterInvalidReactions(allReactions);

            const latestEdits = getLatestEdits(validReactions);

            const normalizedEmojis = latestEdits.map((emoji) => normalizeEmoji(emoji, versionIndex))

            return normalizedEmojis

        });
    });
}

function groupReactions(reactions, loggedUserAccountId) {
    const userReaction = undefined;
    const accountsGroupedByReaction = {};
    console.log(0, reactions)
    reactions.forEach((reaction) => {
        if (reaction.accountId === loggedUserAccountId) {
            userReaction = reaction;
        }
        console.log(1, reaction)
        const emoji = reaction.value.reaction.split(" ")[0];
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

    return { reactionsStatistics, userReaction };
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
    const normReactionsPromise = getEmojisNormalized(elementReactedId);

    return Promise.all(normReactionsPromise).then((normReactions) => {
        const lastReactions = normReactions.flat()

        const groupedReactions = groupReactions(lastReactions, loggedUserAccountId);
        return groupedReactions
    })
}

function validateEmoji(emoji) {
    const errArrMessage = [];
    if(!emoji) {
        errArrMessage.push("You can only react with an emoji")
    }
    if(!getEmojis().includes(emoji)) {
        errArrMessage.push(`The emoji ${emoji} is not available`)
    }
    return errArrMessage
}

function composeData(reaction) {
    return {
        index: {
            [getAction()]: JSON.stringify({
                key: "main",
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
    idPrefix, author, sbt, versionKey
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
}

return { getEmojis, getReactions, createReaction }