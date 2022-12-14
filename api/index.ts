import express, { json } from 'express';
import cors from 'cors';
import fs from 'fs';
import { OBJ2XML, XML2OBJ } from './utils';
import { Person } from './types';

// initialize runtime variables for database entries
let personDB;
let transactionDB;

// initialize server app
const App = express();

// initialize middlewares for backend server
App.use(json({ limit: '100kb' }));
App.use(cors());

// The usage of routes is wrong here, it should be grouped with file structure: routes, controllers, models etc.
// However, in this case there will be few routes which will not raise readibility and maintainability issues.
App.get('/api/person/:id', (req, res) => {
  const { id } = req.params;

  // Try to find the person in the database
  const person = personDB?.IDDatabase?.Person?.find((p) => p.IDNo._text === id) as Person;
  console.log(`Person ${id} ${person ? 'exists' : 'not exists'} in the database`);

  // Send HTTP status to client
  res.status(person ? 200 : 404).send({ person, exists: !!person });
});

App.post('/api/transaction', (req, res) => {
  const { customer, attendant } = req.body;

  // Ensure people exist in database
  const customerObj = personDB?.IDDatabase?.Person?.filter((p) => p.isAttendant._text === '0').find((p) => p.IDNo._text === customer);
  const attendantObj = personDB?.IDDatabase?.Person?.filter((p) => p.isAttendant._text === '1').find((p) => p.IDNo._text === attendant);
  const bothExist = !!customerObj && !!attendantObj;

  // Get transactions array and lastly saved transaction
  const transactions = transactionDB?.TransactionDatabase?.Transaction || [];
  const transactionsIDs = transactions?.map((t) => Number(t.TransactionID._text));
  const lastTransaction = Math.max(0, ...transactionsIDs);

  console.log(customerObj ? 'Customer is valid.' : 'Customer is not valid.');
  console.log(attendantObj ? 'Attendant is valid.' : 'Attendant is not valid.');
  console.log(bothExist ? 'Transaction approved.' : 'Transaction denied.');

  // Create new transaction
  const transaction = {
    TransactionID: { _text: lastTransaction + 1 },
    Customer: { _text: customerObj?.FullName?._text },
    Attendant: { _text: attendantObj?.FullName?._text },
  };
  transactions.push(transaction);

  // If the transactions never initialized, initialize them otherwise push to array
  if (Array.isArray(transactionDB?.TransactionDatabase?.Transaction)) {
    transactionDB.TransactionDatabase.Transaction = transactions;
  } else {
    transactionDB = { _declaration: { _attributes: { version: '1.0' } } };
    transactionDB.TransactionDatabase = { Transaction: transactions };
  }

  // Write the XML file with new version
  transactionDB.TransactionDatabase.Transaction = transactions;
  fs.writeFileSync('./Transaction_DB.xml', OBJ2XML(transactionDB));
  const message = `Transaction saved to database: (${transaction.Customer._text}, ${transaction.Attendant._text}, ${bothExist ? 'ACCESS OK' : 'ACCESS DENIED'})`;
  console.log(message);

  // Let client know about the transaction request
  res.status(bothExist ? 200 : 404).send({ message });
});

// It should be added to a .env file in normal scenarios and read by process.env.PORT
const PORT = 3001;

// Create listening port for the application so that any client can request later on
App.listen(PORT, () => {
  console.log(`API running at PORT:${PORT}`);

  // After creation of App instance, read both databases and assign them to runtime variables
  personDB = XML2OBJ(fs.readFileSync('./ID_DB.xml').toString());
  console.log('Person Database Read and Initialized.');

  transactionDB = XML2OBJ(fs.readFileSync('./Transaction_DB.xml').toString());
  console.log('Transaction Database Read and Initialized.');

  console.log('Ready.');
});
