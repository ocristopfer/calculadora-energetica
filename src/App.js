import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./App.module.css";
import { Inputs, NavBar } from "./components";

function App() {
  return (
    <>
      <NavBar></NavBar>
      <br />
      <div className={styles.App}>
        <Inputs></Inputs>
      </div>
    </>
  );
}

export default App;
