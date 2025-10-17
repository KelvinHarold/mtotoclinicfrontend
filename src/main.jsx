import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import UserList from './pages/users/UsersList'; // 👈 path sahihi kwa structure yako
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";
import RolesList from "./pages/roles/RolesList";
import RoleCreate from "./pages/roles/RolesCreate";
import RoleEdit from "./pages/roles/RolesEdit";
import RolePermissions from "./pages/roles/RolePermissions";
import DailyReport from "./pages/Uploads/DailyReport";
import Reports from "./pages/reports/Reports";
import PermissionsList from "./pages/Permissions/PermissionsList";
import PermissionsCreate from "./pages/Permissions/PermissionsCreate";
import PermissionsEdit from "./pages/Permissions/PermissionsEdit";


import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
      <Route path="/users" element={<UserList />} /> {/* 👈 add this */}
  <Route path="/users/create" element={<UserCreate />} />
  <Route path="/users/edit/:id" element={<UserEdit />} />
  <Route path="/roles" element={<RolesList />} />
  <Route path="/roles/create" element={<RoleCreate />} />
  <Route path="/roles/edit/:id" element={<RoleEdit />} />
    <Route path="/uploads" element={<DailyReport />} />
      <Route path="/records" element={<Reports />} />
        <Route path="/permissions" element={<PermissionsList />} />
  <Route path="/permissions/create" element={<PermissionsCreate />} />
  <Route path="/permissions/edit/:id" element={<PermissionsEdit />} />
  <Route path="/roles/:id/permissions" element={<RolePermissions />} />

    </Routes>
  </BrowserRouter>
);
