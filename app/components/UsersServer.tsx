"use client"; // Ensure this component is client-side to handle click events

import { useState, useEffect } from "react";
import { BASE_API_URL } from "@/lib/utils";
import { User } from "@/lib/type";
import Search from "./Search";

const UsersServer = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Function to fetch the latest data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/userdata`, { cache: "no-cache" });
      console.log("API URL:", BASE_API_URL);
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      const data = await response.json();
      /* console.log("API Data:",data) */
      setUsers(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <div>
    
        <Search users={users} error={error} />
    
    </div>
  );
};

export default UsersServer;
