import React, { createContext, useContext, useState, useCallback } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    title: "",
    message: "",
    confirmText: "OK",
    cancelText: "Cancel",
    onConfirm: () => {},
    onCancel: () => {},
  });

  const showConfirm = useCallback(
    ({
      title = "",
      message,
      confirmText = "OK",
      cancelText = "Cancel",
      onConfirm = () => {},
      onCancel = () => {},
    }) => {
      setState({
        open: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          setState((s) => ({ ...s, open: false }));
          onConfirm();
        },
        onCancel: () => {
          setState((s) => ({ ...s, open: false }));
          onCancel();
        },
      });
    },
    []
  );

  const close = useCallback(() => {
    setState((s) => ({ ...s, open: false }));
  }, []);

  return (
    <ConfirmContext.Provider value={{ showConfirm, close }}>
      {children}
      {state.open && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-siteDark/50">
          <div
            className="bg-siteWhite text-siteText rounded-lg shadow-xl max-w-sm w-full p-6 border border-siteBorder"
            onClick={(e) => e.stopPropagation()}
          >
            {state.title && (
              <h3 className="text-siteText font-semibold text-lg mb-2">{state.title}</h3>
            )}
            <p className="text-siteText mb-6">{state.message}</p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={state.onCancel}
                className="px-4 py-2 text-sm text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {state.cancelText}
              </button>
              <button
                type="button"
                onClick={state.onConfirm}
                className="px-4 py-2 text-sm bg-siteText text-siteBg rounded hover:opacity-85 transition"
              >
                {state.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) return { showConfirm: () => {} };
  return ctx;
}
