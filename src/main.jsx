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

//import Visits Pages
import VisitList from './pages/Visits/VisitList';
import CreateVisit from './pages/Visits/CreateVisit';
import EditVisit from './pages/Visits/EditVisit';
import VisitDetail from './pages/Visits/VisitDetail';

//import PatientVisit Pages
import PatientVisitList from './pages/PatientVisit/PatientVisitList';
import CreatePatientVisit from './pages/PatientVisit/CreatePatientVisit';
import PatientVisitDetail from './pages/PatientVisit/PatientVisitDetail';
import EditPatientVisit from './pages/PatientVisit/EditPatientVisit';

//import PatientVisitRouting Pages
import VisitRoutingIndex from './pages/PatientVisitRouting/VisitRoutingIndex';
import VisitRoutingCreate from './pages/PatientVisitRouting/VisitRoutingCreate';
import VisitRoutingShow from './pages/PatientVisitRouting/VisitRoutingShow';
import VisitRoutingEdit from './pages/PatientVisitRouting/VisitRoutingEdit';

//import LabTest Pages
import LabTestIndex from './pages/LabTests/LabTestIndex';
import LabTestCreate from './pages/LabTests/LabTestCreate';
import LabTestShow from './pages/LabTests/LabTestShow';
import LabTestEdit from './pages/LabTests/LabTestEdit';

//import LabResult Pages
import LabResultIndex from './pages/LabResults/LabResultIndex';
import LabResultCreate from './pages/LabResults/LabResultCreate';
import LabResultShow from './pages/LabResults/LabResultShow';
import LabResultEdit from './pages/LabResults/LabResultEdit';


import MedicationList from './pages/Medication/MedicationList';
import MedicationForm from './pages/Medication/MedicationForm';
import MedicationDetail from './pages/Medication/MedicationDetail';
import PatientMedications from './pages/Medication/PatientMedications';


import VaccinationList from './pages/Vaccinations/VaccinationList';
import CreateVaccination from './pages/Vaccinations/CreateVaccination';
import VaccinationDetail from './pages/Vaccinations/VaccinationDetail';
import EditVaccination from './pages/Vaccinations/EditVaccination';


import MedicalAdviceList from './pages/MedicalAdvice/MedicalAdviceList';
import CreateMedicalAdvice from './pages/MedicalAdvice/CreateMedicalAdvice';
import EditMedicalAdvice from './pages/MedicalAdvice/EditMedicalAdvice';
import MedicalAdviceDetail from './pages/MedicalAdvice/MedicalAdviceDetail';


import AppointmentList from './pages/Appointments/AppointmentList';
import CreateAppointment from './pages/Appointments/CreateAppointment';
import EditAppointment from './pages/Appointments/EditAppointment';
import AppointmentDetail from './pages/Appointments/AppointmentDetail';


import RelativesList from './pages/Relatives/RelativesList';
import RelativeForm from './pages/Relatives/RelativeForm';
import RelativeDetails from './pages/Relatives/RelativeDetails';
import PatientRelatives from './pages/Relatives/PatientRelatives';


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

        {/* Visits Routes */}
     <Route path="/visits" element={<VisitList />} />
          <Route path="/visits/create" element={<CreateVisit />} />
          <Route path="/visits/:id" element={<VisitDetail />} />
          <Route path="/visits/:id/edit" element={<EditVisit />} />

          {/* Patient Visit Routes */}
          <Route path="/patient-visits" element={<PatientVisitList />} />
          <Route path="/patient-visits/create" element={<CreatePatientVisit />} />
          <Route path="/patient-visits/:id" element={<PatientVisitDetail />} />
          <Route path="/patient-visits/:id/edit" element={<EditPatientVisit />} />

          {/* Patient Visit Routes */}
          <Route path="/visit-routings" element={<VisitRoutingIndex />} />
<Route path="/visit-routings/create" element={<VisitRoutingCreate />} />
<Route path="/visit-routings/:id" element={<VisitRoutingShow />} />
<Route path="/visit-routings/:id/edit" element={<VisitRoutingEdit />} />

 {/* LabTes Routes */}
<Route path="/lab-tests" element={<LabTestIndex />} />
<Route path="/lab-tests/create" element={<LabTestCreate />} />
<Route path="/lab-tests/:id" element={<LabTestShow />} />
<Route path="/lab-tests/:id/edit" element={<LabTestEdit />} />

 {/* LabResults Routes */}
<Route path="/lab-results" element={<LabResultIndex />} />
<Route path="/lab-results/create" element={<LabResultCreate />} />
<Route path="/lab-results/:id" element={<LabResultShow />} />
<Route path="/lab-results/:id/edit" element={<LabResultEdit />} />

 {/* Medication Routes */}
        <Route path="/medications" element={<MedicationList />} />
        <Route path="/medications/create" element={<MedicationForm />} />
        <Route path="/medications/:id" element={<MedicationDetail />} />
        <Route path="/medications/:id/edit" element={<MedicationForm />} />
        <Route path="/patients/:patientId/medications" element={<PatientMedications />} />

        <Route path="/vaccinations" element={<VaccinationList />} />
<Route path="/vaccinations/create" element={<CreateVaccination />} />
<Route path="/vaccinations/:id" element={<VaccinationDetail />} />
<Route path="/vaccinations/:id/edit" element={<EditVaccination />} />

<Route path="/medical-advice" element={<MedicalAdviceList />} />
<Route path="/medical-advice/create" element={<CreateMedicalAdvice />} />
<Route path="/medical-advice/:id" element={<MedicalAdviceDetail />} />
<Route path="/medical-advice/:id/edit" element={<EditMedicalAdvice />} />

<Route path="/appointments" element={<AppointmentList />} />
<Route path="/appointments/create" element={<CreateAppointment />} />
<Route path="/appointments/:id" element={<AppointmentDetail />} />
<Route path="/appointments/:id/edit" element={<EditAppointment />} />

  <Route path="/relatives" element={<RelativesList />} />
  <Route path="/relatives/create" element={<RelativeForm />} />
  <Route path="/relatives/:id" element={<RelativeDetails />} />
  <Route path="/relatives/:id/edit" element={<RelativeForm />} />
  <Route path="/patients/:patientId/relatives" element={<PatientRelatives />} />

      </Route>
    </Routes>
  </BrowserRouter>
);