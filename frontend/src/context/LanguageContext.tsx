import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
    [key: string]: {
        en: string;
        hi: string;
    };
}

export const translations: Translations = {
    // Navbar & Global
    appName: { en: 'RestrauBuddy', hi: 'रेस्तरां बडी' },
    search: { en: 'Search...', hi: 'खोजें...' },
    notifications: { en: 'Notifications', hi: 'सूचनाएं' },
    profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },

    // Sidebar
    dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
    inventoryOpt: { en: 'Inventory Opt', hi: 'इन्वेंटरी' },
    analytics: { en: 'Analytics', hi: 'एनालिटिक्स' },
    settings: { en: 'Settings', hi: 'सेटिंग्स' },
    support: { en: 'Support', hi: 'सहायता' },

    // Dashboard
    welcomeMsg: { en: 'Welcome back, Manager', hi: 'स्वागत है, मैनेजर' },
    dashboardSub: { en: "Here's what's happening today.", hi: 'आज आपके रेस्तरां में यह हो रहा है।' },
    updateLogs: { en: 'Update Logs', hi: 'लॉग अपडेट करें' },
    predictedFootfall: { en: 'Predicted Footfall', hi: 'अनुमानित भीड़' },
    inventoryEfficiency: { en: 'Inventory Efficiency', hi: 'इन्वेंटरी दक्षता' },
    avgPrepTime: { en: 'Avg. Prep Time', hi: 'औसत तैयारी का समय' },
    wasteAlert: { en: 'Waste Alert', hi: 'अपव्यय सचेतक' },
    demandPrediction: { en: 'Demand Prediction', hi: 'मांग का अनुमान' },
    expectedFootfall: { en: 'Expected Footfall', hi: 'अपेक्षित भीड़' },
    confidenceScore: { en: 'Confidence Score', hi: 'विश्वास स्कोर' },
    prepQuantities: { en: 'Prep Quantities (AI Recommended)', hi: 'तैयारी की मात्रा (AI द्वारा सिफारिश)' },
    unexpectedHappenings: { en: 'Unexpected Happenings', hi: 'अचानक होने वाली घटनाएं' },

    // Inventory
    inventoryTitle: { en: 'Inventory Optimization', hi: 'इन्वेंटरी अनुकूलन' },
    inventorySub: { en: 'Manage your stock and view AI restock recommendations.', hi: 'अपना स्टॉक प्रबंधित करें और AI स्टॉक सिफारिशें देखें।' },
    export: { en: 'Export', hi: 'एक्सपोर्ट' },
    orderStock: { en: 'Order Stock', hi: 'स्टॉक ऑर्डर' },
    totalItems: { en: 'Total Items', hi: 'कुल आइटम' },
    criticalItems: { en: 'Critical Items', hi: 'गंभीर आइटम' },
    monthlySpend: { en: 'Avg. Monthly Spend', hi: 'औसत मासिक खर्च' },
    wastePrevented: { en: 'Waste Prevented', hi: 'रोका गया अपव्यय' },
    currentStock: { en: 'Current Stock Levels', hi: 'वर्तमान स्टॉक स्तर' },
    itemName: { en: 'Item Name', hi: 'आइटम का नाम' },
    quantity: { en: 'Quantity', hi: 'मात्रा' },
    price: { en: 'Purchase Price', hi: 'खरीद मूल्य' },
    expiry: { en: 'Expiry Date', hi: 'समाप्ति तिथि' },
    status: { en: 'Status', hi: 'स्थिति' },
    restockPred: { en: 'Restock Predictions', hi: 'पुनर्भरण अनुमान' },

    // Analytics
    analyticsTitle: { en: 'Sales & Demand Analytics', hi: 'बिक्री और मांग विश्लेषण' },
    totalRevenue: { en: 'Total Revenue', hi: 'कुल राजस्व' },
    netProfit: { en: 'Net Profit', hi: 'शुद्ध लाभ' },
    wasteCost: { en: 'Total Waste Cost', hi: 'कुल अपव्यय लागत' },
    avgOrder: { en: 'Avg. Order Value', hi: 'औसत ऑर्डर मूल्य' },
    revenueVsProfit: { en: 'Revenue vs Profit vs Waste', hi: 'राजस्व बनाम लाभ बनाम अपव्यय' },
    topSelling: { en: 'Top Selling Dishes', hi: 'सबसे ज्यादा बिकने वाले व्यंजन' },
    strategyHint: { en: 'AI Strategic Hint', hi: 'AI रणनीतिक संकेत' },

    // Settings
    language: { en: 'Language', hi: 'भाषा' },
    selectLanguage: { en: 'Select Language', hi: 'भाषा चुनें' },
    english: { en: 'English', hi: 'अंग्रेजी' },
    hindi: { en: 'Hindi', hi: 'हिंदी' },
    saveSettings: { en: 'Save Settings', hi: 'सेटिंग्स सहेजें' }
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('language') as Language) || 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[key] ? translations[key][language] : key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
