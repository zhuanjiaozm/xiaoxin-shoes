const { loginPromise } = require('../service/index');
const login = async function () {
    const a = await loginPromise().then(res => {
        if (res && res.success && res.data) {
            return 'Bearer ' + res.data;
        }
    });
    return a;
}

module.exports = login();