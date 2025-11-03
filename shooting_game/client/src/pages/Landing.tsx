import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Target, Play } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export default function Landing({ onStart }: LandingProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 100px,
            rgba(255,255,255,0.03) 100px,
            rgba(255,255,255,0.03) 101px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 100px,
            rgba(255,255,255,0.03) 100px,
            rgba(255,255,255,0.03) 101px
          )`
        }} />
      </div>

      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-10">
        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-sm">
          <div className="flex gap-2 p-2">
            <Button
              variant={language === "tr" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("tr")}
              className={language === "tr" ? "bg-red-600 hover:bg-red-700" : "bg-slate-700/50 hover:bg-slate-600"}
            >
              🇹🇷 TR
            </Button>
            <Button
              variant={language === "en" ? "default" : "outline"}
              size="sm"
              onClick={() => setLanguage("en")}
              className={language === "en" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-700/50 hover:bg-slate-600"}
            >
              🇬🇧 EN
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl space-y-12 text-center">
        {/* Logo and Title */}
        <div className="space-y-6">
          {/* Animated Target Logo */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-20">
                <Target className="w-32 h-32 text-red-500" />
              </div>
              <Target className="w-32 h-32 text-red-500 relative z-10 drop-shadow-2xl" />
            </div>
          </div>

          {/* Game Title */}
          <div className="space-y-3">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-wider drop-shadow-2xl">
              MUZO
            </h1>
            <h2 className="text-5xl md:text-7xl font-black text-red-500 tracking-wider drop-shadow-2xl">
              POLİGON
            </h2>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-slate-300 font-medium tracking-wide">
            {t("gameSubtitle")}
          </p>
        </div>

        {/* Professional Target Display */}
        <div className="flex justify-center py-8">
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 blur-3xl opacity-30">
              <div className="w-64 h-64 bg-red-500 rounded-full mx-auto" />
            </div>
            
            {/* Target */}
            <div className="relative w-64 h-64 mx-auto">
              {/* Professional Target Rings with 3D effect */}
              {[
                { size: 160, color1: "#dc2626", color2: "#b91c1c" },
                { size: 128, color1: "#fef3c7", color2: "#fde68a" },
                { size: 96, color1: "#dc2626", color2: "#b91c1c" },
                { size: 64, color1: "#fef3c7", color2: "#fde68a" },
                { size: 32, color1: "#dc2626", color2: "#b91c1c" }
              ].map((ring, idx) => (
                <div
                  key={idx}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-900 shadow-2xl transition-transform hover:scale-105"
                  style={{
                    width: `${ring.size}px`,
                    height: `${ring.size}px`,
                    background: `radial-gradient(circle at 30% 30%, ${ring.color1}, ${ring.color2})`,
                    boxShadow: `inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.5)`
                  }}
                />
              ))}
              
              {/* Center Bullseye */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-slate-900 shadow-2xl" />
              
              {/* Score Numbers */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-sm">
                10
              </div>
              {[8, 6, 4, 2].map((score, idx) => (
                <div
                  key={score}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-900 font-bold text-xs"
                  style={{
                    marginTop: `${(idx + 2) * 16}px`
                  }}
                >
                  {score}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="space-y-6">
          <Button
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 border-4 border-red-800"
          >
            <Play className="w-8 h-8 mr-3 fill-white" />
            {t("startButton")}
          </Button>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
              <div className="text-center space-y-2">
                <div className="text-3xl">🎯</div>
                <div className="text-white font-semibold">
                  {language === "tr" ? "Gerçekçi Simülasyon" : "Realistic Simulation"}
                </div>
                <div className="text-slate-400 text-sm">
                  {language === "tr" ? "Profesyonel atış deneyimi" : "Professional shooting experience"}
                </div>
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
              <div className="text-center space-y-2">
                <div className="text-3xl">📊</div>
                <div className="text-white font-semibold">
                  {language === "tr" ? "Detaylı İstatistikler" : "Detailed Statistics"}
                </div>
                <div className="text-slate-400 text-sm">
                  {language === "tr" ? "Performans analizi" : "Performance analysis"}
                </div>
              </div>
            </Card>
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-4">
              <div className="text-center space-y-2">
                <div className="text-3xl">📱</div>
                <div className="text-white font-semibold">
                  {language === "tr" ? "Her Cihazda" : "All Devices"}
                </div>
                <div className="text-slate-400 text-sm">
                  {language === "tr" ? "PC ve mobil uyumlu" : "PC and mobile compatible"}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-slate-500 text-sm">
        © 2024 MUZO POLİGON - {language === "tr" ? "Tüm hakları saklıdır" : "All rights reserved"}
      </div>
    </div>
  );
}
