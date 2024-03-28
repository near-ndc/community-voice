//lib.notifications
function extractMentions(text) {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  mentionRegex.lastIndex = 0;
  const accountIds = new Set();
  for (const match of text.matchAll(mentionRegex)) {
    if (
      !/[\w`]/.test(match.input.charAt(match.index - 1)) &&
      !/[/\w`]/.test(match.input.charAt(match.index + match[0].length)) &&
      match[1].length >= 2 &&
      match[1].length <= 64
    ) {
      accountIds.add(match[1].toLowerCase());
    }
  }
  return [...accountIds];
}

function joinPeoplesName(usersToNotify) {
  if (usersToNotify.length === 1) return `@${usersToNotify[0]}`;

  return usersToNotify.reduce((acc, user, index) => {
    if(index === usersToNotify.length - 1) {
      acc += ` and `;
    } else if(index !== 0) {
      acc += `, `;
    }

    return `${acc}@${user}`
  }, "");
}

function getNotificationData(config, notificationType, usersToNotify, metadata, extraParams) {
  const { author } = extraParams;

  const baseURL = `https://near.org/${config.forumURL}?${config.isTest ? "isTest=true" : ""}`

  const notificationTypeText = {
    mention: {
      text: `I have mentioned ${joinPeoplesName(usersToNotify)} in this post: `,
      url: `${baseURL}&said=${metadata.id}`
    },
    mentionOnComment: {
      text: `I have mentioned ${joinPeoplesName(usersToNotify)} on my comment on this post: `,
      url: `${baseURL}&said=${metadata.articleId}&scid=${metadata.id}`
    },
    upVote: {
      text: "I have upVoted this post: ",
      url: `${baseURL}said=${metadata.articleId}`
    },
    // emoji: {
    //   text: "I have reacted to this post: ",
    //   url: ``},
    comment: {
      text: "I have commented this post: ",
      url: `${baseURL}said=${metadata.articleId}&scid=${metadata.id}`
    },
  };

  if(author && !usersToNotify.includes(author)) {
    usersToNotify.push(author);
  }

  const dataToAdd = {
    post: {
      main: JSON.stringify({
        type: "md",
        text: `${notificationTypeText[notificationType].text} ${notificationTypeText[notificationType].url}`,
      }),
    },
    index: {
      notify: JSON.stringify(
        usersToNotify.map((user) => {
          return {
            key: user,
            value: {
              type: "mention",
              item: {
                type: "social",
                path: `${metadata.author}/post/main`,
              },
            },
          };
        })
      ),
    },
  };

  return dataToAdd;
}

return {
  extractMentions,
  getNotificationData,
  functionsToTest: {joinPeoplesName},
};
