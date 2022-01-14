function logoutUser() {
    sessionRemove("userLogin");
    window.location.href = "index.html";
}