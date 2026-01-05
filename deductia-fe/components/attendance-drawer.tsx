"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MapPin, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";
import api from "@/lib/axios";
import { Session } from "@/types/api";
import { useQueryClient } from "@tanstack/react-query";
import * as faceapi from "face-api.js";

interface AttendanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  session?: Session;
}

type Step = "camera" | "location" | "submit" | "success";

export default function AttendanceDrawer({
  isOpen,
  onClose,
  session,
}: AttendanceDrawerProps) {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<{
    geofencing_enabled: boolean;
  } | null>(null);

  const [step, setStep] = useState<Step>("camera");
  const [detection, setDetection] = useState(false);
  const [location, setLocation] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const modelsLoaded = useRef(false);

  
  useEffect(() => {
    if (isOpen) {
      api
        .get("/attendance-settings")
        .then((res) => {
          setSettings(res.data.data);
        })
        .catch((err) => console.error("Failed to fetch settings", err));
    }
  }, [isOpen]);

  
  useEffect(() => {
    const loadModels = async () => {
      if (!modelsLoaded.current) {
        try {
          await faceapi.loadTinyFaceDetectorModel("/models");
          modelsLoaded.current = true;
          console.log("FaceAPI models loaded");
        } catch (error) {
          console.error("Failed to load FaceAPI models", error);
        }
      }
    };
    loadModels();
  }, []);

  
  useEffect(() => {
    if (isOpen) {
      setStep("camera");
      setDetection(false);
      setLocation("");
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen]);

  const [photo, setPhoto] = useState<Blob | null>(null);

  const capturePhoto = (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (videoRef.current) {
        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              resolve(blob);
            },
            "image/jpeg",
            0.8
          );
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  const [cameraError, setCameraError] = useState<string | null>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "Camera API not available. Please use HTTPS or Localhost."
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          startDetection();
        };
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        setCameraError(
          "Camera permission denied. Please allow access in browser settings."
        );
      } else if (err.message.includes("HTTPS")) {
        setCameraError(
          "Camera requires a secure connection (HTTPS) or Localhost."
        );
      } else {
        setCameraError("Failed to access camera. " + (err.message || ""));
      }
    }
  };

  const startDetection = () => {
    if (detectionInterval.current) clearInterval(detectionInterval.current);

    detectionInterval.current = setInterval(async () => {
      if (
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended &&
        modelsLoaded.current
      ) {
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );

          if (detections.length > 0) {
            setDetection(true);
          } else {
            setDetection(false);
          }
        } catch (err) {
          
        }
      }
    }, 500); 
  };

  const stopCamera = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleNextStep = async () => {
    if (step === "camera") {
      
      const capturedBlob = await capturePhoto();
      if (!capturedBlob) {
        alert("Failed to capture photo. Please try again.");
        return;
      }
      setPhoto(capturedBlob);

      stopCamera();

      
      if (settings && !settings.geofencing_enabled) {
        setStep("submit");
        
        submitAttendance(0, 0, capturedBlob);
        return;
      }

      setStep("location");

      
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation(`${latitude}, ${longitude}`); 
            
          },
          (error) => {
            alert("Location access needed.");
            setStep("camera"); 
          }
        );
      } else {
        alert("Geolocation not supported.");
      }
    } else if (step === "location") {
      
      const [lat, lng] = location.split(",").map((s) => parseFloat(s.trim()));
      submitAttendance(lat || 0, lng || 0, photo);
    }
  };

  const submitAttendance = async (
    lat: number,
    lng: number,
    photoBlob: Blob | null
  ) => {
    setStep("submit");

    if (!photoBlob) {
      alert("No photo captured!");
      setStep("camera");
      return;
    }

    const formData = new FormData();
    formData.append("latitude", lat.toString());
    formData.append("longitude", lng.toString());
    
    formData.append("face_detected", "true");
    formData.append("selfie", photoBlob, "attendance.jpg");

    try {
      await api.post(`/sessions/${session?.id}/attend`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      queryClient.invalidateQueries({ queryKey: ["myAttendances"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      setStep("success");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to submit attendance.");
      setStep("location");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 rounded-t-3xl p-6 z-50 h-[80vh] md:h-[600px] flex flex-col"
          >
            {}
            <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Attendance Check-in
              </h2>
              <button
                onClick={onClose}
                className="p-2 bg-muted rounded-full hover:bg-muted/80"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
              {}
              {step === "camera" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full flex flex-col items-center gap-4"
                >
                  <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden bg-black border-2 border-primary/30">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {}
                    <div
                      className={clsx(
                        "absolute inset-0 border-[3px] rounded-2xl transition-colors duration-300",
                        detection
                          ? "border-green-500"
                          : "border-primary opacity-50 scanner-animation"
                      )}
                    />

                    {detection && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Face Detected
                      </motion.div>
                    )}
                  </div>
                  <p className="text-zinc-400 text-center">
                    {cameraError ? (
                      <span className="text-red-400 font-bold block bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                        {cameraError}
                      </span>
                    ) : (
                      "Position your face within the frame"
                    )}
                  </p>
                </motion.div>
              )}

              {}
              {step === "location" && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="w-full flex flex-col items-center gap-6"
                >
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                    <MapPin className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">
                      {location ? "Location Verified" : "Checking Location..."}
                    </h3>
                    <p className="text-zinc-400 mt-1">
                      {location || "Please wait while we verify your location"}
                    </p>
                  </div>
                </motion.div>
              )}

              {}
              {step === "submit" && (
                <motion.div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-zinc-400">Submitting attendance...</p>
                </motion.div>
              )}

              {}
              {step === "success" && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    You're Checked In!
                  </h3>
                  <p className="text-zinc-400">Class: Computer Vision (A)</p>
                </motion.div>
              )}
            </div>

            {}
            <div className="mt-6 pt-4 border-t border-white/5">
              {step === "camera" && (
                <div className="w-full space-y-3">
                  <button
                    onClick={handleNextStep}
                    disabled={!detection}
                    className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground"
                  >
                    {detection ? "Capture & Continue" : "Detecting Face..."}
                  </button>
                  {cameraError && (
                    <button
                      onClick={() => {
                        
                        startCamera();
                      }}
                      className="w-full py-3 bg-muted hover:bg-muted/80 rounded-xl font-medium text-sm transition-all text-muted-foreground"
                    >
                      Retry Camera
                    </button>
                  )}
                </div>
              )}
              {step === "location" && location && (
                <button
                  onClick={handleNextStep}
                  className="w-full py-4 bg-primary hover:bg-primary/90 rounded-xl font-bold transition-all text-primary-foreground"
                >
                  Submit Attendance
                </button>
              )}
              {step === "success" && (
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-bold transition-all"
                >
                  Done
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
