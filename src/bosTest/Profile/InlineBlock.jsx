const {ProfileImage} = VM.require("sayalot.near/widget/bosTest.ProfileImage");
const {Checkmark} = VM.require("sayalot.near/widget/bosTest.Checkmark");

function ProfileInlineBlock(props) {
  const accountId = props.accountId ?? context.accountId;

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);
  const fast = props.fast ?? !props.profile;

  const name = profile.name;
  const description = profile.description;
  const tags = Object.keys(profile.tags ?? {});

  const imgWrapperStyle = { height: "3em", width: "3em" };

  return (
    <div className="d-flex flex-row">
      <div className="me-2">
        {ProfileImage({
          fast,
          profile,
          accountId,
          widgetName,
          style: imgWrapperStyle,
          imageClassName: "rounded-circle w-100 h-100",
        })}
      </div>
      <div className="text-truncate">
        <div className="text-truncate">
          <span className="fw-bold">{name}</span>
          {Checkmark({ accountId })}
          <small>
            <span className="font-monospace">@{accountId}</span>
          </small>
        </div>
        <div className="text-truncate text-muted">
          {tags.length > 0 && (
            <>
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="me-1 fw-light badge border border-secondary text-bg-light"
                >
                  #{tag}
                </span>
              ))}
            </>
          )}
          {!props.hideDescription && description}
        </div>
      </div>
    </div>
  );
}

return { ProfileInlineBlock };
