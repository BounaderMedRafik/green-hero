import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- API Configuration ---
const BASE_URL = "https://ab328800d253.ngrok-free.app/api";

const sendEcoChatMessage = async (message: string) => {
  const cleanMessage = message.trim();
  if (!cleanMessage) return "I didn't catch that. Could you repeat it?";

  try {
    const response = await fetch(`${BASE_URL}/chat/adam`, {
      method: "POST",
      headers: {
        // 1. Tell the server you expect JSON only
        Accept: "application/json",
        "Content-Type": "application/json",

        // 2. THIS IS THE BIG ONE: Bypasses the Ngrok interrupter page
        // Using any value here stops Ngrok from sending the HTML warning
        "ngrok-skip-browser-warning": "69420",

        // 3. Pretend to be a standard browser/Postman
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
      },
      body: JSON.stringify({
        message: message.toString().trim(), // Force it to be a clean string
      }),
    });

    const data = await response.json();

    // If your backend returns { success: true, response: "..." }
    if (data.success) {
      console.log("EcoAI Response:", data);
      return data.response;
    } else {
      console.warn("API Error:", data.error);
      return "The AI assistant is having trouble thinking right now.";
    }
  } catch (error) {
    console.error("EcoAI Network Error:", error);
    return "Connection error. Please ensure your backend is running and ngrok is active.";
  }
};

export default function ChatDetailScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const hasInitialized = useRef(false);

  // --- AUTO-RESPOND TO FIRST MESSAGE ---
  useEffect(() => {
    // We check if 'name' exists (it's the initial message from the previous screen)
    if (!hasInitialized.current && name) {
      hasInitialized.current = true;
      const initialText = Array.isArray(name) ? name[0] : name;
      handleInitialMessage(initialText);
    }
  }, [name]);

  const handleInitialMessage = async (initialText: string) => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg = {
      id: "initial-user",
      text: initialText,
      sender: "me",
      time: timestamp,
    };

    setMessages([userMsg]);
    setIsTyping(true);

    const aiResponse = await sendEcoChatMessage(initialText);

    const aiMsg = {
      id: "initial-ai",
      text: aiResponse,
      sender: "other",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const sendMessage = async () => {
    if (inputText.trim().length === 0 || isTyping) return;

    const currentText = inputText.trim();
    setInputText("");

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage = {
      id: Date.now().toString(),
      text: currentText,
      sender: "me",
      time: timestamp,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const aiResponse = await sendEcoChatMessage(currentText);

    const aiMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse,
      sender: "other",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? styles.myMsgWrapper : styles.theirMsgWrapper,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isMe
              ? { backgroundColor: theme.tint }
              : {
                  backgroundColor:
                    colorScheme === "dark" ? "#2C2C2E" : "#E9E9EB",
                },
          ]}
        >
          <ThemedText style={[styles.msgText, isMe && { color: "#FFF" }]}>
            {item.text}
          </ThemedText>
        </View>
        <ThemedText style={styles.timeText}>{item.time}</ThemedText>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.tabIconDefault + "20" },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color={theme.tint} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <ThemedText style={styles.headerName}>
            {name || "Eco Assistant"}
          </ThemedText>
          <ThemedText style={styles.onlineStatus}>
            {isTyping ? "EcoAI is thinking..." : "Online"}
          </ThemedText>
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isTyping ? (
            <ActivityIndicator
              size="small"
              color={theme.tint}
              style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 10 }}
            />
          ) : null
        }
      />

      {/* Input Field */}
      <View
        style={[
          styles.inputContainer,
          { borderTopColor: theme.tabIconDefault + "20" },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F0F0F0",
              color: theme.text,
            },
          ]}
          placeholder="Ask about recycling..."
          placeholderTextColor="#687076"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor: theme.tint,
              opacity: inputText.trim() ? 1 : 0.5,
            },
          ]}
          onPress={sendMessage}
          disabled={isTyping || !inputText.trim()}
        >
          <Ionicons name="arrow-up" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
  },
  backBtn: { marginRight: 20 },
  headerTitleWrapper: { flex: 1 },
  headerName: { fontSize: 17, fontWeight: "700", marginBottom: -2 },
  onlineStatus: { fontSize: 12, fontWeight: "500", opacity: 0.6 },
  listContent: { padding: 20, gap: 15 },
  messageWrapper: { maxWidth: "85%", marginBottom: 5 },
  myMsgWrapper: { alignSelf: "flex-end", alignItems: "flex-end" },
  theirMsgWrapper: { alignSelf: "flex-start", alignItems: "flex-start" },
  bubble: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  msgText: { fontSize: 16, lineHeight: 22 },
  timeText: { fontSize: 10, opacity: 0.5, marginTop: 4, marginHorizontal: 5 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
