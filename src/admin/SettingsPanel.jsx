// src/admin/SettingsPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";
import toast from "react-hot-toast";

export default function SettingsPanel() {
  const [settings, setSettings] = useState({ siteName: "", contactEmail: "", themeColor: "" });
  const { token } = useAuth();
const [heroFile, setHeroFile] = useState(null);

  useEffect(() => {
    api.get("/admin/settings")
      .then(res => setSettings(res.data))
      .catch(console.error);
  }, []);

  const save = () => {
    api.post("/admin/settings", settings)
      .then(() => toast.success("Settings saved successfully."))
      .catch(() => toast.error("Could not save settings. Please try again."));
  };

  const uploadHero = () => {
  if (!heroFile) {
    toast.error("Please select an image first.");
    return;
  }

  const form = new FormData();
  form.append("heroImage", heroFile);

  api.post("/admin/settings/hero-image", form)
    .then(res => {
      toast.success("Hero image has been updated successfully.");
      window.location.reload();
    })
    .catch(() => toast.error("Could not upload image. Please try again."));
};

  return (
    <div>
      <h2 className="text-xl font-semibold text-[] mb-4">Settings</h2>
      <div className="bg-white rounded shadow p-4 max-w-xl">
        <label className="block mb-2">Site Name</label>
        <input
          value={settings.siteName}
          onChange={e => setSettings({ ...settings, siteName: e.target.value })}
          className="border p-2 w-full mb-3"
        />
        <label className="block mb-2">Contact Email</label>
        <input
          value={settings.contactEmail}
          onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
          className="border p-2 w-full mb-3"
        />
        <label className="block mb-2">Theme Color</label>
        <input
          type="color"
          value={settings.themeColor}
          onChange={e => setSettings({ ...settings, themeColor: e.target.value })}
          className="border p-1 w-20 mb-3"
        />
        <label className="block mb-2">Hero Image</label>
<input 
  type="file"
  onChange={(e) => setHeroFile(e.target.files[0])}
  className="border p-2 w-full mb-3"
/>

        <div className="flex justify-end">
          <button onClick={save} className="px-4 py-2 bg-[] text-white rounded">
            Save
          </button>
          <button 
  onClick={uploadHero}
className="px-4 py-2 bg-[#594539] text-white rounded ml-3 hover:bg-[#4a3a30] transition"
>
  Upload Hero Image
</button>

        </div>
      </div>
    </div>
  );
}

