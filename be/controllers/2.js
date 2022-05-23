const { getInventoryPromise, loginPromise } = require('../2.fashiongo/getItem');


const web2_controller = {
    getInventory: (req, res) => {
        const id = req.params.id;
        getInventoryPromise(id).then(response => {
            const data = response && response.data && response.data.inventory || []
            res.status(200).send({
                data, success: true
            })
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