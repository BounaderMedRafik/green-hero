export type CategoryType = {
  id: string;
  name: string;
  icon: string; // Ionicons name
};

export type ProductType = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  rating: number;
  categoryId: string; // Linked to CategoryType.id
};

export type CommentType = {
  id: string;
  name: string;
  comment: string;
  productId: string; // Linked to ProductType.id
};

export const categories: CategoryType[] = [
  { id: "cat1", name: "Solar", icon: "sunny" },
  { id: "cat2", name: "Recycled", icon: "leaf" },
  { id: "cat3", name: "Garden", icon: "flower" },
  { id: "cat4", name: "Home", icon: "home" },
];

export const Product: ProductType[] = [
  {
    id: "p1",
    title: "Portable Solar Station",
    description: "500W Power station for camping and emergency backup.",
    image:
      "https://www.cnet.com/a/img/resize/17a7f2f5a4c1b93a53b1a8195600736dfb0989a3/hub/2024/05/22/431359a2-df0e-4474-ba39-aa9b2b3dbaa7/gettyimages-1446730326.jpg?auto=webp&fit=crop&height=675&width=1200",
    price: 299.0,
    rating: 4.9,
    categoryId: "cat1",
  },
  {
    id: "p2",
    title: "Recycled Glass Vase",
    description:
      "Hand-blown decorative vase made from 100% recycled glass bottles.",
    image:
      "https://www.worldmarket.com/dw/image/v2/BJWT_PRD/on/demandware.static/-/Sites-wm-master-catalog/default/dw1ccca4e9/images/large/27160_XXX_v2.jpg?sw=768&sh=768&sm=fit&sfrm=tif&q=80",
    price: 35.0,
    rating: 4.6,
    categoryId: "cat2",
  },
  {
    id: "p3",
    title: "Smart Composter",
    description:
      "Turn food waste into fertilizer in hours with this kitchen-top device.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTQLwNP-ekj7yRrfZoz__SjUib3rbHjZhBbQ&s",
    price: 150.0,
    rating: 4.7,
    categoryId: "cat3",
  },
  {
    id: "p4",
    title: "Eco Solar Charger",
    description: "Waterproof foldable solar panel for hikers.",
    image:
      "https://uk.eco-worthy.com/cdn/shop/products/ecoworthy_12v_25w_solar_panel_kit_battery_maintainer_-3_1000x.jpg?v=1678691053",
    price: 45.0,
    rating: 4.4,
    categoryId: "cat1",
  },
];

export const Comments: CommentType[] = [
  {
    id: "c1",
    name: "Mohamed Rafik",
    comment: "This solar station powered my laptop for two days straight!",
    productId: "p1",
  },
  {
    id: "c2",
    name: "Sarah Wilson",
    comment: "The glass has a beautiful tint. Looks great on my dining table.",
    productId: "p2",
  },
  {
    id: "c3",
    name: "Eco Community",
    comment: "Fast shipping and works as described. Great for my small garden.",
    productId: "p3",
  },
];
