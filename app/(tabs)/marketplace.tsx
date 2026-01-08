import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// --- Types ---
export interface ProductType {
  _id: string;
  name: string;
  description?: string;
  price: number;
  category:
    | "organic-seeds"
    | "eco-fertilizers"
    | "solar-energy"
    | "water-saving"
    | "recycled-tools"
    | "bio-pesticides";
  seller: string; // If this is causing the "Object" error from before, change this to 'any' or a User object interface
  stock_quantity: number;
  unit: string;
  product_images: string[];
}

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 50) / 2;

export default function MarketPlacePage() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const router = useRouter();

  // --- State ---
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories aligned with your Backend Enum & GreenHero Theme
  const categoriesList = [
    { id: "organic-seeds", name: "Seeds", icon: "leaf" },
    { id: "eco-fertilizers", name: "Bio-Compost", icon: "earth" },
    { id: "solar-energy", name: "Solar Energy", icon: "sunny" },
    { id: "water-saving", name: "Water Saving", icon: "water" },
    { id: "recycled-tools", name: "Eco Tools", icon: "hammer" },
    { id: "bio-pesticides", name: "Natural Care", icon: "shield-checkmark" },
  ];
  const fetchProducts = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");

      const res = await fetch(
        "https://zander-unknotty-unblamably.ngrok-free.dev/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtering Logic
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProductItem = ({ item }: { item: ProductType }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#FFF" },
      ]}
      onPress={() => router.push(`/product/${item._id}`)}
    >
      <Image
        source={{
          uri: item.product_images[0] || "https://via.placeholder.com/150",
        }}
        style={styles.productImage}
      />

      <View style={styles.productInfo}>
        <ThemedText style={styles.productTitle} numberOfLines={1}>
          {item.name}
        </ThemedText>

        <ThemedText style={styles.unitText}>{item.unit}</ThemedText>

        <View style={styles.priceRow}>
          <ThemedText style={[styles.priceText, { color: theme.tint }]}>
            dzd {item.price.toFixed(2)}
          </ThemedText>
          <View style={styles.stockBadge}>
            <ThemedText style={styles.stockText}>
              Qty: {item.stock_quantity}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.Topheader}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={theme.text} />
          </TouchableOpacity>
          <ThemedText type="subtitle">Green Marketplace</ThemedText>
          <TouchableOpacity onPress={() => router.push("/add-product")}>
            <Ionicons name="add-circle" size={30} color={theme.tint} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.searchContainer,
            { backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F0F0F0" },
          ]}
        >
          <Ionicons
            name="search-outline"
            size={20}
            color={theme.tabIconDefault}
          />
          <TextInput
            placeholder="Search eco products..."
            placeholderTextColor={theme.tabIconDefault}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Horizontal Category Tabs */}
      <View style={{ height: 50, marginVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <TouchableOpacity
            style={[
              styles.categoryTab,
              styles.rowCenter,
              selectedCategory === "all" && { backgroundColor: theme.tint },
            ]}
            onPress={() => setSelectedCategory("all")}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={selectedCategory === "all" ? "#FFF" : theme.tint}
              style={{ marginRight: 6 }}
            />
            <ThemedText
              style={{
                color: selectedCategory === "all" ? "#FFF" : theme.text,
              }}
            >
              All
            </ThemedText>
          </TouchableOpacity>

          {categoriesList.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryTab,
                styles.rowCenter,
                selectedCategory === cat.id && { backgroundColor: theme.tint },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={18}
                color={selectedCategory === cat.id ? "#FFF" : theme.tint}
                style={{ marginRight: 6 }}
              />
              <ThemedText
                style={{
                  color: selectedCategory === cat.id ? "#FFF" : theme.text,
                }}
              >
                {cat.name}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products List with Pull-to-Refresh */}
      {loading && !refreshing ? (
        <ActivityIndicator
          size="large"
          color={theme.tint}
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.listPadding}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.tint}
              colors={[theme.tint]}
            />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <ThemedText style={{ opacity: 0.5, marginTop: 50 }}>
                No eco products found.
              </ThemedText>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 50 },
  Topheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 45,
  },
  searchInput: { flex: 1, marginLeft: 10 },
  categoryTab: {
    paddingHorizontal: 16,
    height: 40,
    justifyContent: "center",
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  rowCenter: { flexDirection: "row", alignItems: "center" },
  gridRow: { justifyContent: "space-between", paddingHorizontal: 20 },
  listPadding: { paddingBottom: 20 },
  productCard: {
    width: COLUMN_WIDTH,
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: { width: "100%", height: 130, resizeMode: "cover" },
  productInfo: { padding: 10 },
  productTitle: { fontSize: 14, fontWeight: "bold" },
  unitText: { fontSize: 11, opacity: 0.6, marginBottom: 5 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: { fontSize: 14, fontWeight: "700" },
  stockBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: { fontSize: 10, color: "#2E7D32", fontWeight: "bold" },
  center: { alignItems: "center", justifyContent: "center" },
});
