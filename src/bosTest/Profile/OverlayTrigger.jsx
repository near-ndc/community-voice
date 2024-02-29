const { CommonOverlayTrigger } = VM.require(
  "sayalot.near/widget/bosTest.N.Common.OverlayTrigger"
);
const { ProfilePopover } = VM.require(
  "sayalot.near/widget/bosTest.Profile.Popover"
);

function ProfileOverlayTrigger(props) {
  return (
    <CommonOverlayTrigger
      loading={props.children}
      popup={<ProfilePopover accountId={props.accountId} />}
      {...props}
    />
  );
}

return { ProfileOverlayTrigger };
