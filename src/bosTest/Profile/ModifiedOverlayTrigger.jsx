const { ProfilePopover } = VM.require(
  "sayalot.near/widget/bosTest.Profile.Popover"
);

function ProfileOverlayTrigger(props) {
  
  const handleOnMouseEnter = () => {
    props.stateUpdate({ showIndex: props.index })
    // State.update({ show: true });
  };
  const handleOnMouseLeave = () => {
    // State.update({ show: false });
    props.stateUpdate({ showIndex: -1 });
  };

  // State.init({
  //   show: false,
  // });

  const maxWidth = props.maxWidth ?? "60%";

  const overlay = (
    <div
      className="border m-3 p-3 rounded-4 bg-white shadow"
      style={{ maxWidth: "24em", zIndex: 1070 }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
    >
      {ProfilePopover({ accountId: props.accountId })}
    </div>
  );

  return (
    <OverlayTrigger
      show={props.show}
      trigger={["hover", "focus"]}
      delay={{ show: 250, hide: 300 }}
      placement="auto"
      overlay={overlay}
    >
      <span
        className="d-inline-flex"
        style={{ maxWidth: maxWidth }}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {props.children}
      </span>
    </OverlayTrigger>
  );
}

return { ProfileOverlayTrigger };
