const updateUser = (updatedUser) => {
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))
}
export default updateUser;