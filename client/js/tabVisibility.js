function validateTabsVisibility() {
    const tabsHiddenWhenUserLoggedOut = ['#itemLogout', '#itemStocks']
    const tabsHiddenWhenUserLoggedIn = ['#itemLogin', '#itemRegister'];
    if (sessionGet('userLogin') != null) {
        tabsHiddenWhenUserLoggedIn.forEach(tab => $(tab).hide());
    } else {
        tabsHiddenWhenUserLoggedOut.forEach(tab => $(tab).hide());
    }
};

$(window).on('load', function () {
    validateTabsVisibility();
});

