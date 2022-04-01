let { ObjectId } = require('mongodb');

const mongoCollections = require('../config/mongoCollections');
const weddings = mongoCollections.weddings;

let exportedMethods = {
    async getAll() {
        // TO DO
    },

    async get(id) {
        // TO DO
    },

    async create() {
        // TO DO
    },

    async update() {
        // TO DO
    },

    async remove(id) {
        // TO DO
    }
};

module.exports = exportedMethods;