import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function SidebarLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 lg:mr-[320px] min-h-screen pt-[70px] lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}