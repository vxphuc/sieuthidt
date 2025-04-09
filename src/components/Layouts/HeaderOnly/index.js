import Header from "./Header";

function HeaderOnly({ children }) {
  return (
    <div>
      <div>
        <Header></Header>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default HeaderOnly;
