import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75;
const API_BASE =
  "https://zander-unknotty-unblamably.ngrok-free.dev/chatsessions";

export default function ChatPage() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [chats, setChats] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [firstMsg, setFirstMsg] = useState("");

  useEffect(() => {
    loadUserChats();
  }, []);

  const loadUserChats = async () => {
    const token = await SecureStore.getItemAsync("token");
    if (!token) {
      setIsFetching(false);
      return;
    }
    try {
      const response = await fetch(`${API_BASE}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      if (response.ok) {
        const formattedChats = (data.ChatSessions || []).map(
          (session: any) => ({
            id: session._id,
            name: session.title || "Untitled Chat",
            lastMsg: "Click to continue chat",
          })
        );
        setChats(formattedChats);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // --- DELETE CHAT LOGIC ---
  const handleDeleteChat = (sessionId: string) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const token = await SecureStore.getItemAsync("token");
            try {
              const response = await fetch(`${API_BASE}/${sessionId}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });

              const data = await response.json();

              if (response.ok) {
                // Remove from local state
                setChats((prev) =>
                  prev.filter((chat) => chat.id !== sessionId)
                );
                Alert.alert("Deleted", "Chat session removed.");
              } else {
                throw new Error(data.msg || "Failed to delete");
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Could not delete chat.");
            }
          },
        },
      ]
    );
  };

  const handleSendFirstMessage = async () => {
    if (!firstMsg.trim() || isCreating) return;
    const token = await SecureStore.getItemAsync("token");
    setIsCreating(true);

    try {
      const response = await fetch(`${API_BASE}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ msg: firstMsg.trim() }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to create session");

      const newChat = {
        id: data.newSession._id,
        name: data.newSession.title || firstMsg,
        lastMsg: firstMsg,
      };

      setChats((prev) => [newChat, ...prev]);
      setFirstMsg("");
      router.push({
        //@ts-ignore
        pathname: `/chat/${newChat.id}`,
        params: { name: newChat.name },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network error.");
    } finally {
      setIsCreating(false);
    }
  };

  const renderSidebarItem = ({ item }: { item: any }) => (
    <View style={styles.sidebarItemContainer}>
      <TouchableOpacity
        style={styles.sidebarItem}
        onPress={() => {
          setSidebarOpen(false);
          router.push({
            //@ts-ignore
            pathname: `/chat/${item.id}`,
            params: { name: item.name },
          });
        }}
      >
        <View style={[styles.miniAvatar, { backgroundColor: theme.tint }]}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#FFF" />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.sidebarName} numberOfLines={1}>
            {item.name}
          </ThemedText>
          <ThemedText style={styles.sidebarMsg} numberOfLines={1}>
            {item.lastMsg}
          </ThemedText>
        </View>
      </TouchableOpacity>

      {/* Delete Icon */}
      <TouchableOpacity
        onPress={() => handleDeleteChat(item.id)}
        style={styles.deleteIconButton}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSidebarOpen(false)}
        />
      )}

      <View
        style={[
          styles.sidebar,
          {
            backgroundColor: colorScheme === "dark" ? "#151718" : "#F8F9FA",
            left: isSidebarOpen ? 0 : -SIDEBAR_WIDTH,
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <ThemedText style={styles.sidebarTitle}>History</ThemedText>
        </View>
        {isFetching ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={theme.tint} />
        ) : (
          <FlatList
            data={chats}
            keyExtractor={(item) => item.id}
            renderItem={renderSidebarItem}
            contentContainerStyle={{ padding: 10 }}
            ListEmptyComponent={
              <ThemedText style={styles.emptyListText}>
                No recent chats
              </ThemedText>
            }
          />
        )}
      </View>

      <View style={styles.mainContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setSidebarOpen(true)}
            style={styles.menuBtn}
          >
            <Ionicons name="menu-outline" size={28} color={theme.text} />
          </TouchableOpacity>
          <ThemedText type="subtitle">EcoAI</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.centerArea}>
          <View
            style={[styles.iconCircle, { backgroundColor: theme.tint + "10" }]}
          >
            <Ionicons name="leaf-outline" size={60} color={theme.tint} />
          </View>
          <ThemedText style={styles.welcomeTitle}>
            How can I help you recycle?
          </ThemedText>
          <ThemedText style={styles.welcomeSubtitle}>
            Start a new conversation below
          </ThemedText>
        </View>

        <View
          style={[
            styles.inputWrapper,
            { borderTopColor: theme.tabIconDefault + "20" },
          ]}
        >
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F0F2F5",
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Type your first message..."
              placeholderTextColor="#8E8E93"
              value={firstMsg}
              onChangeText={setFirstMsg}
              multiline
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                {
                  backgroundColor: theme.tint,
                  opacity: firstMsg.trim() ? 1 : 0.5,
                },
              ]}
              onPress={handleSendFirstMessage}
              disabled={isCreating || !firstMsg.trim()}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="arrow-up" size={24} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 10,
    elevation: 10,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  sidebarHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc2",
  },
  sidebarTitle: { fontSize: 18, fontWeight: "700" },
  sidebarItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sidebarItem: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    gap: 10,
  },
  deleteIconButton: { padding: 10 },
  miniAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarName: { fontSize: 15, fontWeight: "600" },
  sidebarMsg: { fontSize: 12, opacity: 0.5 },
  emptyListText: { textAlign: "center", marginTop: 20, opacity: 0.5 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 9,
  },
  mainContent: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuBtn: { padding: 4 },
  centerArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: { fontSize: 14, opacity: 0.5, textAlign: "center" },
  inputWrapper: { padding: 20, paddingBottom: Platform.OS === "ios" ? 40 : 20 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 28,
    paddingLeft: 15,
  },
  input: { flex: 1, maxHeight: 100, fontSize: 16, paddingVertical: 8 },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
