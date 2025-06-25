import { createSlice } from '@reduxjs/toolkit'
import { logIn, getSession } from './auth-action'
import Cookies from 'js-cookie'

const initialState = {
  user: {
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    role: {
      id: '',
      slug: '',
    },
    department: null as { id: number; departmentName: string } | null,
  },
  accessToken: '',
  refreshToken: '',
  loading: false,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = initialState.user
      state.accessToken = ''
      state.refreshToken = ''
      state.loading = false
    },
  },
  extraReducers(builder) {
    builder
      .addCase(logIn.pending, (state) => {
        state.loading = true
      })
      .addCase(logIn.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.accessToken = action.payload.data.access_token
          state.refreshToken = action.payload.data.refresh_token
          state.loading = false
        } else {
          state.loading = false
        }
      })
      .addCase(logIn.rejected, (state, _) => {
        state.loading = false
      })
      .addCase(getSession.pending, (state) => {
        state.loading = true
      })
      .addCase(getSession.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.user.email = action.payload.data.email
          state.user.firstName = action.payload.data.firstName
          state.user.lastName = action.payload.data.lastName
          state.user.id = action.payload.data.id
          state.user.role.id = action.payload.data.role.id
          state.user.role.slug = action.payload.data.role.slug
          state.user.department = action.payload.data.department
          Cookies.set('email', action.payload.data.email)
          Cookies.set('firstName', action.payload.data.firstName)
          Cookies.set('lastName', action.payload.data.lastName)
          Cookies.set('id', action.payload.data.id)
          Cookies.set('roleId', action.payload.data.role.id)
          Cookies.set('roleSlug', action.payload.data.role.slug)
          state.loading = false
        } else {
          state.loading = false
        }
      })
      .addCase(getSession.rejected, (state, _) => {
        state.loading = false
      })
  },
})

export const { clearAuthState } = userSlice.actions
export default userSlice.reducer
