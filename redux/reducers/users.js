import { USERS_DATA_STATE_CHANGE } from "../constants";
import { USERS_POST_STATE_CHANGE } from "../constants";
import { USERS_LIKES_STATE_CHANGE } from "../constants";
import { CLEAR_DATA } from "../constants";

const initialState = {
    users: [],
    feed: [],
    usersFollowingLoaded: 0,
}

export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user],
            }
        case USERS_POST_STATE_CHANGE:
            return {
                ...state,
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts],
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state,
                feed: state.feed.map((post) => {
                    if (post.id === action.postId) {
                        return {
                            ...post,
                            like: action.like,
                        }
                    } else {
                        return post;
                    }
                }),
            }
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
}
