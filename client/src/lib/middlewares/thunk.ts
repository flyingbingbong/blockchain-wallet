export default ({ dispatch, getState }) => next => action => {
    if (typeof action === "function") {
        const result = action(dispatch, getState);
        return result;
    }
    return next(action);
} 
