import axios from "axios";
import React, { useEffect, useState } from "react";
import UserProfile from './UserProfile';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [user,setUser] = useState();

  useEffect(() => {
    const main = async () => {
      try {
        const response = await axios.post("http://localhost:3002/fetch-users");
        if (response.status === 200) {
          setUsers(response.data.users);
        } else {
          alert(response.data.message || "Some Error occured");
        }
      } catch (error) {
        console.error("Error in Logging in:", error);
        console.log(error.response?.data?.message || "An error occurred");
        if (error.response) {
          alert(
            "Error from server: " +
              error.response.status +
              " - " +
              error.response.data.message
          );
        } else if (error.request) {
          alert("No response from the server");
        } else {
          alert("Error setting up the request: " + error.message);
        }
      }
    };
    main();
  });

  return (
    <div className="container mx-auto my-48  p-6 bg-emerald-100 rounded-lg shadow-lg">
        {user ? (
                <UserProfile user={user}/>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
                        All Users
                    </h1>
                    <div className="flex flex-col space-y-6">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                    onClick={() => setUser(user)}
                                >
                                    <h2 className="text-xl font-semibold text-emerald-700">
                                        {user.name}
                                    </h2>
                                    <p className="text-gray-600">{user.email}</p>
                                    <p className="text-gray-500 text-sm">{user.username}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No users found.</p>
                        )}
                    </div>
                </>
            )}
    </div>
  );
}
