const { ProfileOverlayTrigger } = VM.require(
  "sayalot.near/widget/bosTest.Profile.OverlayTrigger"
);

const { ElementUser } = VM.require("sayalot.near/widget/bosTest.ElementUser");

const account = "blaze.near";

var accounts = [];

for (var i = 1; i <= 100; i++) {
  accounts.push("blaze.near");
}

const children = (account) => {
  return <div>Children {account}</div>;
};

const inner = (
  <div className="d-flex flex-row mx-1">
    {ElementUser({
      accountId,
      options: {
        showHumanBadge: true,
        showImage: true,
        showSocialName: true,
        shortenLength: 20,
      },
    })}
  </div>
);

function stateUpdate(obj) {
  State.update(obj);
}

State.init({
  showIndex: -1,
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

return (
  <>
    <h1>Render:</h1>
    {accounts.map((account, index) => {
      return (
        <Container>
          <ProfileOverlayTrigger
            accountId={account}
            key={index}
            stateUpdate={stateUpdate}
            show={state.showIndex === index}
            index={index}
          >
            {inner}
          </ProfileOverlayTrigger>
        </Container>
      );
      // return <>{children(account)}</>;
    })}
  </>
);
