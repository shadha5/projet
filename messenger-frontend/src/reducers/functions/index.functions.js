/***********************/
/**** LOCAL STORAGE ****/
/***********************/

export const loadState = () => {
  return {
    person: {
      _id: null,
      image: null,
      username: null,
      first_name: null,
      last_name: null,
    },
    contacts: [],
    conversations: [],
    brightness: "light",
    isLoggedIn: false,
  };
};
