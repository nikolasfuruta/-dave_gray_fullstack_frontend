import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const noteAdapter = createEntityAdapter({});//for use normalized datas

const initialState = noteAdapter.getInitialState();

//inject endpoint to the apiSlice
export const noteApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //here we define the CRUD methods
    getNote: builder.query({
      query: () => '/note',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: responseData => {
        const loadedNote = responseData.map(note => {
          //alter id format because we are using nosql
          note.id = note._id;
          return note;
        });
        //set the modification
        return noteAdapter.setAll(initialState, loadedNote)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids ) {
          return [
                    { type: 'Note', id: 'LIST' },
                    ...result.ids.map(id => ({ type: 'Note', id }))
                ]
        }
        else  return [{ type: 'Note', id: 'LIST' }]
      }
    }),
  })
});

//custom hooks - crud
export const { useGetNoteQuery } = noteApiSlice;

//selectors - states
//returns the query result obj
export const selectNoteResult = noteApiSlice.endpoints.getNote.select();

//creates memoized selector
const selectNoteData = createSelector(
  selectNoteResult,
  noteResult => noteResult.data //normalized state obj with ids & entities
);

//create selectors
export const {
  selectAll: selectAllNote,
  selectById: selectNoteById,
  selectIds: selectNoteIds
} = noteAdapter.getSelectors(state => selectNoteData(state) ?? initialState);