// app/components/AdminUsersServer.tsx
import { BASE_API_URL } from "@/lib/utils";
import AdminUsersList from "./AdminUserList";
import { AdminUser } from "@/lib/type";

const fetchAdminUsers = async (): Promise<{ adminUsers: AdminUser[]; error: string }> => {
  let adminUsers: AdminUser[] = [];
  let error = '';

  try {
    console.log('Fetching from:', `${BASE_API_URL}/api/adminuser`);
    const response = await fetch(`${BASE_API_URL}/api/adminuser`);

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    adminUsers = await response.json();
  } catch (err) {
    console.error('Fetch failed:', err);
    error = "Failed to fetch users";
  }

  return { adminUsers, error };
};

// Server-side data fetching component
const AdminUsersServer = async () => {
  const { adminUsers, error } = await fetchAdminUsers();

  return (
    <AdminUsersList adminUsers={adminUsers} error={error} />
  );
};

export default AdminUsersServer;
