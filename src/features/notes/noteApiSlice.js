import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const notesAdapter = createEntityAdapter({
  sortComparer: (a,b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)
});//for use normalized datas

const initialState = notesAdapter.getInitialState();

//inject endpoint to the apiSlice
export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //here we define the CRUD methods
    getNotes: builder.query({
      query: () => '/notes',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,
      transformResponse: responseData => {
        const loadedNote = responseData.map(note => {
          //alter id format because we are using nosql
          note.id = note._id;
          return note;
        });
        //set the modification
        return notesAdapter.setAll(initialState, loadedNote)
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
    addNewNote: builder.mutation({
      query: initialNoteData => ({
        url: '/notes',
        method: 'POST',
        body: { ...initialNoteData }
      }),
      invalidatesTags: [
        { type: 'Note', id: 'LIST' }
      ]
    }),
    updateNote: builder.mutation({
      query: initialNoteData => ({
        url: '/notes',
        method: 'PATCH',
        body: { ...initialNoteData }
      }),
      invalidatesTags: (result, error, arg) => [
        { type:'Note', id: arg.id }
      ]
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: '/notes',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type:'Note', id: arg.id }
      ]
    })
  })
});

//custom hooks - crud
export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice;

//selectors - states
//returns the query result obj
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select();

//creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  noteResult => noteResult.data //normalized state obj with ids & entities
);

//create selectors
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
} = notesAdapter.getSelectors(state => selectNotesData(state) ?? initialState);