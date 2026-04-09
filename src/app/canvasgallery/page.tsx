"use client";

import dynamic from "next/dynamic";
import ComponentShell from "@/components/ComponentShell";
import type { GalleryItem } from "@/components/CanvasGallery";

const CanvasGallery = dynamic(() => import("@/components/CanvasGallery"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center text-sm text-gray-400">
      Loading 3D canvas...
    </div>
  ),
});

// Sample gallery data — uses picsum for reliable placeholder images
const galleryItems: GalleryItem[] = [
  {
    id: "1",
    image: "https://picsum.photos/seed/tokyo1/800/600",
    title: "Shibuya Crossing",
    description:
      "The world's busiest pedestrian crossing, located in front of the Shibuya Station Hachiko exit. A mesmerizing flow of people from every direction.",
    location: "Shibuya, Tokyo",
    date: "March 2024",
    tags: ["street", "urban", "night"],
  },
  {
    id: "2",
    image: "https://picsum.photos/seed/tokyo2/800/600",
    title: "Senso-ji Temple",
    description:
      "Tokyo's oldest temple, located in Asakusa. The massive paper lantern at the Kaminarimon gate is an iconic symbol of the city.",
    location: "Asakusa, Tokyo",
    date: "March 2024",
    tags: ["temple", "culture", "historic"],
  },
  {
    id: "3",
    image: "https://picsum.photos/seed/tokyo3/800/600",
    title: "Tokyo Tower at Dusk",
    description:
      "Standing 333 meters tall, Tokyo Tower glows orange against the twilight sky. A timeless landmark inspired by the Eiffel Tower.",
    location: "Minato, Tokyo",
    date: "March 2024",
    tags: ["landmark", "night", "skyline"],
  },
  {
    id: "4",
    image: "https://picsum.photos/seed/tokyo4/800/600",
    title: "Meiji Shrine Forest",
    description:
      "An evergreen forest in the heart of Tokyo surrounding Meiji Shrine. 100,000 trees donated from across Japan create a serene oasis.",
    location: "Shibuya, Tokyo",
    date: "April 2024",
    tags: ["nature", "shrine", "forest"],
  },
  {
    id: "5",
    image: "https://picsum.photos/seed/tokyo5/800/600",
    title: "Akihabara Electric Town",
    description:
      "The epicenter of anime, manga, and electronics culture. Neon signs stack stories high and arcades glow from every corner.",
    location: "Chiyoda, Tokyo",
    date: "March 2024",
    tags: ["neon", "culture", "anime"],
  },
  {
    id: "6",
    image: "https://picsum.photos/seed/tokyo6/800/600",
    title: "Tsukiji Outer Market",
    description:
      "Fresh sushi, tamagoyaki, and matcha — the remaining outer market is a food lover's paradise with dozens of stalls.",
    location: "Chuo, Tokyo",
    date: "April 2024",
    tags: ["food", "market", "travel"],
  },
  {
    id: "7",
    image: "https://picsum.photos/seed/tokyo7/800/600",
    title: "Rainbow Bridge",
    description:
      "A suspension bridge spanning Tokyo Bay, connecting Shibaura and the Odaiba waterfront. Stunning at sunset with the city backdrop.",
    location: "Minato, Tokyo",
    date: "April 2024",
    tags: ["bridge", "waterfront", "sunset"],
  },
  {
    id: "8",
    image: "https://picsum.photos/seed/tokyo8/800/600",
    title: "Shinjuku at Night",
    description:
      "The neon labyrinth of Kabukicho and the glowing high-rises of Nishi-Shinjuku create an electric atmosphere after dark.",
    location: "Shinjuku, Tokyo",
    date: "March 2024",
    tags: ["night", "neon", "urban"],
  },
  {
    id: "9",
    image: "https://picsum.photos/seed/tokyo9/800/600",
    title: "Ueno Park Cherry Blossoms",
    description:
      "Over 800 cherry trees line the main pathway during hanami season. Families and friends gather for picnics under the pink canopy.",
    location: "Taito, Tokyo",
    date: "April 2024",
    tags: ["sakura", "park", "spring"],
  },
  {
    id: "10",
    image: "https://picsum.photos/seed/tokyo10/800/600",
    title: "Harajuku Takeshita Street",
    description:
      "A colorful pedestrian shopping street known for quirky fashion boutiques, crepe stands, and vibrant youth culture.",
    location: "Shibuya, Tokyo",
    date: "March 2024",
    tags: ["fashion", "culture", "street"],
  },
  {
    id: "11",
    image: "https://picsum.photos/seed/tokyo11/800/600",
    title: "Imperial Palace Gardens",
    description:
      "Former site of Edo Castle, now the primary residence of the Emperor. The East Gardens are open to the public year-round.",
    location: "Chiyoda, Tokyo",
    date: "April 2024",
    tags: ["palace", "gardens", "historic"],
  },
  {
    id: "12",
    image: "https://picsum.photos/seed/tokyo12/800/600",
    title: "Odaiba Waterfront",
    description:
      "A futuristic man-made island in Tokyo Bay featuring teamLab exhibits, the Gundam statue, and panoramic city views.",
    location: "Minato, Tokyo",
    date: "March 2024",
    tags: ["waterfront", "modern", "island"],
  },
  {
    id: "13",
    image: "https://picsum.photos/seed/tokyo13/800/600",
    title: "Yanaka District",
    description:
      "One of Tokyo's last remaining shitamachi areas. Narrow lanes, wooden houses, and a nostalgic atmosphere untouched by war.",
    location: "Taito, Tokyo",
    date: "April 2024",
    tags: ["traditional", "residential", "quiet"],
  },
  {
    id: "14",
    image: "https://picsum.photos/seed/tokyo14/800/600",
    title: "Roppongi Hills Mori Tower",
    description:
      "A 54-story mixed-use skyscraper with an observation deck offering 360-degree views of the Tokyo skyline and Mount Fuji on clear days.",
    location: "Minato, Tokyo",
    date: "March 2024",
    tags: ["skyscraper", "view", "modern"],
  },
  {
    id: "15",
    image: "https://picsum.photos/seed/tokyo15/800/600",
    title: "Nakamise-dori",
    description:
      "A 250-meter shopping street leading to Senso-ji Temple, lined with traditional snack shops and souvenir stalls for centuries.",
    location: "Asakusa, Tokyo",
    date: "April 2024",
    tags: ["shopping", "traditional", "temple"],
  },
  {
    id: "16",
    image: "https://picsum.photos/seed/tokyo16/800/600",
    title: "Tokyo Skytree",
    description:
      "At 634 meters, the tallest structure in Japan. The broadcasting and observation tower dominates the eastern Tokyo skyline.",
    location: "Sumida, Tokyo",
    date: "March 2024",
    tags: ["tower", "landmark", "skyline"],
  },
  {
    id: "17",
    image: "https://picsum.photos/seed/tokyo17/800/600",
    title: "Ginza District",
    description:
      "Tokyo's most luxurious shopping district, where flagship stores of global fashion brands line the wide Chuo-dori avenue.",
    location: "Chuo, Tokyo",
    date: "April 2024",
    tags: ["luxury", "shopping", "urban"],
  },
  {
    id: "18",
    image: "https://picsum.photos/seed/tokyo18/800/600",
    title: "Shimokitazawa Alleys",
    description:
      "A bohemian neighborhood known for vintage clothing shops, independent theaters, and a thriving live music scene.",
    location: "Setagaya, Tokyo",
    date: "March 2024",
    tags: ["bohemian", "vintage", "music"],
  },
  {
    id: "19",
    image: "https://picsum.photos/seed/tokyo19/800/600",
    title: "Yoyogi Park",
    description:
      "A spacious park adjacent to Meiji Shrine, popular for weekend picnics, busking musicians, and cosplay gatherings.",
    location: "Shibuya, Tokyo",
    date: "April 2024",
    tags: ["park", "nature", "weekend"],
  },
  {
    id: "20",
    image: "https://picsum.photos/seed/tokyo20/800/600",
    title: "Sumida River Evening",
    description:
      "A peaceful evening cruise along the Sumida River reveals illuminated bridges and the glowing Tokyo skyline reflected in still waters.",
    location: "Sumida, Tokyo",
    date: "April 2024",
    tags: ["river", "evening", "cruise"],
  },
];

const codeContent = `// See /src/components/CanvasGallery.tsx for full source
// Built with React Three Fiber v9 + @react-three/drei v10 + Three.js r172`;

const promptContent = `Create a 3D canvas gallery using React Three Fiber. Layout images in a grid on 3D planes. Support pan navigation with mouse drag and inertia, scroll-to-zoom, click-to-select with camera animation. When an image is clicked, slide in a detail side panel with image preview, title, description, location, date, and tags. Include a minimap overlay and HUD.`;

export default function CanvasGalleryPage() {
  return (
    <ComponentShell
      title="Canvas Gallery"
      codeContent={codeContent}
      promptContent={promptContent}
    >
      <div className="h-[65vh] sm:h-[75vh] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-gray-200/50 dark:border-white/10">
        <CanvasGallery items={galleryItems} columns={5} mobileColumns={3} />
      </div>
    </ComponentShell>
  );
}
