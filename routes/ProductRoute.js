const express = require('express');
const config = require('dotenv').config();
const Middelware = require("../config/Middleware");
const ProductController = require('../controller/ProductController');
const router = express.Router();

router.get("/update-products-with-web", async (req, res) => {
    var get = await ProductController.updateProductsWithWeb(config.parsed.JSON_PRODUCT);
    res.send(get);
})

router.get('/products-set-meli', async (req, res) => {
    const products = await ProductController.list();
    products.forEach(element => {
        var gold_pro = element.mercadolibre.findIndex(x => x.type === "gold_pro");
        var gold_special = element.mercadolibre.findIndex(
            x => x.type === "gold_special"
        );
        const meli = [];
        if (element.mercadolibre[gold_pro] != undefined) {
            meli.push(element.mercadolibre[gold_pro]);
        }
        if (element.mercadolibre[gold_special] != undefined) {
            element.mercadolibre[gold_special].type = "gold_special";
            meli.push(element.mercadolibre[gold_special]);
        }
        element.mercadolibre = meli;
        //console.log(element);
        ProductController.update(element);
    });
})

router.post("/update-web", Middelware.checkToken, async (req, res) => {
    const get = await ProductController.updateWeb(req.body.item);
    res.status(200).send(get);
})

router.get("/", Middelware.checkToken, async (req, res) => {
    const get = await ProductController.list();
    res.status(200).send(get);
})

router.get("/:id", Middelware.checkToken, async (req, res) => {
    console.log(req.params.id);
    let view = await ProductController.view(req.params.id);
    res.status(200).json(view);
})

router.post("/", Middelware.checkToken, async (req, res) => {
    const get = await ProductController.create(req.body);
    res.status(200).send({ get });
})

router.put("/", Middelware.checkToken, async (req, res) => {
    const get = await ProductController.update(req.body);
    res.status(200).send({ get });
})


module.exports = router;