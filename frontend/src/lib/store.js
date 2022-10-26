import { Store } from "pullstate";

const UIStore = new Store({
  current: null,
});

const DataStore = new Store({
  user: {},
});

const GlobalStore = {
  ui: UIStore,
  data: DataStore,
};

export default GlobalStore;
