export const loadState = () => {
  try {
    let serializedState = localStorage.getItem("shinState");
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("shinState", serializedState);
  } catch (error) {
    // IGNORE WRITE ERROR
  }
};
