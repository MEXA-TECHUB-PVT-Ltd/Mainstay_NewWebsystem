import { Spinner } from "reactstrap";

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    <Spinner color="primary" />
  </div>
);

export default Loader;
