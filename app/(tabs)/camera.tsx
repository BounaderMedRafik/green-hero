import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Ensure this URL is active
const BASE_URL = "https://ab328800d253.ngrok-free.app/api/waste/classify/adam";

export default function CameraPage() {
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"reuse" | "recycle">("reuse");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<{
    label: string;
    suggestions: string[];
    recycle_steps: string[];
    location?: string;
  } | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <ThemedText style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera
        </ThemedText>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.tint }]}
          onPress={requestPermission}
        >
          <ThemedText style={{ color: "#FFF", fontWeight: "700" }}>
            Grant Permission
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  const analyzeWaste = async (imageUri: string) => {
    setIsAnalyzing(true);
    const formData = new FormData();

    // @ts-ignore
    formData.append("image", {
      uri: imageUri,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(`${BASE_URL}`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
      });

      const data = await response.json();
      console.log("Postman-matching data:", data);

      if (data.success) {
        setAnalysisResult({
          // Match Postman: "waste_type": "plastic bottle"
          label: data.waste_type || "Classified Item",

          // Match Postman: The AI text is in "response"
          // We put it in suggestions so it shows up in your REUSE tab
          suggestions: [data.response],

          // Since the API doesn't give separate steps, we'll show a fallback
          // or you can split the response text if it contains steps.
          recycle_steps: [
            "Please follow the advice in the Reuse tab for this item.",
          ],

          location: "Check local recycling bins",
        });
      } else {
        Alert.alert("Error", data.error || "Could not analyze item.");
      }
    } catch (error) {
      console.error("API Error:", error);
      Alert.alert("Network Error", "Check your ngrok tunnel.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.5,
        });
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          await analyzeWaste(photo.uri);
        }
      } catch (error) {
        console.error("Capture Failed:", error);
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setActiveTab("reuse");
  };

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <CameraView style={styles.camera} ref={cameraRef}>
          <View style={styles.overlay}>
            <View style={styles.scanGuide} />
            <ThemedText style={styles.guideText}>
              Point at an item to analyze
            </ThemedText>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={takePicture}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <ActivityIndicator color="#FFF" size="large" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.fullImage} />
          <View
            style={[styles.bottomSheet, { backgroundColor: theme.background }]}
          >
            <View style={styles.sheetHeader}>
              <View style={styles.dragHandle} />
              <TouchableOpacity style={styles.closeBtn} onPress={resetCamera}>
                <Ionicons name="close-circle" size={32} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "reuse" && {
                    borderBottomColor: theme.tint,
                    borderBottomWidth: 3,
                  },
                ]}
                onPress={() => setActiveTab("reuse")}
              >
                <ThemedText
                  style={[
                    styles.tabLabel,
                    activeTab === "reuse" && { color: theme.tint },
                  ]}
                >
                  REUSE
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  activeTab === "recycle" && {
                    borderBottomColor: theme.tint,
                    borderBottomWidth: 3,
                  },
                ]}
                onPress={() => setActiveTab("recycle")}
              >
                <ThemedText
                  style={[
                    styles.tabLabel,
                    activeTab === "recycle" && { color: theme.tint },
                  ]}
                >
                  RECYCLE
                </ThemedText>
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.sheetContent}>
              {isAnalyzing ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.tint} />
                  <ThemedText style={{ marginTop: 10 }}>
                    Analyzing...
                  </ThemedText>
                </View>
              ) : analysisResult ? (
                activeTab === "reuse" ? (
                  <View>
                    <ThemedText style={styles.itemTitle}>
                      {analysisResult.label}
                    </ThemedText>
                    <ThemedText style={{ opacity: 0.5, marginBottom: 15 }}>
                      Creative ways to reuse this item:
                    </ThemedText>
                    {analysisResult.suggestions.map((item, index) => (
                      <View key={index} style={styles.ideaCard}>
                        <View
                          style={[
                            styles.stepNum,
                            { backgroundColor: theme.tint + "20" },
                          ]}
                        >
                          <Ionicons
                            name="bulb-outline"
                            size={14}
                            color={theme.tint}
                          />
                        </View>
                        <ThemedText style={styles.ideaText}>{item}</ThemedText>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View>
                    <ThemedText style={styles.itemTitle}>
                      Recycling Guide
                    </ThemedText>
                    <ThemedText style={{ opacity: 0.5, marginBottom: 15 }}>
                      Steps to recycle {analysisResult.label}:
                    </ThemedText>
                    {analysisResult.recycle_steps.map((step, index) => (
                      <View key={index} style={styles.recycleStep}>
                        <View
                          style={[
                            styles.stepNum,
                            { backgroundColor: theme.tint },
                          ]}
                        >
                          <ThemedText
                            style={{ color: "#FFF", fontWeight: "700" }}
                          >
                            {index + 1}
                          </ThemedText>
                        </View>
                        <ThemedText style={styles.stepText}>{step}</ThemedText>
                      </View>
                    ))}
                    {analysisResult.location && (
                      <View
                        style={[
                          styles.locationInfo,
                          { backgroundColor: theme.tint + "15" },
                        ]}
                      >
                        <Ionicons
                          name="location"
                          size={20}
                          color={theme.tint}
                        />
                        <ThemedText
                          style={[styles.locationText, { color: theme.tint }]}
                        >
                          Nearby: {analysisResult.location}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                )
              ) : null}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: { flex: 1 },
  overlay: { flex: 1, justifyContent: "center", alignItems: "center" },
  scanGuide: {
    width: width * 0.7,
    height: width * 0.7,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 30,
    borderStyle: "dashed",
  },
  guideText: {
    color: "#FFF",
    marginTop: 20,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  captureBtn: {
    position: "absolute",
    bottom: 50,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
  previewContainer: { flex: 1 },
  fullImage: { width: width, height: height * 0.45, resizeMode: "cover" },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: width,
    height: height * 0.62,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
  },
  sheetHeader: { alignItems: "center", paddingTop: 12, paddingBottom: 10 },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#DDD",
    borderRadius: 3,
  },
  closeBtn: { position: "absolute", right: 0, top: 10 },
  tabBar: { flexDirection: "row", marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  tabLabel: { fontWeight: "800", fontSize: 16, color: "#8E8E93" },
  sheetContent: { paddingBottom: 40 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  itemTitle: { fontSize: 24, fontWeight: "800", marginBottom: 5 },
  ideaCard: {
    flexDirection: "row",
    gap: 15,
    padding: 15,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.03)",
    marginBottom: 10,
    alignItems: "center",
  },
  ideaText: { flex: 1, fontSize: 14, lineHeight: 20 },
  recycleStep: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 15,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: { fontSize: 15, fontWeight: "500", flex: 1 },
  locationInfo: {
    marginTop: 20,
    padding: 15,
    borderRadius: 15,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  locationText: { fontSize: 13, fontWeight: "600" },
  btn: { padding: 15, borderRadius: 12 },
});
