const { ImageTool } = VM.require("sayalot.near/widget/bosTest.Image");
const { ProfileOverlayTrigger } = VM.require(
  "sayalot.near/widget/bosTest.Profile.OverlayTrigger"
);

function ProfileImage(props) {
  const accountId = props.accountId ?? context.accountId;
  const className = props.className ?? "profile-image d-inline-block";
  const style = props.style ?? { width: "3em", height: "3em" };
  const imageStyle = props.imageStyle ?? { objectFit: "cover" };
  const imageClassName = props.imageClassName ?? "rounded-circle w-100 h-100";
  const thumbnail = props.thumbnail ?? "thumbnail";

  const profile = props.profile ?? Social.getr(`${accountId}/profile`);

  const name = profile.name || "No-name profile";
  const image = profile.image;
  const title = props.title ?? `${name} @${accountId}`;
  const tooltip =
    props.tooltip && (props.tooltip === true ? title : props.tooltip);
  const fast = props.fast || (!props.profile && !!accountId);
  // if (accountId !== state.accountId) {
  //   State.update({
  //     fastImageUrl: `https://i.near.social/magic/${
  //       thumbnail || "large"
  //     }/https://near.social/magic/img/account/${accountId}`,
  //     accountId,
  //   });
  // }

  const fastImageUrl = `https://i.near.social/magic/${
    thumbnail || "large"
  }/https://near.social/magic/img/account/${accountId}`;

  const fallbackUrl =
    "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm";

  // const inner = fast ? (
  const inner = true ? (
    <div className={className} style={style} key={fastImageUrl}>
      <img
        className={imageClassName}
        style={imageStyle}
        src={fastImageUrl}
        alt={title}
        // onError={() => {
        //   if (fastImageUrl !== fallbackUrl) {
        //     State.update({
        //       fastImageUrl: fallbackUrl,
        //     });
        //   }
        // }}
      />
    </div>
  ) : (
    <div className={className} style={style} key={JSON.stringify(image)}>
      {ImageTool({
        image,
        alt: title,
        className: imageClassName,
        style: imageStyle,
        thumbnail,
        fallbackUrl,
      })}
    </div>
  );

  return props.tooltip ? (
    <>{ProfileOverlayTrigger({ accountId, inner })}</>
  ) : (
    inner
  );
}

return { ProfileImage };
