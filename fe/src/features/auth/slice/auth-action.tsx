import { createAsyncThunk } from '@reduxjs/toolkit'
import { tryCatch } from '@/utils'
import { httpRequest } from '@/utils'
import type { AxiosError } from 'axios'

type DataLogInType = {
  email: string
  password: string
}

export const logIn = createAsyncThunk('user/logIn', async (value: DataLogInType, thunkAPI) => {
  try {
    const { data, error } = await tryCatch(
      httpRequest.post('/auth/login', {
        email: value.email,
        password: value.password,
      })
    )
    if (error) {
      return {
        success: false,
        error: error as AxiosError,
      }
    }
    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})

export const getSession = createAsyncThunk('user/getSession', async (_, thunkAPI) => {
  try {
    const { data, error } = await tryCatch(httpRequest.get('/user/session'))
    if (error) {
      return {
        success: false,
        data: error,
      }
    }

    return {
      success: true,
      data: data.data,
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
