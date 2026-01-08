import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function AddProductPage() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // Form State
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "seeds", // Default from enum
    stock_quantity: "",
    unit: "",
  });

  const categories = [
    { label: "Seeds", value: "seeds" },
    { label: "Fertilizers", value: "fertilizers" },
    { label: "Tools", value: "tools" },
    { label: "Equipment", value: "equipment" },
    { label: "Pesticides", value: "pesticides" },
    { label: "Corp", value: "corp" },
  ];

  // Image Picker Logic
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Submit Logic
  const handleSubmit = async () => {
    const { name, price, category, unit, stock_quantity } = form;

    if (!name || !price || !category || !unit || images.length === 0) {
      Alert.alert(
        "Missing Fields",
        "Please fill all required fields and add at least one image."
      );
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", form.description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("stock_quantity", stock_quantity || "0");
      formData.append("unit", unit);

      images.forEach((img, index) => {
        const uriParts = img.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formData.append("images", {
          uri: img.uri,
          name: `photo_${index}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      });

      const res = await fetch(
        "https://zander-unknotty-unblamably.ngrok-free.dev/products/new-product",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", "Product added to GreenHero!");
        router.push("/marketplace");
      } else {
        Alert.alert("Error", data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Check your connection or server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
          <ThemedText type="subtitle">List New Product</ThemedText>
          <View style={{ width: 28 }} />
        </View>

        {/* Image Picker Section */}
        <ThemedText style={styles.label}>Product Images *</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScroll}
        >
          <TouchableOpacity
            style={[styles.addBtn, { borderColor: theme.tint }]}
            onPress={pickImage}
          >
            <Ionicons name="camera" size={30} color={theme.tint} />
            <ThemedText style={{ color: theme.tint, fontSize: 12 }}>
              Add Image
            </ThemedText>
          </TouchableOpacity>
          {images.map((img, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: img.uri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.removeBadge}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Input Fields */}
        <View style={styles.inputGroup}>
          <ThemedText style={styles.label}>Product Name *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F5F5F5",
              },
            ]}
            placeholder="e.g. Organic Tomato Seeds"
            placeholderTextColor="#999"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <ThemedText style={styles.label}>Price (DZD) *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor:
                      colorScheme === "dark" ? "#1A1D1E" : "#F5F5F5",
                  },
                ]}
                placeholder="0.00"
                keyboardType="numeric"
                value={form.price}
                onChangeText={(t) => setForm({ ...form, price: t })}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>Unit *</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    backgroundColor:
                      colorScheme === "dark" ? "#1A1D1E" : "#F5F5F5",
                  },
                ]}
                placeholder="kg, box, bag..."
                value={form.unit}
                onChangeText={(t) => setForm({ ...form, unit: t })}
              />
            </View>
          </View>

          <ThemedText style={styles.label}>Category *</ThemedText>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.catChip,
                  form.category === cat.value && {
                    backgroundColor: theme.tint,
                    borderColor: theme.tint,
                  },
                ]}
                onPress={() => setForm({ ...form, category: cat.value })}
              >
                <ThemedText
                  style={[
                    styles.catText,
                    form.category === cat.value && { color: "#FFF" },
                  ]}
                >
                  {cat.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <ThemedText style={styles.label}>Description</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                color: theme.text,
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F5F5F5",
              },
            ]}
            placeholder="Tell buyers about your eco-friendly product..."
            multiline
            numberOfLines={4}
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
          />

          <ThemedText style={styles.label}>Stock Quantity</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                color: theme.text,
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F5F5F5",
              },
            ]}
            placeholder="How many items do you have?"
            keyboardType="numeric"
            value={form.stock_quantity}
            onChangeText={(t) => setForm({ ...form, stock_quantity: t })}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: theme.tint }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.submitText}>Publish Product</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 15,
    opacity: 0.8,
  },
  imageScroll: { flexDirection: "row", marginBottom: 10 },
  addBtn: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  imageWrapper: { position: "relative", marginRight: 10 },
  previewImage: { width: 100, height: 100, borderRadius: 12 },
  removeBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  inputGroup: { marginTop: 10 },
  input: { borderRadius: 12, padding: 15, fontSize: 16, marginBottom: 5 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  catText: { fontSize: 13, fontWeight: "600" },
  textArea: { height: 100, textAlignVertical: "top" },
  submitBtn: {
    height: 55,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    elevation: 4,
  },
  submitText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
});
