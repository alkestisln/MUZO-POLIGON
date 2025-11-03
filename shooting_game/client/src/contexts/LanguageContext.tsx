import { createContext, useContext, useState, ReactNode } from "react";

type Language = "tr" | "en";

interface Translations {
  [key: string]: {
    tr: string;
    en: string;
  };
}

const translations: Translations = {
  // Landing Page
  gameTitle: {
    tr: "MUZO POLİGON",
    en: "MUZO POLYGON"
  },
  gameSubtitle: {
    tr: "Profesyonel Atış Eğitimi Simülatörü",
    en: "Professional Shooting Training Simulator"
  },
  startButton: {
    tr: "BAŞLAT",
    en: "START"
  },
  selectLanguage: {
    tr: "Dil Seçin",
    en: "Select Language"
  },
  
  // Game Page
  polygonShootingGame: {
    tr: "Poligon Atış Oyunu",
    en: "Polygon Shooting Game"
  },
  aimAndShoot: {
    tr: "Nişan al ve ateş et!",
    en: "Aim and shoot!"
  },
  gameOver: {
    tr: "Oyun Bitti!",
    en: "Game Over!"
  },
  remainingBullets: {
    tr: "Kalan Mermi",
    en: "Remaining Bullets"
  },
  totalScore: {
    tr: "Toplam Puan",
    en: "Total Score"
  },
  shotCount: {
    tr: "Atış Sayısı",
    en: "Shot Count"
  },
  howToPlay: {
    tr: "Nasıl Oynanır?",
    en: "How to Play?"
  },
  pcControl: {
    tr: "Bilgisayar: Fare ile nişan al, sağ tık ile ateş et",
    en: "PC: Aim with mouse, right click to shoot"
  },
  mobileControl: {
    tr: "Mobil: Parmağınla nişan al ve dokun",
    en: "Mobile: Aim with finger and tap"
  },
  resetGame: {
    tr: "Oyunu Sıfırla",
    en: "Reset Game"
  },
  playAgain: {
    tr: "Yeniden Oyna",
    en: "Play Again"
  },
  average: {
    tr: "Ortalama",
    en: "Average"
  },
  perfectShot: {
    tr: "🏆 Mükemmel Atış!",
    en: "🏆 Perfect Shot!"
  },
  greatPerformance: {
    tr: "🎯 Harika Performans!",
    en: "🎯 Great Performance!"
  },
  goodJob: {
    tr: "👍 İyi İş!",
    en: "👍 Good Job!"
  },
  tryAgain: {
    tr: "💪 Tekrar Dene!",
    en: "💪 Try Again!"
  },
  backToMenu: {
    tr: "Ana Menüye Dön",
    en: "Back to Menu"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("tr");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
