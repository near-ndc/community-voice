// NDC.NavBar

const {
  handleGoHomeButton,
  handlePillNavigation,
  brand,
  pills,
  navigationButtons,
  isTest,
  displayedTabId,
  writersWhiteList,
  handleFilterArticles,
  filterParameter,
  handleBackButton,
  tabs,
  widgets,
} = props;

function stateUpdate(obj) {
  State.update(obj);
}
/*
  ======================================================PILLS EXAMPLE====================================================
      *Note: the first pill allways has to be the first one displayed*
      pills: [{
          id: string,
          title: string,
      }]    
  ============(When modified to be web app we should delete action to replace it with a propper State.update)============
  
  ======================================================BRAND EXAMPLE====================================================
      brand: {
          homePageId: string,
          brandName: string,
          logoHref: string,
          logoRemWidth: number/string,
          logoRemHeight: number/string,
      }
      
  ============(When modified to be web app we should delete action to replace it with a propper State.update)============
  */

const loggedUserAccountId = context.accountId;

// const canLoggedUserCreateArticle = state.canLoggedUserCreateArticle;

const logoRemWidth = brand.logoRemWidth
  ? brand.logoRemWidth + "rem"
  : undefined;
const logoRemHeight = brand.logoRemHeight
  ? brand.logoRemHeight + "rem"
  : undefined;

if (
  !stateUpdate ||
  !(displayedTabId + "") ||
  !pills ||
  (brand && (!brand.logoHref || !(brand.homePageId + "")))
) {
  const crucialPropMissingMsg = "The following crucial props are missing:";
  return (
    <div>
      <h3 className="text-danger">{crucialPropMissingMsg}</h3>
      <ul>
        {!stateUpdate && <li className="text-danger">stateUpdate</li>}

        {!(displayedTabId + "") && (
          <li className="text-danger">displayedTabId</li>
        )}

        {!pills && <li className="text-danger">pills</li>}

        {brand && !brand.logoHref && (
          <li className="text-danger">brand.logoHref</li>
        )}

        {brand && !(brand.homePageId + "") && (
          <li className="text-danger">brand.homePageId</li>
        )}
      </ul>
    </div>
  );
}

//============================================Styled components==================================================
const BrandLogoContainer = styled.div`
      width: ${logoRemWidth ?? "4rem"};
      height: ${logoRemHeight ?? "4rem"};
      cursor: pointer;
  `;

const activeColor = "#9333EA";

const Pill = styled.div`
      font-family: system-ui;
      font-weight: 500;
      font-size: 1.2rem;
      line-height: 24px;
      color: black;
      cursor: pointer;
      user-select: none;
  
      &:hover {
          color: ${activeColor};
      }
  `;

const StylessATag = styled.a`
      &:hover {
          text-decoration: none;
      }
  `;

const BackButton = styled.div`
    cursor: pointer;
  `;

const CallLibrary = styled.div`
    display: none;
  `;
//============================================End styled components==============================================

//=================================================Components====================================================

const renderButton = (button, i) => {
  return (
    <Widget
      src={widgets.views.standardWidgets.styledComponents}
      props={{
        Button: {
          size: "big",
          onClick: () => {
            handlePillNavigation(button.id);
            State.update({
              selectedButtonIndex: i,
            });
          },
          text: button.title,
          className:
            state.selectedButtonIndex == i ? "primary light" : "primary dark",
        },
      }}
    />
  );
};
//==============================================End components===================================================

//==================================================FUNCTIONS====================================================

function realHandleBackButton() {
  State.update({
    selectedButtonIndex: undefined,
  });

  handleBackButton();
}

function realHandleGoHome() {
  State.update({
    selectedButtonIndex: undefined,
  });
  handleGoHomeButton();
}

//================================================END FUNCTIONS===================================================
return (
  <>
    <div className="navbar navbar-expand-md border-bottom mb-3">
      <div className="container-fluid">
        {brand && (
          <BrandLogoContainer
            className="navbar-brand text-decoration-none"
            onClick={handleGoHomeButton}
          >
            <Widget
              src={widgets.views.standardWidgets.navBarImg}
              props={{
                // image: metadata.image,
                className: "w-100 h-100",
                style: {
                  objectFit: "cover",
                },
                thumbnail: false,
                fallbackUrl: brand.logoHref,
                alt: brand.brandName ?? "",
              }}
            />
          </BrandLogoContainer>
        )}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-center"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            {pills &&
              pills.map((pill, i) => {
                return !(pill.id + "") || !pill.title ? (
                  <p className="text-danger border">Pill passed wrong</p>
                ) : (
                  <li className="nav-item">
                    <Pill
                      style={
                        pill.id === displayedTabId ? { color: activeColor } : {}
                      }
                      onClick={() => {
                        //First one is set to be de "Home" one
                        if (pill.id == 0) {
                          const filter = { filterBy: "" };
                          handleFilterArticles(filter);
                        } else {
                          handlePillNavigation(pill.id);
                        }
                        State.update({
                          selectedButtonIndex: undefined,
                        });
                      }}
                      className={`nav-link ${
                        pill.id === displayedTabId
                          ? "active text-decoration-underline"
                          : "text-decoration-none"
                      } `}
                    >
                      {pill.title}
                    </Pill>
                  </li>
                );
              })}
            {/*navigationButtons &&
              loggedUserAccountId &&
              canLoggedUserCreateArticle &&
              navigationButtons.map((button, i) => {
                return !(button.id + "") || !button.title ? (
                  <p className="text-danger border">Button passed wrong</p>
                ) : (
                  <div className="d-block d-md-none">
                    {renderButton(button, i)}
                  </div>
                );
              })*/}
          </ul>
        </div>
        {
          // navigationButtons &&
          // loggedUserAccountId &&
          // canLoggedUserCreateArticle &&
          // navigationButtons.map((button, i) => {
          //   return !(button.id + "") || !button.title ? (
          //     <p className="text-danger border">Button passed wrong</p>
          //   ) : (
          //     <div className="d-none d-md-block">{renderButton(button, i)}</div>
          //   );
          // })
        }
      </div>
    </div>

    {(((filterParameter == "tag" || filterParameter == "author") &&
      displayedTabId == tabs.SHOW_ARTICLES_LIST.id) ||
      displayedTabId == tabs.SHOW_ARTICLE.id ||
      displayedTabId == tabs.ARTICLE_WORKSHOP.id ||
      displayedTabId == tabs.SHOW_ARTICLES_LIST_BY_AUTHORS.id) && (
      <BackButton
        style={{ cursor: "pointer" }}
        onClick={
          displayedTabId == tabs.SHOW_ARTICLE.id ||
          (editArticleData && tabs.ARTICLE_WORKSHOP.id)
            ? realHandleBackButton
            : realHandleGoHome
        }
        className="my-3"
      >
        <i className="bi bi-chevron-left mr-2"></i>
        Back
      </BackButton>
    )}
  </>
);
