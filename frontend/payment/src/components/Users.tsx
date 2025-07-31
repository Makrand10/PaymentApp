import { useEffect, useState } from "react";
import axios from "axios";
import {Button} from "./Button";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/v1/user/bulk")
      .then(response => {
        setUsers(response.data.users);
      });
  }, []);

  return (
    <>
      <div className="font-bold mt-6 text-lg">
        Users
      </div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>
      <div>
        {users.map((user, idx) => (
          <div key={user.id || idx}>
            {user.firstName} {user.lastName} ({user.username})
          </div>
        ))}
      </div>
    </>
  );
};
