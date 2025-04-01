import { configureStore } from '@reduxjs/toolkit'
import rootReducer from '@api/reducers/index'

// 建立 Redux store
const store = configureStore({
  reducer: rootReducer,
})

// 定義 RootState 和 AppDispatch 型別
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store