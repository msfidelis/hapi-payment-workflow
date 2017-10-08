'use strict';

module.exports = [

    {
        method: "GET",
        path: "/products",
        handler: (req, res) => {
            res({ alive: true });
        }
    }

];