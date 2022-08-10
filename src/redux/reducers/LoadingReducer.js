export const LoadingReducer = (prevState = {
  isLoading: false
}, action) => {
  const { type, payload } = action
  const newState = { ...prevState }
  switch (type) {
    case 'change_loading':
      newState.isLoading = payload
      return newState
    default:
      return prevState
  }
}