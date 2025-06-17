
function isvalidemail(email) {
    const regexs = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regexs.test(email);
}

function validpassword(password) {
    return password.length >= 5
}

module.exports = { isvalidemail, validpassword };
