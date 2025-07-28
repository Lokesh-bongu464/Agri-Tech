import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Common Components
import Navbar from "./User/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import Notification from "./Components/Notification";
import { useAuth } from "./context/AuthContext";

// Views - Common
import Home from "./Components/Home";
import Aboutus from "./Components/Aboutus";

// Views - Auth
import Ulogin from "./User/Ulogin.jsx";
import Usignup from "./User/Usignup.jsx";
import Alogin from "./Admin/Alogin.jsx";
import Asignup from "./Admin/Asignup.jsx";

// Admin components
import Ahome from "./Admin/Ahome.jsx";
import Users from "./Admin/Users.jsx";
import UserEdit from "./Admin/UserEdit.jsx";
import AddProduct from "./Admin/AddProduct.jsx";
import GetProducts from "./Admin/GetProducts.jsx";
import EditProduct from "./Admin/EditProduct.jsx";
import AdminBookingManagement from "./Admin/AdminBookingManagement.jsx";

// User components
import Uservices from "./User/Uservices.jsx";
import Uhome from "./User/Uhome.jsx";
import CropsDetails from "./User/Cropsdetails.jsx";
import ViewCropData from "./User/ViewCropData.jsx";
import Uproducts from "./User/Uproducts.jsx";
import BuyProduct from "./User/BuyProduct.jsx";
import Mybookings from "./User/MyBookings.jsx";
import Weather from "./User/Weather.jsx";

// User Crop Management
import AddCrop from "./User/CropManagement/AddCrop.jsx";
import GetCrops from "./User/CropManagement/GetCrops.jsx";
import UpdateCrop from "./User/CropManagement/UpdateCrop.jsx";

// User Farm Management
import AddFarm from "./User/FarmManagement/AddFarm.jsx";
import GetFarms from "./User/FarmManagement/GetFarms.jsx";
import UpdateFarm from "./User/FarmManagement/UpdateFarm.jsx";

// Admin Crop Info Management Components
import CropInfoList from "./Admin/CropInfoList.jsx";
import AddCropInfo from "./Admin/AddCropInfo.jsx";
import EditCropInfo from "./Admin/EditCropInfo.jsx";

// Crop Info Detail page component, assuming it's in src/User/
import CropInfoDetails from "./User/CropInfoDetails.jsx";

function App() {
  const [notification, setNotification] = useState({
    message: "",
    type: "info",
  });
  const { globalError, setAppError } = useAuth();

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-inter">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route
            path="/ulogin"
            element={<Ulogin showNotification={showNotification} />}
          />
          <Route
            path="/usignup"
            element={<Usignup showNotification={showNotification} />}
          />
          <Route
            path="/alogin"
            element={<Alogin showNotification={showNotification} />}
          />
          <Route
            path="/asignup"
            element={<Asignup showNotification={showNotification} />}
          />
          <Route path="/unav" element={<Uservices />} />

          {/* Routes accessible to authenticated users (user and admin) */}
          <Route element={<ProtectedRoute allowedRoles={["user", "admin"]} />}>
            {/* Common Authenticated Routes */}
            <Route path="/uhome" element={<Uhome />} />
            <Route path="/ahome" element={<Ahome />} />
            <Route
              path="/uproducts"
              element={<Uproducts showNotification={showNotification} />}
            />
            <Route
              path="/weather"
              element={<Weather showNotification={showNotification} />}
            />
            <Route
              path="/crop/:name"
              element={<ViewCropData showNotification={showNotification} />}
            />
            <Route
              path="/cropsdetails"
              element={<CropsDetails showNotification={showNotification} />}
            />
            {/* Crop Info detail route */}
            <Route
              path="/cropinfo/:id"
              element={<CropInfoDetails showNotification={showNotification} />}
            />

            <Route
              path="/buyproduct/:id"
              element={<BuyProduct showNotification={showNotification} />}
            />
            <Route
              path="/mybookings"
              element={<Mybookings showNotification={showNotification} />}
            />
            <Route
              path="/addcrop"
              element={<AddCrop showNotification={showNotification} />}
            />
            <Route
              path="/getcrops"
              element={<GetCrops showNotification={showNotification} />}
            />
            <Route
              path="/updatecrop/:id"
              element={<UpdateCrop showNotification={showNotification} />}
            />

            <Route
              path="/addfarm"
              element={<AddFarm showNotification={showNotification} />}
            />
            <Route
              path="/getfarms"
              element={<GetFarms showNotification={showNotification} />}
            />
            <Route
              path="/updatefarm/:id"
              element={<UpdateFarm showNotification={showNotification} />}
            />

            <Route
              path="/users"
              element={<Users showNotification={showNotification} />}
            />
            <Route
              path="/useredit/:id"
              element={<UserEdit showNotification={showNotification} />}
            />
            <Route
              path="/addproduct"
              element={<AddProduct showNotification={showNotification} />}
            />
            <Route
              path="/getproducts"
              element={<GetProducts showNotification={showNotification} />}
            />
            <Route
              path="/editproduct/:id"
              element={<EditProduct showNotification={showNotification} />}
            />

            <Route
              path="/admin/bookings"
              element={
                <AdminBookingManagement showNotification={showNotification} />
              }
            />

            {/* Admin-only nested routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route
                path="/admin/cropinfos"
                element={<CropInfoList showNotification={showNotification} />}
              />
              <Route
                path="/admin/cropinfos/add"
                element={<AddCropInfo showNotification={showNotification} />}
              />
              <Route
                path="/admin/cropinfos/edit/:id"
                element={<EditCropInfo showNotification={showNotification} />}
              />
            </Route>
          </Route>

          {/* Unauthorized page */}
          <Route
            path="/unauthorized"
            element={
              <h1 className="text-red-500 text-3xl mt-20 text-center">
                403 - Access Denied! You do not have permission to view this
                page.
              </h1>
            }
          />

          {/* Fallback route */}
          <Route
            path="*"
            element={
              <h1 className="text-red-500 text-3xl mt-20 text-center">
                404 - Page Not Found
              </h1>
            }
          />
        </Routes>
      </main>

      {/* Global error notification */}
      {globalError && (
        <Notification
          message={globalError}
          type="error"
          duration={5000}
          onClose={() => setAppError(null)}
        />
      )}

      {/* Local notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: "info" })}
      />
    </div>
  );
}

export default App;
