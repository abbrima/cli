'use strict';

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
async function up(queryInterface,Sequelize){
    await queryInterface.createTable('<%= tableName %>', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },

        <% attributes.forEach(function(attribute) { %>
            <%= attribute.fieldName %>: {
            type: Sequelize.<%= attribute.dataFunction ? `${attribute.dataFunction.toUpperCase()}(Sequelize.${attribute.dataType.toUpperCase()})` : attribute.dataValues ? `${attribute.dataType.toUpperCase()}(${attribute.dataValues})` : attribute.dataType.toUpperCase() %>
            },
        <% }) %>

        <%= createdAt %>: {
            allowNull: false,
            type: Sequelize.DATE
        },

        <%= updatedAt %>: {
            allowNull: false,
            type: Sequelize.DATE
        }
        });
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize')} Sequelize
 */
async function down(queryInterface,Sequelize){
    await queryInterface.dropTable('<%= tableName %>');

}

module.exports = {
    up,down
};
