import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "decart_cookie_consent";
const DEFAULT_PREFS = {
  required: true,
  personalization: false,
  marketing: false,
  analytics: false,
  timestamp: null,
};

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      required: true,
      personalization: !!data.personalization,
      marketing: !!data.marketing,
      analytics: !!data.analytics,
      timestamp: data.timestamp || null,
    };
  } catch {
    return null;
  }
}

function saveConsent(prefs) {
  const payload = {
    required: true,
    personalization: !!prefs.personalization,
    marketing: !!prefs.marketing,
    analytics: !!prefs.analytics,
    timestamp: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (typeof window !== "undefined") {
    window.__cookieConsent = {
      required: true,
      personalization: payload.personalization,
      marketing: payload.marketing,
      analytics: payload.analytics,
    };
  }
  return payload;
}

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const [consent, setConsentState] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  useEffect(() => {
    const stored = loadConsent();
    setConsentState(stored);
    setShowBanner(stored === null);
    if (stored) {
      window.__cookieConsent = {
        required: true,
        personalization: stored.personalization,
        marketing: stored.marketing,
        analytics: stored.analytics,
      };
    }
  }, []);

  const setConsent = useCallback((prefs) => {
    const payload = saveConsent(prefs);
    setConsentState(payload);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    setConsent({
      required: true,
      personalization: true,
      marketing: true,
      analytics: true,
    });
  }, [setConsent]);

  const declineAll = useCallback(() => {
    setConsent({
      required: true,
      personalization: false,
      marketing: false,
      analytics: false,
    });
  }, [setConsent]);

  const savePreferences = useCallback(
    (prefs) => {
      setConsent({
        required: true,
        personalization: !!prefs.personalization,
        marketing: !!prefs.marketing,
        analytics: !!prefs.analytics,
      });
    },
    [setConsent]
  );

  const openPreferences = useCallback(() => {
    setShowBanner(false);
    setShowPreferencesModal(true);
  }, []);
  const hideBanner = useCallback(() => setShowBanner(false), []);
  const closePreferencesModal = useCallback(() => setShowPreferencesModal(false), []);

  const value = {
    consent,
    showBanner,
    showPreferencesModal,
    setShowBanner,
    setShowPreferencesModal,
    setConsent,
    acceptAll,
    declineAll,
    savePreferences,
    openPreferences,
    hideBanner,
    closePreferencesModal,
    hasConsent: (category) => {
      if (!consent) return false;
      if (category === "required") return true;
      return !!consent[category];
    },
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
}
