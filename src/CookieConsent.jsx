import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCookieConsent } from "./contexts/CookieConsentContext.jsx";
import { FaTimes } from "react-icons/fa";

const defaultPrefs = {
  required: true,
  personalization: false,
  marketing: false,
  analytics: false,
};

export default function CookieConsent() {
  const { t } = useTranslation();
  const {
    consent,
    showBanner,
    showPreferencesModal,
    setShowBanner,
    acceptAll,
    declineAll,
    savePreferences,
    openPreferences,
    closePreferencesModal,
  } = useCookieConsent();

  const [prefs, setPrefs] = useState(defaultPrefs);

  useEffect(() => {
    if (showPreferencesModal && consent) {
      setPrefs({
        required: true,
        personalization: !!consent.personalization,
        marketing: !!consent.marketing,
        analytics: !!consent.analytics,
      });
    } else if (showPreferencesModal && !consent) {
      setPrefs(defaultPrefs);
    }
  }, [showPreferencesModal, consent]);

  const handleManagePreferences = () => {
    openPreferences();
  };

  const handleAccept = () => {
    acceptAll();
    closePreferencesModal();
  };

  const handleDecline = () => {
    declineAll();
    closePreferencesModal();
  };

  const handleSaveChoices = () => {
    savePreferences(prefs);
    closePreferencesModal();
  };

  const handleAcceptAll = () => {
    acceptAll();
    closePreferencesModal();
  };

  const handleDeclineAll = () => {
    declineAll();
    closePreferencesModal();
  };

  const closeModal = () => closePreferencesModal();

  if (!showBanner && !showPreferencesModal) return null;

  if (showPreferencesModal) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-siteDark/50">
        <div
          className="bg-siteWhite text-siteText rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-siteBorder"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-siteBorder">
            <h2 className="text-siteText text-sm font-bold uppercase tracking-wide">
              {t("cookie.preferencesTitle")}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-3 py-1.5 text-sm text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {t("cookie.acceptAll")}
              </button>
              <button
                type="button"
                onClick={handleDeclineAll}
                className="px-3 py-1.5 text-sm text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {t("cookie.declineAll")}
              </button>
              <button
                type="button"
                onClick={handleSaveChoices}
                className="px-3 py-1.5 text-sm text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {t("cookie.saveChoices")}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-siteText text-siteBg hover:opacity-85 transition"
                aria-label="Close"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-siteText text-lg font-semibold mb-2">{t("cookie.controlTitle")}</h3>
            <p className="text-sm text-siteText opacity-80 mb-6">{t("cookie.controlIntro")}</p>

            {/* Required */}
            <div className="flex gap-3 mb-4">
              <input
                type="checkbox"
                id="cookie-required"
                checked={prefs.required}
                disabled
                className="mt-1 rounded border-siteBorder text-siteText"
              />
              <label htmlFor="cookie-required" className="flex-1 text-siteText">
                <span className="font-medium block">{t("cookie.requiredLabel")}</span>
                <span className="text-sm text-siteText opacity-80">{t("cookie.requiredDesc")}</span>
              </label>
            </div>

            {/* Personalization */}
            <div className="flex gap-3 mb-4">
              <input
                type="checkbox"
                id="cookie-personalization"
                checked={prefs.personalization}
                onChange={(e) => setPrefs((p) => ({ ...p, personalization: e.target.checked }))}
                className="mt-1 rounded border-siteBorder text-siteText"
              />
              <label htmlFor="cookie-personalization" className="flex-1 text-siteText">
                <span className="font-medium block">{t("cookie.personalizationLabel")}</span>
                <span className="text-sm text-siteText opacity-80">{t("cookie.personalizationDesc")}</span>
              </label>
            </div>

            {/* Marketing */}
            <div className="flex gap-3 mb-4">
              <input
                type="checkbox"
                id="cookie-marketing"
                checked={prefs.marketing}
                onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                className="mt-1 rounded border-siteBorder text-siteText"
              />
              <label htmlFor="cookie-marketing" className="flex-1 text-siteText">
                <span className="font-medium block">{t("cookie.marketingLabel")}</span>
                <span className="text-sm text-siteText opacity-80">{t("cookie.marketingDesc")}</span>
              </label>
            </div>

            {/* Analytics */}
            <div className="flex gap-3 mb-6">
              <input
                type="checkbox"
                id="cookie-analytics"
                checked={prefs.analytics}
                onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                className="mt-1 rounded border-siteBorder text-siteText"
              />
              <label htmlFor="cookie-analytics" className="flex-1 text-siteText">
                <span className="font-medium block">{t("cookie.analyticsLabel")}</span>
                <span className="text-sm text-siteText opacity-80">{t("cookie.analyticsDesc")}</span>
              </label>
            </div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between pt-4 border-t border-siteBorder">
              <button
                type="button"
                onClick={closeModal}
                className="text-sm text-siteText opacity-80 hover:opacity-100 underline transition"
              >
                {t("cookie.managePreferences")}
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-4 py-2 text-sm text-siteText border border-siteText rounded hover:bg-siteLight transition"
                >
                  {t("cookie.decline")}
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-4 py-2 text-sm bg-siteText text-siteBg border border-siteText rounded hover:opacity-85 transition"
                >
                  {t("cookie.accept")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Initial banner */
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 md:p-6 bg-siteDark/40">
      <div className="bg-siteWhite text-siteText rounded-xl shadow-xl w-full max-w-5xl border border-siteBorder">
        <div className="p-5 md:p-6 md:flex md:items-center md:justify-between md:gap-8">
          {/* Text */}
          <div className="md:flex-1">
            <h2 className="text-siteText text-base font-bold uppercase tracking-wide">
              {t("cookie.bannerTitle")}
            </h2>
            <p className="text-sm text-siteText opacity-90 mt-2">
              {t("cookie.bannerMessage")} {t("cookie.learnMore")}{" "}
              <Link
                to="/privacy-policy"
                className="text-siteText underline font-medium hover:opacity-80"
                onClick={() => setShowBanner(false)}
              >
                {t("privacyPolicy.title")}
              </Link>
              .
            </p>

            {/* Desktop: preferences link under text */}
            <button
              type="button"
              onClick={handleManagePreferences}
              className="hidden md:inline-flex mt-3 text-sm text-siteText underline hover:opacity-80 transition"
            >
              {t("cookie.managePreferences")}
            </button>
          </div>

          {/* Actions */}
          <div className="mt-5 md:mt-0 md:flex md:items-center md:gap-3 md:shrink-0">
            {/* Mobile: full width buttons */}
            <div className="md:hidden grid gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="w-full px-4 py-3 text-sm font-semibold bg-siteText text-siteBg border border-siteText rounded hover:opacity-85 transition"
              >
                {t("cookie.accept")}
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="w-full px-4 py-3 text-sm font-semibold text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {t("cookie.decline")}
              </button>
              <button
                type="button"
                onClick={handleManagePreferences}
                className="w-full text-sm text-siteText underline hover:opacity-80 transition"
              >
                {t("cookie.managePreferences")}
              </button>
            </div>

            {/* Desktop: buttons inline */}
            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={handleAccept}
                className="px-8 py-2.5 text-sm font-semibold bg-siteText text-siteBg border border-siteText rounded hover:opacity-85 transition"
              >
                {t("cookie.accept")}
              </button>
              <button
                type="button"
                onClick={handleDecline}
                className="px-8 py-2.5 text-sm font-semibold text-siteText border border-siteText rounded hover:bg-siteLight transition"
              >
                {t("cookie.decline")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
