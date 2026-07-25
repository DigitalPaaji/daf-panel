"use client";

import React, { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  const [messages, setMessages] = useState(null);
  const [locale, setLocale] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const lang = localStorage.getItem("lang") || "en";

        const loadedMessages = (
          await import(`../../messages/${lang}.json`)
        ).default;

        setMessages(loadedMessages);
        setLocale(lang);
      } catch (error) {
        console.error("Failed to load translations:", error);

        const fallbackMessages = (
          await import("../../messages/en.json")
        ).default;

        setMessages(fallbackMessages);
        setLocale("en");
      } finally {
        setLoading(false);
      }
    };

    loadLanguage();
  }, []);

  if (loading || !messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      <div className="flex h-screen">
        <div className="h-screen">
          <Sidebar />
        </div>

        <div className="w-full h-screen overflow-auto">
          {children}
        </div>
      </div>
    </NextIntlClientProvider>
  );
};

export default Layout;