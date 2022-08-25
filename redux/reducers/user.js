import { USER_POST_STATE_CHANGE } from "../constants"
import { USER_STATE_CHANGE } from "../constants"
import { USER_FOLLOWING_STATE_CHANGE } from "../constants"

import { USER_CHATS_STATE_CHANGE } from "../constants"
import { USER_MESSAGES_STATE_CHANGE } from "../constants"

import { CLEAR_DATA } from "../constants"

const initialState = { 
    currentUser : null,
    posts: [],
    chats: [],
    messages: [],
    following: [],

}

export const user = (state = initialState, action) => {
    switch(action.type){
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POST_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case USER_CHATS_STATE_CHANGE:
            return {
                ...state,
                chats: action.chats
            }
        case USER_MESSAGES_STATE_CHANGE:
            return {
                ...state,
                messages: action.messages
            }
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
}  