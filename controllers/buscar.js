const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto } = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            total: (usuario) ? 1 : 0,
            results: (usuario) ? [usuario] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const query = {
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    };


    // const usuarios = await Usuario.find({
    //     $or: [{ nombre: regex }, { correo: regex }],
    //     $and: [{ estado: true }]
    // });
    const [total, usuarios] = await Promise.all([
        Usuario.count(query),
        Usuario.find(query)
    ]);

    res.json({
        total,
        results: usuarios
    });
}

const buscarCategorias = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            total: (categoria) ? 1 : 0,
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const query = {
        nombre: regex,
        estado: true
    };

    const [total, categorias] = await Promise.all([
        Categoria.count(query),
        Categoria.find(query)
    ]);

    res.json({
        total,
        results: categorias
    });
}

const buscarProductos = async (termino = '', res = response) => {

    const esMongoID = ObjectId.isValid(termino); //TRUE

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            total: (producto) ? 1 : 0,
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');
    const query = {
        nombre: regex,
        estado: true
    };

    const [total, productos] = await Promise.all([
        Producto.count(query),
        Producto.find(query).populate('categoria', 'nombre')
    ]);

    res.json({
        total,
        results: productos
    });
}

const buscar = (req, res = response) => {

    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            });
    }

}

module.exports = {
    buscar
}