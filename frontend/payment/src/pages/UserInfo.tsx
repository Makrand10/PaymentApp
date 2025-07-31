import React from 'react';

const UserInfo = () => {
  // Static user info and transaction history for now
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };
  const transactions = [
    { id: 1, date: '2024-06-01', amount: 500, type: 'credit', description: 'Received from Alice' },
    { id: 2, date: '2024-06-02', amount: 200, type: 'debit', description: 'Sent to Bob' },
    { id: 3, date: '2024-06-03', amount: 1000, type: 'credit', description: 'Received from Charlie' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4 text-cyan-700">User Information</h2>
        <div className="mb-6">
          <div className="text-lg font-semibold text-slate-800">{user.firstName} {user.lastName}</div>
          <div className="text-slate-600">{user.email}</div>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-slate-700">Transaction History</h3>
        <div className="bg-slate-100 rounded-lg p-4">
          {transactions.length === 0 ? (
            <div className="text-slate-500">No transactions yet.</div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {transactions.map(tx => (
                <li key={tx.id} className="py-2 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-slate-800">{tx.description}</div>
                    <div className="text-xs text-slate-500">{tx.date}</div>
                  </div>
                  <div className={tx.type === 'credit' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;