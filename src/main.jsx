// main.jsx (updated)
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./pages/credentials/Register";
import AppLayout from "./layouts/AppLayout";
import "./index.css";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

// Import Admin Users Pages
import UsersList from "./pages/admin/Users/index";
import CreateUser from "./pages/admin/Users/CreateUser";
import EditUser from "./pages/admin/Users/EditUser";
import UserDetails from "./pages/admin/Users/UserDetails";
// Import Admin Roles Pages
import RolesList from "./pages/admin/Roles/index";
import CreateRole from "./pages/admin/Roles/CreateRole";
import EditRole from "./pages/admin/Roles/EditRole";
import RoleDetails from "./pages/admin/Roles/RoleDetails";
// Import Admin Permissions Pages
import PermissionsList from "./pages/admin/Permissions/index";
import CreatePermission from "./pages/admin/Permissions/CreatePermission";
import EditPermission from "./pages/admin/Permissions/EditPermission";
import PermissionDetails from "./pages/admin/Permissions/PermissionDetails";

//Import Patients
import Patients from './pages/Patients';
import CreatePatient from './pages/Patients/CreatePatient';
import EditPatient from './pages/Patients/EditPatient';
import PatientDetails from './pages/Patients/PatientDetails';

// import Pregnant
import PregnantWomen from './pages/Patients/PregnantWoman';
import CreatePregnantWoman from './pages/Patients/PregnantWoman/CreatePregnantWoman';
import EditPregnantWoman from './pages/Patients/PregnantWoman/EditPregnantWoman';
import PregnantWomanDetails from './pages/Patients/PregnantWoman/PregnantWomanDetails';

// import breasfeeding
import BreastfeedingWomen from "./pages/Patients/BreastfeedingWoman/index";
import CreateBreastfeedingWoman from "./pages/Patients/BreastfeedingWoman/CreateBreastfeedingWoman";
import EditBreastfeedingWoman from "./pages/Patients/BreastfeedingWoman/EditBreastfeedingWoman";
import BreastfeedingWomanDetails from "./pages/Patients/BreastfeedingWoman/BreastfeedingWomanDetails";

// import children
import Children from "./pages/Patients/Children";
import ChildDetails from "./pages/Patients/Children/ChildDetails";
import CreateChild from "./pages/Patients/Children/CreateChild";
import EditChild from "./pages/Patients/Children/EditChild";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      {/* Pages without layout */}
      <Route path="/" element={<App />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes with Layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboards/admin" element={<AdminDashboard />} />


        {/* Admin Users Routes */}
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/users/edit/:id" element={<EditUser />} />

        {/* Admin Roles Routes */}
        <Route path="/admin/roles" element={<RolesList />} />
        <Route path="/admin/roles/create" element={<CreateRole />} />
        <Route path="/admin/roles/:id" element={<RoleDetails />} />
        <Route path="/admin/roles/edit/:id" element={<EditRole />} />

        {/* Admin Permissions Routes */}
        <Route path="/admin/permissions" element={<PermissionsList />} />
        <Route path="/admin/permissions/create" element={<CreatePermission />} />
        <Route path="/admin/permissions/:id" element={<PermissionDetails />} />
        <Route path="/admin/permissions/edit/:id" element={<EditPermission />} />

        {/* Patients Routes */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/create" element={<CreatePatient />} />
        <Route path="/patients/:id" element={<PatientDetails />} />
        <Route path="/patients/:id/edit" element={<EditPatient />} />

        {/* Pregnant Routes */}
        <Route path="/patients/pregnant-women" element={<PregnantWomen />} />
        <Route path="/patients/pregnant-women/create" element={<CreatePregnantWoman />} />
        <Route path="/patients/pregnant-women/:id" element={<PregnantWomanDetails />} />
        <Route path="/patients/pregnant-women/:id/edit" element={<EditPregnantWoman />} />

        {/* Breastfeeding Routes */}
        <Route path="/patients/breastfeeding-women" element={<BreastfeedingWomen />} />
        <Route path="/patients/breastfeeding-women/create" element={<CreateBreastfeedingWoman />} />
        <Route path="/patients/breastfeeding-women/:id" element={<BreastfeedingWomanDetails />} />
        <Route path="/patients/breastfeeding-women/:id/edit" element={<EditBreastfeedingWoman />} />

        {/* Children Routes */}
        <Route path="/patients/children" element={<Children />} />
        <Route path="/patients/children/create" element={<CreateChild />} />
        <Route path="/patients/children/:id" element={<ChildDetails />} />
        <Route path="/patients/children/:id/edit" element={<EditChild />} />
      </Route>
    </Routes>
  </BrowserRouter>
);