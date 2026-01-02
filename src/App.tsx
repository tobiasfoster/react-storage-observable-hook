import "./App.css";
import useLocalStorageObservable from "./lib/useLocalStorageObservable";

function App() {
  const { on, off, observableLocalStorage } = useLocalStorageObservable();

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
      <button>Get Item</button>
      <button>Remove Item</button>
      <button>Clear</button>
      <button>Key</button>
      <button>Length</button>
      <button>Item</button>
    </>
  );
}

export default App;
