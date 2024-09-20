import {createSlice} from '@reduxjs/toolkit';
import {ContactsArray} from './ContactsTypes';

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    currentContact: '',
    contactsArray: [],
  } as ContactsArray,
  reducers: {
    setContacts(state, action) {
      state.contactsArray = [...state.contactsArray, ...action.payload];
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
  },
});

export const {setContacts, setCurrentContact} = contactsSlice.actions;
export default contactsSlice.reducer;
