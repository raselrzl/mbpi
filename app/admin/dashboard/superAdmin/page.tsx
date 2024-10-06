"use client";
export const dynamic = 'force-dynamic';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavigationLink from "@/app/components/NavigationLink";
import AdminUsersServer from "@/app/components/AdminUsersServer";

const SuperAdmin = () => {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const superAdminLoggedIn = localStorage.getItem("superAdminLoggedIn");

    if (isLoggedIn !== "true" || superAdminLoggedIn !== "true") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-center">Super Admin Dashboard</h1>

      <div className="flex justify-center items-center">
        <Link
          href="/admin/dashboard"
          className="bg-green-500 text-white my-10 px-6 py-2 text-lg font-bold hover:bg-green-600 transition duration-300 ease-in-out justify-center items-center"
        >
          Click here Go to Admin Dashboard
        </Link>
      </div>

      <AdminUsersServer />  {/* Call your server-side component here */}
      <NavigationLink />
    </div>
  );
};

export default SuperAdmin;
