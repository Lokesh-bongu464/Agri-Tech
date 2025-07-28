import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditCropInfo = ({ showNotification }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    scientificName: "",
    season: "",
    temperatureRange: "",
    rainfallRange: "",
    soilType: "",
    sowingTime: "",
    harvestTime: "",
    duration: "",
    imgUrl: "",
    pesticides: "",
    fertilizers: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchCropInfo = async () => {
      try {
        const { data } = await api.get(`/cropinfos/${id}`);
        setFormData({
          ...data,
          pesticides: data.pesticides ? data.pesticides.join(", ") : "",
          fertilizers: data.fertilizers ? data.fertilizers.join(", ") : "",
        });
      } catch (error) {
        showNotification("Failed to load crop info.", "error");
        navigate("/admin/cropinfos");
      } finally {
        setLoading(false);
      }
    };
    fetchCropInfo();
  }, [id, navigate, showNotification]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitLoading(true);
    try {
      const payload = {
        ...formData,
        pesticides: formData.pesticides
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        fertilizers: formData.fertilizers
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await api.put(`/cropinfos/${id}`, payload);
      showNotification("Crop Info updated successfully!", "success");
      navigate("/admin/cropinfos");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to update crop info.";
      showNotification(msg, "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-white mt-20">Loading crop info...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Edit Crop Info
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormInput
          label="Crop Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter crop name"
          required
        />
        <FormInput
          label="Scientific Name"
          name="scientificName"
          value={formData.scientificName}
          onChange={handleChange}
          placeholder="Enter scientific name"
        />
        <FormInput
          label="Season"
          name="season"
          value={formData.season}
          onChange={handleChange}
          placeholder="e.g., Summer, Winter"
        />
        <FormInput
          label="Temperature Range"
          name="temperatureRange"
          value={formData.temperatureRange}
          onChange={handleChange}
          placeholder="e.g., 20-30°C"
        />
        <FormInput
          label="Rainfall Range"
          name="rainfallRange"
          value={formData.rainfallRange}
          onChange={handleChange}
          placeholder="e.g., 500-1000mm"
        />
        <FormInput
          label="Soil Type"
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          placeholder="e.g., Sandy Loam"
        />
        <FormInput
          label="Sowing Time"
          name="sowingTime"
          value={formData.sowingTime}
          onChange={handleChange}
          placeholder="Enter sowing time"
        />
        <FormInput
          label="Harvest Time"
          name="harvestTime"
          value={formData.harvestTime}
          onChange={handleChange}
          placeholder="Enter harvest time"
        />
        <FormInput
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration of crop growth"
        />
        <FormInput
          label="Image URL"
          name="imgUrl"
          type="url"
          value={formData.imgUrl}
          onChange={handleChange}
          placeholder="http://example.com/image.jpg"
        />
        <FormInput
          label="Pesticides (comma separated)"
          name="pesticides"
          value={formData.pesticides}
          onChange={handleChange}
          placeholder="e.g., pesticide1, pesticide2"
        />
        <FormInput
          label="Fertilizers (comma separated)"
          name="fertilizers"
          value={formData.fertilizers}
          onChange={handleChange}
          placeholder="e.g., fertilizer1, fertilizer2"
        />
        <button
          type="submit"
          disabled={submitLoading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 rounded text-white font-semibold transition duration-200 disabled:opacity-50"
        >
          {submitLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

const FormInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) => (
  <div>
    <label htmlFor={name} className="block text-gray-300 font-medium mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
    />
  </div>
);

export default EditCropInfo;
