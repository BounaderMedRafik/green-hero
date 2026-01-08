import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // --- State ---
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // --- Fetch Logic ---
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      if (!token) {
        Alert.alert("Error", "Session expired. Please login again.");
        return;
      }

      const res = await fetch(
        `https://zander-unknotty-unblamably.ngrok-free.dev/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();
      console.log("Fetched product data:", data);

      if (res.ok) {
        // Handle if your API wraps data in an object like { product: ... }
        setProduct(data.product || data);
      } else {
        console.log("Fetch error status:", res.status);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetails();
  }, [id]);

  const handlePostComment = () => {
    if (newComment.trim().length < 5) {
      Alert.alert("Short Review", "Please write at least 5 characters.");
      return;
    }
    Alert.alert("Review Posted", "Thank you for your feedback!");
    setNewComment("");
    Keyboard.dismiss();
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ThemedText>Product not found</ThemedText>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <ThemedText style={{ color: theme.tint }}>Go Back</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* Floating Header */}
      <View style={styles.headerNav}>
        <TouchableOpacity style={styles.roundBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.roundBtn}>
          <Ionicons name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image - Using product_images array from your schema */}
        <Image
          source={{
            uri:
              //@ts-ignore
              product.product_images?.[0] || "https://via.placeholder.com/400",
          }}
          style={styles.image}
        />

        <View style={styles.detailsWrapper}>
          <View style={styles.mainInfo}>
            <ThemedText style={styles.titleText}>
              {
                //@ts-ignore
                product.name
              }
            </ThemedText>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <ThemedText style={styles.ratingVal}>4.5</ThemedText>
              <ThemedText style={styles.reviewCount}>(Live Data)</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.sectionLabel}>
            About this product
          </ThemedText>
          <ThemedText style={styles.descriptionText}>
            {
              //@ts-ignore
              product.description ||
                "No description provided for this eco-friendly product."
            }
          </ThemedText>

          <View style={styles.inventoryInfo}>
            <ThemedText style={styles.stockText}>
              Stock:{" "}
              {
                //@ts-ignore
                product.stock_quantity
              }{" "}
              {
                //@ts-ignore
                product.unit
              }
            </ThemedText>
            <ThemedText style={styles.categoryText}>
              Category:{" "}
              {
                //@ts-ignore
                product.category
              }
            </ThemedText>
          </View>

          {/* Seller Card */}
          <ThemedText style={styles.sectionLabel}>
            Seller Information
          </ThemedText>
          <View
            style={[
              styles.sellerCard,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <View
              style={[styles.sellerAvatar, { backgroundColor: theme.tint }]}
            >
              {/* Check if there is a profile image, otherwise show icon */}

              {
                //@ts-ignore
                product.seller?.profile_image_url ? (
                  <Image
                    source={{
                      //@ts-ignore
                      uri: product.seller.profile_image_url,
                    }}
                    style={{ width: 44, height: 44, borderRadius: 12 }}
                  />
                ) : (
                  <Ionicons name="storefront" size={20} color="#FFF" />
                )
              }
            </View>
            <View style={{ flex: 1 }}>
              {/* FIXED: Instead of rendering product.seller (the object), we render specific keys */}
              <ThemedText style={styles.sellerName}>
                {
                  //@ts-ignore
                  product.seller?.role === "seller"
                    ? "Verified Seller"
                    : "Official Store"
                }
              </ThemedText>
              <ThemedText style={styles.sellerSubtitle}>
                Contact:{" "}
                {
                  //@ts-ignore
                  product.seller?.email || "No email provided"
                }
              </ThemedText>
              <ThemedText style={styles.sellerSubtitle}>
                Phone:{" "}
                {
                  //@ts-ignore
                  product.seller?.phone_number || "N/A"
                }
              </ThemedText>
            </View>
          </View>

          {/* Review Input */}
          <ThemedText style={styles.sectionLabel}>Leave a Review</ThemedText>
          <View
            style={[
              styles.commentInputWrapper,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <TextInput
              style={[styles.textInput, { color: theme.text }]}
              placeholder="Share your thoughts..."
              placeholderTextColor="#8E8E93"
              multiline
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity
              style={[styles.sendBtn, { backgroundColor: theme.tint }]}
              onPress={handlePostComment}
            >
              <Ionicons name="send" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buy Button */}
      <View
        style={[
          styles.bottomBar,
          { borderTopColor: theme.tabIconDefault + "15" },
        ]}
      >
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: theme.tint }]}
          activeOpacity={0.85}
        >
          <View style={styles.buyBtnInner}>
            <ThemedText style={styles.buyBtnText}>Buy Now</ThemedText>
            <View style={styles.verticalDivider} />
            <ThemedText style={styles.buyBtnPrice}>
              DZD{" "}
              {
                //@ts-ignore
                product.price.toFixed(2)
              }
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerNav: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    zIndex: 100,
  },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  scrollContent: { paddingBottom: 140 },
  image: { width: width, height: width * 1.1, resizeMode: "cover" },
  detailsWrapper: {
    marginTop: 10,
    backgroundColor: "inherit",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  mainInfo: { marginBottom: 20 },
  titleText: { fontSize: 26, fontWeight: "800" },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  ratingVal: { fontWeight: "700", fontSize: 15 },
  reviewCount: { opacity: 0.5, fontSize: 14 },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 12,
  },
  descriptionText: { fontSize: 15, lineHeight: 24, opacity: 0.7 },
  // Seller Section
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 15,
  },
  sellerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerName: { fontSize: 16, fontWeight: "700" },
  sellerSubtitle: { fontSize: 12, opacity: 0.5 },
  profileBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  // Input Section
  commentInputWrapper: {
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingHorizontal: 8,
    paddingTop: 8,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  // Review List
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  commentCard: { marginBottom: 15, marginTop: 10 },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  userIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  userLetter: { fontSize: 12, fontWeight: "bold", color: "#666" },
  userName: { fontSize: 14, fontWeight: "600" },
  commentBody: { fontSize: 14, opacity: 0.6, lineHeight: 20 },
  emptyReviews: { fontStyle: "italic", opacity: 0.4 },
  // Footer
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 35 : 20,
  },
  buyButton: {
    height: 64,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buyBtnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  buyBtnText: { color: "#FFF", fontSize: 19, fontWeight: "800" },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  buyBtnPrice: { color: "#FFF", fontSize: 19, fontWeight: "600" },

  inventoryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stockText: { fontWeight: "600", color: "#2E7D32" },
  categoryText: { fontStyle: "italic", opacity: 0.6 },
});
