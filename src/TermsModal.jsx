import React, { useState } from 'react';

export default function TermsModal({ open, onClose, onProceed }) {
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-4">قبل المتابعة إلى الدفع</h3>
        <label className="flex items-start space-x-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
          />
          <span>
            أقر بأنني قرأت وفهمت
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-blue-600 underline mx-1"
            >
              سياسة الخصوصية
            </a>
            و
            <a
              href="/terms-of-sale"
              target="_blank"
              className="text-blue-600 underline mx-1"
            >
              الشروط العامة للبيع
            </a>.
          </span>
        </label>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            إلغاء
          </button>
          <button
            disabled={!checked}
            onClick={() => {
              onProceed();
              setChecked(false);
            }}
            className={
              `px-4 py-2 rounded font-semibold ` +
              (checked
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-300 text-white cursor-not-allowed")
            }
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
