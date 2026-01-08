import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

// --- Types & Categories ---
export type CategoryID =
  | "organic-seeds"
  | "eco-fertilizers"
  | "solar-energy"
  | "water-saving"
  | "recycled-tools"
  | "bio-pesticides";

const categoriesList = [
  { id: "organic-seeds", name: "Seeds", icon: "leaf" },
  { id: "eco-fertilizers", name: "Bio-Compost", icon: "earth" },
  { id: "solar-energy", name: "Solar Energy", icon: "sunny" },
  { id: "water-saving", name: "Water Saving", icon: "water" },
  { id: "recycled-tools", name: "Eco Tools", icon: "hammer" },
  { id: "bio-pesticides", name: "Natural Care", icon: "shield-checkmark" },
];

// --- Mock Data ---
const MOCK_STATS = {
  carbonSaved: "12.5 kg",
  ecoPoints: 1250,
  itemsScanned: 48,
  rank: "Green Guardian",
};

const RECENT_SCANS = [
  {
    id: "1",
    name: "Plastic Bottle",
    date: "2 mins ago",
    type: "Recycle",
    points: +10,
  },
  {
    id: "2",
    name: "Glass Jar",
    date: "1 hour ago",
    type: "Reuse",
    points: +25,
  },
  {
    id: "3",
    name: "Cardboard Box",
    date: "Yesterday",
    type: "Recycle",
    points: +15,
  },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <ThemedText style={styles.welcomeText}>Hello, Hero! 👋</ThemedText>
        <ThemedText style={styles.subText}>
          Your planet is thankful today.
        </ThemedText>
      </View>
      <TouchableOpacity style={styles.profileBtn}>
        <Ionicons name="notifications-outline" size={24} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  const renderEcoWallet = () => (
    <View style={[styles.walletCard, { backgroundColor: theme.tint }]}>
      <View style={styles.walletHeader}>
        <ThemedText style={styles.walletLabel}>Eco-Wallet Balance</ThemedText>
        <Ionicons name="wallet-outline" size={20} color="#FFF" />
      </View>
      <ThemedText style={styles.pointsText}>
        {MOCK_STATS.ecoPoints} EP
      </ThemedText>
      <View style={styles.walletFooter}>
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>CO2 Saved</ThemedText>
          <ThemedText style={styles.statValue}>
            {MOCK_STATS.carbonSaved}
          </ThemedText>
        </View>
        <View style={styles.divider} />
        <View style={styles.statBox}>
          <ThemedText style={styles.statLabel}>Total Scans</ThemedText>
          <ThemedText style={styles.statValue}>
            {MOCK_STATS.itemsScanned}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderEcoWallet()}

        {/* Categories Section */}
        <ThemedText style={styles.sectionTitle}>Shop by Category</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
        >
          {categoriesList.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.tint + "15" },
                ]}
              >
                <Ionicons name={cat.icon as any} size={24} color={theme.tint} />
              </View>
              <ThemedText style={styles.catName}>{cat.name}</ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Scans */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Recent Activities</ThemedText>
          <TouchableOpacity>
            <ThemedText style={{ color: theme.tint }}>View All</ThemedText>
          </TouchableOpacity>
        </View>

        {RECENT_SCANS.map((item) => (
          <View
            key={item.id}
            style={[
              styles.activityCard,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <View
              style={[
                styles.activityIcon,
                {
                  backgroundColor:
                    item.type === "Reuse" ? "#4CAF50" : "#2196F3",
                },
              ]}
            >
              <Ionicons
                name={item.type === "Reuse" ? "refresh" : "trash-outline"}
                size={20}
                color="#FFF"
              />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.activityName}>{item.name}</ThemedText>
              <ThemedText style={styles.activityDate}>
                {item.date} • {item.type}
              </ThemedText>
            </View>
            <ThemedText style={styles.activityPoints}>
              +{item.points} EP
            </ThemedText>
          </View>
        ))}

        {/* Daily Tip */}
        <View style={[styles.tipCard, { borderColor: theme.tint + "40" }]}>
          <Ionicons name="bulb" size={24} color="#FFD700" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <ThemedText style={styles.tipTitle}>Daily Eco-Tip</ThemedText>
            <ThemedText style={styles.tipText}>
              Using a glass jar to store spices can save up to 200g of plastic
              waste per year!
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  welcomeText: { fontSize: 24, fontWeight: "800" },
  subText: { opacity: 0.6, fontSize: 14 },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Wallet Section
  walletCard: {
    borderRadius: 25,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  walletHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  walletLabel: { color: "#FFF", opacity: 0.8, fontWeight: "600" },
  pointsText: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "900",
    marginBottom: 20,
  },
  walletFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 15,
  },
  statBox: { flex: 1, alignItems: "center" },
  statLabel: { color: "#FFF", fontSize: 12, opacity: 0.7 },
  statValue: { color: "#FFF", fontSize: 18, fontWeight: "700" },
  divider: {
    width: 1,
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  // Categories
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 30,
    marginBottom: 15,
  },
  catScroll: { marginHorizontal: -20, paddingLeft: 20 },
  catItem: { alignItems: "center", marginRight: 20 },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  catName: { fontSize: 12, fontWeight: "600", opacity: 0.8 },

  // Activities
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 30,
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 18,
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityName: { fontSize: 16, fontWeight: "700" },
  activityDate: { fontSize: 12, opacity: 0.5 },
  activityPoints: { fontWeight: "800", color: "#4CAF50" },

  // Tip Card
  tipCard: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
    backgroundColor: "rgba(255,215,0,0.05)",
  },
  tipTitle: { fontWeight: "700", fontSize: 15 },
  tipText: { fontSize: 13, opacity: 0.7, marginTop: 4, lineHeight: 18 },
});
