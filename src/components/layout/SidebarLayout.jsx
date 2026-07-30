import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function SidebarLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      <Sidebar />
      <main className="flex-1 lg:mr-[280px] min-h-screen p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}