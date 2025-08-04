const createDynamicModel = require('../models/tableModel');
const sequelize=require('../util/db-connection');

const createTable = async (req, res) => {
    const { tableName, fields } = req.body;

    if (!tableName || !Array.isArray(fields) || fields.length === 0) {
        return res.status(400).json({ message: 'Table name and fields are required' });
    }

    try {
        const DynamicModel = createDynamicModel(tableName, fields);
        await DynamicModel.sync(); 

        res.json({ message: `Table '${tableName}' created successfully` });
    } catch (error) {
        console.error('Error creating table:', error);
        res.status(500).json({ message: 'Error creating table' });
    }
};

const listTables = async (req, res) => {
  try {
    const [results] = await sequelize.query('SHOW TABLES');
    const tableNames = results.map(row => Object.values(row)[0]);
    res.json({ tables: tableNames });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({ message: 'Error fetching tables' });
  }
};

const getTableStructure = async (req, res) => {
  const { tableName } = req.params;
  try {
    const [columns] = await sequelize.query(`SHOW COLUMNS FROM \`${tableName}\``);
    res.json({ columns });
  } catch (error) {
    console.error('Error fetching table structure:', error);
    res.status(500).json({ message: 'Error fetching table structure' });
  }
};

const getAllRecords = async (req, res) => {
  const { tableName } = req.params;
  try {
    const [records] = await sequelize.query(`SELECT * FROM \`${tableName}\``);
    res.json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Error fetching records' });
  }
};

const insertRecord = async (req, res) => {
  const { tableName } = req.params;
  const { values } = req.body;

  try {
    if (!tableName || !values || Object.keys(values).length === 0) {
      return res.status(400).json({ message: 'Table name and values required' });
    }

    const fields = Object.keys(values).map(f => `\`${f}\``).join(',');
    const placeholders = Object.keys(values).map(() => '?').join(',');

    console.log('INSERT INTO', tableName);
    console.log('Fields:', Object.keys(values));
    console.log('Values:', Object.values(values));
    console.log('Query:', `INSERT INTO \`${tableName}\` (${fields}) VALUES (${placeholders})`);

    await sequelize.query(
      `INSERT INTO \`${tableName}\` (${fields}) VALUES (${placeholders})`,
      { replacements: Object.values(values) }
    );

    res.json({ message: 'Record inserted successfully' });
  } catch (error) {
    console.error('Error inserting record:', error);
    res.status(500).json({ message: 'Error inserting record' });
  }
};


const deleteRecord = async (req, res) => {
  const { tableName, id } = req.params;
  try {
    await sequelize.query(`DELETE FROM \`${tableName}\` WHERE id = ?`, { replacements: [id] });
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ message: 'Error deleting record' });
  }
};

module.exports = {
  listTables,
  getTableStructure,
  getAllRecords,
  insertRecord,
  deleteRecord,
  createTable
};
