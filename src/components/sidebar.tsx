// components/Sidebar.tsx
import Link from "next/link";
import { UserIcon } from "lucide-react"; // Optional icon

export default function Sidebar() {
  return (
    <div className="w-64 h-full bg-gray-100 p-4 shadow-md">
      {/* Other sidebar items */}
      <Link
        href="/dashboard/profile"
        className="flex items-center gap-2 p-2 rounded hover:bg-gray-200"
      >
        <UserIcon size={18} />
        <span>Profile</span>
      </Link>
    </div>
  );
}
