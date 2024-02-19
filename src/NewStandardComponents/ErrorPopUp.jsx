// ErrorPopUp

const { RenderButton } = VM.require(
  "f2bc8abdb8ba64fe5aac9689ded9491ff0e6fdcd7a5c680b7cf364142d1789fb/widget/Input.Button"
);

function RenderPopUp(msg, closePopUpFunction) {
  const ModalCard = styled.div`
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
  `;
  const ModalContainer = styled.div`
    display: flex;
    width: 400px;
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 10px;
    background: #fff;
    border: 1px solid transparent;
    margin-left: auto;
    margin-right: auto;
    margin-buttom: 50%;
    @media only screen and (max-width: 480px) {
      width: 90%;
    }
  `;
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    align-self: stretch;
  `;
  const Footer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: end;
    gap: 16px;
    align-self: stretch;
  `;

  return (
    <ModalCard>
      <ModalContainer>
        <h1 className="text-danger">Error:</h1>
        <Container>
          <span>{msg}</span>
          <Footer>
            {RenderButton({ children: "Ok", onClick: closePopUpFunction })}
          </Footer>
        </Container>
      </ModalContainer>
    </ModalCard>
  );
}

return { RenderPopUp };
