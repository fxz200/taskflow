import { combineReducers } from '@reduxjs/toolkit'
import sprintReducer from './sprint'

const rootReducer = combineReducers({
  sprint: sprintReducer,
})

export default rootReducer