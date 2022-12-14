import React, { useState } from 'react';
import { get, post } from './libs/client';
import { LogMessage } from './libs/types';

function Message({ type, message }: LogMessage) {
  return <p className={`${type === 'error' ? 'text-danger' : 'text-success'}`}>{message}</p>;
}

function App() {
  const [customer, setCustomer] = useState<string>('');
  const [attendant, setAttendant] = useState<string>('');
  const [logs, setLogs] = useState<LogMessage[]>([]);

  const CheckPerson = (personid: string) => (
    personid
      ? get(`/person/${personid}`)
        .then(() => setLogs([...logs, { message: `Person ${personid} exists in the database.`, type: 'success' }]))
        .catch(() => setLogs([...logs, { message: `Person ${personid} do not exists.`, type: 'error' }]))
      : alert('Please enter a valid person ID')
  );

  const CheckTransaction = () => (
    post('/transaction', { customer, attendant })
      .then(({ message }) => setLogs([...logs, { message, type: 'success' }]))
      .catch(({ message }) => setLogs([...logs, { message, type: 'error' }]))
  );

  return (
    <div className="vw-100 vh-100 d-grid overflow-hidden">
      <div className="row">
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex flex-column align-items-center border p-5">
            <h4>Customer Information</h4>
            <input className="mb-2 w-100" placeholder="Customer-ID#" onChange={(e) => setCustomer(e.target.value)} />
            <button type="button" className="btn btn-primary w-50" onClick={() => CheckPerson(customer)}>
              Check Person
            </button>
          </div>

          <div className="d-flex flex-column align-items-center border p-5 mt-4">
            <h4>Attendant Information</h4>
            <input className="mb-2 w-100" placeholder="Customer-ID#" onChange={(e) => setAttendant(e.target.value)} />
            <button type="button" className="btn btn-primary w-50" onClick={() => CheckPerson(attendant)}>
              Check Person
            </button>
          </div>

          <button type="button" className="btn btn-lg btn-warning w-50 mt-5" onClick={CheckTransaction}>
            Create Transaction
          </button>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex w-100 vh-100 flex-column align-items-center border p-5">
            <h4>Console</h4>
            <div className="mb-2 w-100 h-100" style={{ overflowY: 'auto' }}>
              {logs.map((log:any) => (<Message message={log.message} type={log.type} />))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
