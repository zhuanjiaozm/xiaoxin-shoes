const { parentPort, workerData } = require("worker_threads");
const { dataObject } = require('../data/2.fashiongo/dataObject.json');
const { getInventoryPromise, getItemByAxios, updatePromise, getBasicActiveDataByPagePromise, getBasicInactiveDataByPagePromise } = require('../2.fashiongo/getItem');

// const getInventory = async (ids) => {
//     const promiseArray1 = ids.map(id => {
//         const p = getItemByAxios(id).then(response => {
//             return response.data.inventory || [];
//         }).catch(err => {
//         }).finally(() => {
//         });
//         return p;
//     });
//     Promise.all(promiseArray1).then((values) => {
//         parentPort.postMessage(values);
//     });
// }



const getInventory = async (ids) => {
    const result = [];
    let index = 0;

    const getData = async () => {
        const id = ids[index];
        getItemByAxios(id).then(response => {
            // console.log(`获取库存正常[${id}]:`, response.data.inventory);
            result.push(response);
        }).catch(err => {
            console.log(id + '发生了catch错误');
            console.log(err);
            result.push([]);
        }).finally(() => {
            if (index < ids.length - 2) {
                index++;
                getData();
            } else {
                parentPort.postMessage(result);
            }
        });
    };
    getData();
}


parentPort.on("message", async (ids) => {
    getInventory(ids);
});