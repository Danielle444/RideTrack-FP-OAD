
const API_CONFIG = {
    baseURL: 'https://localhost:7196/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const API_ENDPOINTS = {
    entries: {
        getAll: '/Entries',
        getByPayer: (payerName) => `/Entries/bypayer/${encodeURIComponent(payerName)}`,
        add: '/Entries',
        update: '/Entries',
        delete: (id) => `/Entries/${id}`
    },
    stalls: {
        getAll: '/Stalls',
        getByPayer: (payerName) => `/Stalls/bypayer/${encodeURIComponent(payerName)}`,
        add: '/Stalls',
        update: '/Stalls',
        delete: (id) => `/Stalls/${id}`
    },
    shavings: {
        getAll: '/ShavingOrders',
        getByPayer: (payerName) => `/ShavingOrders/bypayer/${encodeURIComponent(payerName)}`,
        add: '/ShavingOrders',
        update: '/ShavingOrders',
        delete: (id) => `/ShavingOrders/${id}`
    },
    paidTimes: {
        getAll: '/PaidTimes',
        getByPayer: (payerName) => `/PaidTimes/bypayer/${encodeURIComponent(payerName)}`,
        add: '/PaidTimes',
        update: '/PaidTimes',
        delete: (id) => `/PaidTimes/${id}`
    }
};

const APP_CONFIG = {
    appName: 'RideTrack',
    version: '1.0.0',
    defaultLanguage: 'he',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: '₪',
    toastDuration: 5000, // 
    loadingDelay: 300,
    whatsappNumber: '+972-546788443',
    whatsappMessage: 'שלום, אני צריך עזרה עם מערכת RideTrack'
};

const UI_CONFIG = {
    animations: {
        enabled: true,
        duration: 300
    },
    pagination: {
        itemsPerPage: 20
    },
    search: {
        minCharacters: 2,
        debounceTime: 300
    }
};

const VALIDATION_RULES = {
    required: {
        validate: (value) => value !== null && value !== undefined && value !== '',
        message: 'שדה חובה'
    },
    number: {
        validate: (value) => !isNaN(value) && value > 0,
        message: 'חייב להיות מספר חיובי'
    },
    email: {
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'כתובת מייל לא תקינה'
    },
    phone: {
        validate: (value) => /^0\d{1,2}-?\d{7}$/.test(value),
        message: 'מספר טלפון לא תקין'
    },
    date: {
        validate: (value) => !isNaN(Date.parse(value)),
        message: 'תאריך לא תקין'
    }
};

const ERROR_MESSAGES = {
    network: 'שגיאת רשת. אנא בדוק את החיבור לאינטרנט',
    server: 'שגיאת שרת. אנא נסה שוב מאוחר יותר',
    notFound: 'הפריט לא נמצא',
    unauthorized: 'אין הרשאה לבצע פעולה זו',
    validation: 'אנא מלא את כל השדות הנדרשים',
    unknown: 'אירעה שגיאה לא צפויה'
};

const SUCCESS_MESSAGES = {
    add: 'הפריט נוסף בהצלחה',
    update: 'הפריט עודכן בהצלחה',
    delete: 'הפריט נמחק בהצלחה',
    load: 'הנתונים נטענו בהצלחה'
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        API_ENDPOINTS,
        APP_CONFIG,
        UI_CONFIG,
        VALIDATION_RULES,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES
    };
}