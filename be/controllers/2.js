const { getInventoryPromise, loginPromise } = require('../2.fashiongo/getItem');


const web2_controller = {
    getInventory: (req, res) => {
        const id = req.params.id;
        getInventoryPromise(id).then(response => {
            res.send(response && response.data.inventory || [])
        })
    },
    login: (req, res) => {
        loginPromise().then(response => {
            global.Authorization = `Bearer ${response.data}`;
            res.send(response && response.data || [])
        })
    }

};
module.exports = web2_controller;