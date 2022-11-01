import { Store } from "pullstate";

const UIStore = new Store({
  current: null,
  loading: true,
});

const DataStore = new Store({
  user: {},
  todos: [],
});

const store = {
  ui: UIStore,
  data: DataStore,
};

export default store;
