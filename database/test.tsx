import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";
// 1. Import Socket type
import { io, Socket } from "socket.io-client";

// 2. Define the shape of your data
interface ChatData {
  message: string;
}

// 3. (Optional) Define Server to Client and Client to Server events
interface ServerToClientEvents {
  "chat:receive": (data: ChatData) => void;
}

interface ClientToServerEvents {
  "chat:send": (data: ChatData) => void;
}

export default function Test() {
  // 4. Apply the Socket type to useState
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    // Note: Removed the trailing space from your URL string
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      "https://zander-unknotty-unblamably.ngrok-free.dev",
      {
        transports: ["websocket"],
      }
    );

    newSocket.on("connect", () => {
      console.log("✅ Connected, id:", newSocket.id);
    });

    newSocket.on("chat:receive", (data) => {
      console.log("Message received:", data.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!socket || message.trim() === "") return;

    // Now TypeScript knows exactly what 'chat:send' expects
    socket.emit("chat:send", { message });
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type message"
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});
