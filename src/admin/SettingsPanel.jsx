// src/admin/SettingsPanel.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

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
      .then(() => alert("Saved"))
      .catch(() => alert("Error"));
  };

  const uploadHero = () => {
  if (!heroFile) return alert("اختر صورة أولاً!");

  const form = new FormData();
  form.append("heroImage", heroFile);

  api.post("/admin/settings/hero-image", form)
    .then(res => {
      alert("تم تحديث صورة الهيرو بنجاح");
      window.location.reload();
    })
    .catch(() => alert("Error uploading image"));
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
  className="px-4 py-2 bg-blue-600 text-white rounded ml-3"
>
  Upload Hero Image
</button>

        </div>
      </div>
    </div>
  );
}

