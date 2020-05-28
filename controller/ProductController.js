const axios = require('axios');
const ProductsModel = require('../model/ProductModel');
//const { removeSpecialChars } = require('../controller/HelpersController');

exports.updateProductsWithWeb = async (link) => {
    var add = [];
    var update = [];
    var totalArray = [];
    this.setStock(0);
    return axios.get(link)
        .then(async r => {
            for await (const item of r.data) {
                var itemSearch = await this.view(item.data.cod);
                if (itemSearch) {
                    const images = [];
                    itemSearch.title = item.data.titulo;
                    itemSearch.description.text = "" + item.data.desarrollo + "";
                    itemSearch.description.video = (item.data.video) ? item.data.video : process.env.VIDEO_ITEM;
                    itemSearch.stock = (item.data.stock) ? item.data.stock : 0;
                    itemSearch.code.web = item.data.cod_producto;
                    // itemSearch.mercadolibre = item.mercadolibre;
                    itemSearch.price.default = item.data.precio;
                    itemSearch.category = item.category.data.titulo;
                    itemSearch.subcategory = "";
                    item.images.forEach(img => {
                        images.push({ "source": img.ruta, "order": img.orden })
                    });
                    itemSearch.images = images;
                    this.update(itemSearch);
                    update.push({ product: itemSearch.title });
                } else {
                    const data = {};
                    data.description = {};
                    data.code = {};
                    data.price = {};
                    const images = [];
                    data.title = item.data.titulo;
                    data.description.text = "" + item.data.desarrollo + "";
                    data.description.video = (data.description.video) ? data.description.video : process.env.VIDEO_ITEM;
                    data.stock = (item.data.stock) ? item.data.stock : 0;
                    data.code.web = item.data.cod_producto;
                    // data.mercadolibre = item.mercadolibre;
                    data.price.default = item.data.precio;
                    data.category = item.category.data.titulo;
                    data.subcategory = "";
                    item.images.forEach(img => {
                        images.push({ "source": img.ruta, "order": img.orden })
                    });
                    data.images = images;
                    this.create(data);
                    add.push({ product: data.title });
                }
            }
            totalArray.push({ "add": add, "update": update });
            return await totalArray;
        })
}


exports.updateWeb = async (item) => {
    this.setStock(0);
    var itemSearch = (item.data.cod_producto) ? await this.view(item.data.cod_producto) : false;
    var description = item.data.titulo + ' \n _________________ \nAIMAR REPUESTOS \nDistribuidora líder en venta de repuestos de freno y embrague\n \n Realizamos factura A y B. \n *En caso de necesitar factura tipo A indicar el número de CUIT en el momento de la compra. No se realizan modificaciones posteriores.\n \n Estamos en San Francisco, Córdoba \n Si desea que el envío se realice por algún transporte especifico tilde la opción de “retiro en sucursal” para poder coordinar con nosotros el despacho de su compra \n HORARIO: Lunes a viernes de 8hs a 16hs \n \n Respondemos todas tus dudas y/o consultas!';
    if (itemSearch) {
        const images = [];
        itemSearch.title = item.data.titulo;
        itemSearch.description.text = description;
        itemSearch.description.video = (item.data.video) ? item.data.video : process.env.VIDEO_ITEM;
        itemSearch.stock = (item.data.stock) ? item.data.stock : 0;
        itemSearch.code.web = item.data.cod_producto;
        // itemSearch.mercadolibre = item.mercadolibre;
        itemSearch.price.default = item.data.precio;
        itemSearch.category = item.category.data.titulo;
        itemSearch.subcategory = "a";
        item.images.forEach(img => {
            images.push({ "source": img.ruta, "order": img.orden })
        });
        console.log("update: " + itemSearch)
        itemSearch.images = images;
        if (this.update(itemSearch)) {
            return ({ status: 200, type: "update", title: item.data.titulo });
        } else {
            return ({ status: 500, type: "update", title: item.data.titulo });
        }
    } else {

        const data = {};
        data.description = {};
        data.code = {};
        data.price = {};
        const images = [];
        data.title = item.data.titulo;
        data.description.text = description;
        data.description.video = (data.description.video) ? data.description.video : process.env.VIDEO_ITEM;
        data.stock = (item.data.stock) ? item.data.stock : 0;
        data.code.web = item.data.cod_producto;
        // data.mercadolibre = item.mercadolibre;
        data.price.default = item.data.precio;
        data.category = item.category.data.titulo;
        data.subcategory = "";
        item.images.forEach(img => {
            images.push({ "source": img.ruta, "order": img.orden })
        });
        data.images = images;

        console.log("create: " + data)
        if (this.create(data)) {
            return ({ status: 200, type: "create", title: item.data.titulo });
        } else {
            return ({ status: 500, type: "create", title: item.data.titulo });
        }
    }
}

exports.list = async () => {
    return ProductsModel.find();
    //return ProductsModel.find().limit(100);
}


exports.create = (item) => {
    var data = new ProductsModel(item);
    data.save(function (err, body) {
        if (err) console.log(err);
        return body
    })
};

exports.update = (item) => {
    return ProductsModel.update({ 'code.web': item.code.web }, { $set: item }, function (err, body) {
        if (err) console.log(err)
        return body
    })
};

exports.view = function (codigo) {
    return ProductsModel.findOne({ 'code.web': codigo }, (err, res) => { return res });
};

exports.setStock = function (stock) {
    return ProductsModel.updateMany({}, { stock: stock })
}
