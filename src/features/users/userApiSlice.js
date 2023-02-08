import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const usersAdapter = createEntityAdapter({});//for use normalized datas

const initialState = usersAdapter.getInitialState();

//inject endpoint to the apiSlice
export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    //here we define the CRUD methods
    getUsers: builder.query({
      query: () => '/users',
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      //keepUnusedDataFor: 5,
      transformResponse: responseData => {
        const loadedUsers = responseData.map(user => {
          //alter id format because we are using nosql
          user.id = user._id;
          return user;
        });
        //set the modification
        console.log('fetch users')
        return usersAdapter.setAll(initialState, loadedUsers)
      },
      providesTags: (result, error, arg) => {
        if(result?.ids ) {
          return [
                    { type: 'User', id: 'LIST' },
                    ...result.ids.map(id => ({ type: 'User', id }))
                ]
        }
        else  return [{ type: 'User', id: 'LIST' }]
      }
    }),
    addNewUser: builder.mutation({
      query: initialUserData => ({
        url: '/users',
        method: 'POST',
        body: { ...initialUserData }
      }),
      invalidatesTags: [
        { type: 'User', id: 'LIST' }
      ]
    }),
    updateUser: builder.mutation({
      query: initialUserData => ({
        url: '/users',
        method: 'PATCH',
        body: { ...initialUserData }
      }),
      invalidatesTags: (result, error, arg) => [
        { type:'User', id: arg.id }
      ]
    }),
    deleteUser: builder.mutation({
      query: ({ id }) => ({
        url: '/users',
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type:'User', id: arg.id }
      ]
    })
  })
});

//custom hooks - crud
export const { 
  useGetUsersQuery,
  useAddNewUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = usersApiSlice;

//selectors - states
//returns the query result obj
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

//creates memoized selector
const selectUsersData = createSelector(
  selectUsersResult,
  usersResult => usersResult.data //normalized state obj with ids & entities
);

//create selectors
export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
  selectIds: selectUsersIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState);