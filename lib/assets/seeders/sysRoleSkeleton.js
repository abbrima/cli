'use strict';
//! Edit these only

const roleName = '<%= roleName %>';

let add = [];
let remove = [];

//-------------------------------------------------------------------------------

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
const up = async (queryInterface, Sequelize) => {
	const buffer = await getRoleBuffer(queryInterface);
	add = await mapToIndicies(queryInterface, add);
	remove = await mapToIndicies(queryInterface, remove);
	await updateRoleBuffer(queryInterface, disableBits(enableBits(buffer, add), remove));
};

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
const down = async (queryInterface, Sequelize) => {
	const buffer = await getRoleBuffer(queryInterface);
	add = await mapToIndicies(queryInterface, add);
	remove = await mapToIndicies(queryInterface, remove);
	await updateRoleBuffer(queryInterface, disableBits(enableBits(buffer, remove), add));
};

const {
	backend: { enableBits, disableBits, genBufferFromBits, and, or, xor, not },
} = require('usol-buffertools');

/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {Array<String>} keys
 */
async function mapToIndicies(queryInterface, keys = []) {
	if (keys.length == 0) return [];
	const res = await queryInterface.select(null, 'Permissions', {
		where: {
			key: keys,
		},
	});
	return res.map((item) => item.index);
}

/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 */
async function getRoleBuffer(queryInterface) {
	const res = await queryInterface.select(null, 'SystemRoles', {
		where: {
			roleName,
		},
	});
	if (res.length == 0) throw new Error(`Role Super Admin was not found!`);
	return res[0].permissions;
}

/**
 *
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {Buffer}
 */
async function updateRoleBuffer(queryInterface, buffer) {
	await queryInterface.bulkUpdate('SystemRoles', { permissions: buffer }, { roleName });
}

module.exports = {
	up,
	down,
    redo: true
};
