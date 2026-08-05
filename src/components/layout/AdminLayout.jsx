import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f5f7fa]">
      <AdminSidebar />
      <main className="flex-1 lg:mr-[280px] min-h-screen pt-[70px] lg:pt-0">
        <div className="p-6 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}