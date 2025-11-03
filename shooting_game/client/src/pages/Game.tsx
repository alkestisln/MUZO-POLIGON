import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RotateCcw, Home } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Shot {
  x: number;
  y: number;
  score: number;
}

interface GameProps {
  onBackToMenu: () => void;
}

export default function Game({ onBackToMenu }: GameProps) {
  const { t } = useLanguage();
  const [bullets, setBullets] = useState(15);
  const [shots, setShots] = useState<Shot[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  // Hedef merkezini hesapla
  const calculateScore = (x: number, y: number, targetX: number, targetY: number) => {
    const distance = Math.sqrt(Math.pow(x - targetX, 2) + Math.pow(y - targetY, 2));
    const maxDistance = 150;
    
    if (distance > maxDistance) return 0;
    if (distance < 20) return 10;
    if (distance < 50) return 8;
    if (distance < 80) return 6;
    if (distance < 110) return 4;
    if (distance < 140) return 2;
    return 1;
  };

  const handleShoot = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (bullets <= 0 || gameOver) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      if (e.button !== 2) return;
      e.preventDefault();
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const targetX = rect.width / 2;
    const targetY = rect.height / 2;
    
    const score = calculateScore(x, y, targetX, targetY);
    
    const newShot = { x, y, score };
    const newShots = [...shots, newShot];
    setShots(newShots);
    
    const newBullets = bullets - 1;
    setBullets(newBullets);
    
    const newTotal = totalScore + score;
    setTotalScore(newTotal);

    playShootSound();

    if (newBullets === 0) {
      setGameOver(true);
    }
  };

  const playShootSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const resetGame = () => {
    setBullets(15);
    setShots([]);
    setGameOver(false);
    setTotalScore(0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setCursorPos({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  useEffect(() => {
    const preventDefault = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', preventDefault);
    return () => document.removeEventListener('contextmenu', preventDefault);
  }, []);

  const getPerformanceMessage = () => {
    if (totalScore >= 120) return t("perfectShot");
    if (totalScore >= 90) return t("greatPerformance");
    if (totalScore >= 60) return t("goodJob");
    return t("tryAgain");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header with Back Button */}
        <div className="flex justify-between items-center">
          <Button
            onClick={onBackToMenu}
            variant="outline"
            className="bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
          >
            <Home className="w-4 h-4 mr-2" />
            {t("backToMenu")}
          </Button>
          <div className="text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-white">MUZO POLİGON</h1>
            <p className="text-slate-300 text-sm">
              {gameOver ? t("gameOver") : t("aimAndShoot")}
            </p>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-slate-700/50 border-slate-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{bullets}</div>
              <div className="text-sm text-slate-300">{t("remainingBullets")}</div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-700/50 border-slate-600">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{totalScore}</div>
              <div className="text-sm text-slate-300">{t("totalScore")}</div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-700/50 border-slate-600 col-span-2 md:col-span-1">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{shots.length}</div>
              <div className="text-sm text-slate-300">{t("shotCount")}</div>
            </div>
          </Card>
        </div>

        {/* Game Area */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-4 border-slate-600">
          <div
            ref={canvasRef}
            className="relative w-full aspect-video cursor-none"
            onMouseDown={handleShoot}
            onMouseMove={handleMouseMove}
            onTouchStart={handleShoot}
            onTouchMove={handleTouchMove}
            style={{ touchAction: 'none' }}
          >
            {/* Polygon Background Texture */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 50px,
                  rgba(0,0,0,0.1) 50px,
                  rgba(0,0,0,0.1) 51px
                ),
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 50px,
                  rgba(0,0,0,0.1) 50px,
                  rgba(0,0,0,0.1) 51px
                )`
              }} />
            </div>

            {/* Professional Target */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {[
                  { size: 150, color1: "#dc2626", color2: "#b91c1c" },
                  { size: 120, color1: "#fef3c7", color2: "#fde68a" },
                  { size: 90, color1: "#dc2626", color2: "#b91c1c" },
                  { size: 60, color1: "#fef3c7", color2: "#fde68a" },
                  { size: 30, color1: "#dc2626", color2: "#b91c1c" }
                ].map((ring, idx) => (
                  <div
                    key={idx}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-900"
                    style={{
                      width: `${ring.size * 2}px`,
                      height: `${ring.size * 2}px`,
                      background: `radial-gradient(circle at 30% 30%, ${ring.color1}, ${ring.color2})`,
                      boxShadow: `inset 0 2px 8px rgba(0,0,0,0.3)`
                    }}
                  />
                ))}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-black border-4 border-slate-900" />
              </div>
            </div>

            {/* Shot Marks */}
            {shots.map((shot, idx) => (
              <div
                key={idx}
                className="absolute w-3 h-3 rounded-full bg-black border-2 border-white shadow-lg"
                style={{
                  left: `${shot.x}px`,
                  top: `${shot.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-white font-bold text-sm bg-black/70 px-2 py-1 rounded whitespace-nowrap">
                  +{shot.score}
                </div>
              </div>
            ))}

            {/* Crosshair */}
            {!gameOver && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-white opacity-80" />
                  <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white -translate-x-1/2" />
                  <div className="absolute top-1/2 left-0 h-0.5 w-full bg-white -translate-y-1/2" />
                  <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-red-500" />
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            {/* Game Over Screen */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <Card className="p-8 bg-slate-800 border-slate-600 text-center space-y-6 max-w-md mx-4">
                  <h2 className="text-3xl font-bold text-white">{t("gameOver")}</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="text-6xl font-bold text-green-400">{totalScore}</div>
                      <div className="text-xl text-slate-300">{t("totalScore")}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                      <div className="bg-slate-700/50 p-3 rounded">
                        <div className="text-sm text-slate-400">{t("shotCount")}</div>
                        <div className="text-2xl font-bold text-white">{shots.length}</div>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded">
                        <div className="text-sm text-slate-400">{t("average")}</div>
                        <div className="text-2xl font-bold text-white">
                          {shots.length > 0 ? (totalScore / shots.length).toFixed(1) : 0}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <p className="text-yellow-400 font-bold text-xl">{getPerformanceMessage()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={resetGame}
                      size="lg"
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      {t("playAgain")}
                    </Button>
                    <Button
                      onClick={onBackToMenu}
                      variant="outline"
                      size="lg"
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
                    >
                      <Home className="w-5 h-5 mr-2" />
                      {t("backToMenu")}
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Controls Info */}
        <Card className="p-4 bg-slate-700/50 border-slate-600">
          <div className="text-center text-slate-300 space-y-2">
            <p className="font-semibold">{t("howToPlay")}</p>
            <div className="flex flex-col md:flex-row justify-center gap-4 text-sm">
              <span>🖱️ {t("pcControl")}</span>
              <span>📱 {t("mobileControl")}</span>
            </div>
          </div>
        </Card>

        {/* Reset Button */}
        {!gameOver && (
          <div className="flex justify-center">
            <Button
              onClick={resetGame}
              variant="outline"
              className="bg-slate-700 hover:bg-slate-600 text-white border-slate-500"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("resetGame")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
