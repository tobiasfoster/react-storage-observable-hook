import "./App.css";
import useLocalStorageObservable from "./lib/useLocalStorageObservable";

function App() {
  const { on, off, observableLocalStorage, onClear } =
    useLocalStorageObservable();

  return (
    <>
      <button
        onClick={() =>
          on((data) => {
            console.log(data);
          })
        }
      >
        Subscribe
      </button>
      <button onClick={() => off(() => console.log("unsubscribed"))}>
        Unsubscribe
      </button>
      <button onClick={() => observableLocalStorage.setItem("test", "4")}>
        Set Item
      </button>
      <button onClick={() => onClear(() => console.log("cleared"))}>
        Subscribe to clear
      </button>
      <button onClick={() => observableLocalStorage.clear()}>Clear</button>
    </>
  );
}

export default App;
