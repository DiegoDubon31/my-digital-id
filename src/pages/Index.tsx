import { useRef, useState, useCallback } from "react";
import { Camera, CameraOff, User, IdCard, AlertTriangle } from "lucide-react";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setError("Permiso de cámara denegado. Por favor, permite el acceso a la cámara en la configuración de tu navegador.");
      } else if (err.name === "NotFoundError") {
        setError("No se encontró ninguna cámara en este dispositivo.");
      } else {
        setError("Error al acceder a la cámara: " + err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setStream(null);
    }
  }, [stream]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            <span className="text-accent-foreground font-bold text-lg" style={{ fontFamily: "var(--font-heading)" }}>U</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold leading-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Universidad San Carlos de Guatemala – FIUSAC
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Student Info */}
        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Información del Estudiante
          </h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-sm text-muted-foreground">Nombre Completo</span>
                <p className="font-semibold text-foreground">Diego Andrés Dubón Samayoa</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <IdCard className="w-5 h-5 text-primary shrink-0" />
              <div>
                <span className="text-sm text-muted-foreground">Carnet</span>
                <p className="font-semibold text-foreground">202202429</p>
              </div>
            </div>
          </div>
        </section>

        {/* Webcam Section */}
        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>
            Webcam Access
          </h2>

          <div className="flex flex-wrap gap-3 mb-5">
            <button
              onClick={startCamera}
              disabled={!!stream || isLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-4 h-4" />
              {isLoading ? "Conectando..." : "Activar Cámara"}
            </button>
            <button
              onClick={stopCamera}
              disabled={!stream}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-sm bg-destructive text-destructive-foreground hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CameraOff className="w-4 h-4" />
              Detener Cámara
            </button>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-md p-4 mb-5">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden border">
            {!stream && !error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="w-12 h-12 mb-2 opacity-40" />
                <p className="text-sm">Presiona "Activar Cámara" para comenzar</p>
              </div>
            )}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: stream ? "block" : "none" }}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-3 px-4 text-center text-sm opacity-80">
        FIUSAC – Facultad de Ingeniería, USAC
      </footer>
    </div>
  );
};

export default Index;
