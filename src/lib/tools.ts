import { 
  Instagram, 
  Youtube, 
  Hash, 
  QrCode, 
  FileText, 
  Heart, 
  Image as ImageIcon, 
  FileStack, 
  Type,
  Zap
} from "lucide-react";

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: "AI" | "Utility";
  isNew?: boolean;
}

export const TOOLS: Tool[] = [
  {
    id: "instagram-bio",
    name: "Instagram Bio Generator",
    description: "Create creative and engaging Instagram bios that stand out.",
    icon: Instagram,
    category: "AI",
    isNew: true,
  },
  {
    id: "instagram-caption",
    name: "Instagram Caption Generator",
    description: "Generate viral-ready captions for your photos and reels.",
    icon: ImageIcon,
    category: "AI",
  },
  {
    id: "hashtag-generator",
    name: "Hashtag Generator",
    description: "Discover the best hashtags to boost your post visibility.",
    icon: Hash,
    category: "AI",
  },
  {
    id: "youtube-title",
    name: "YouTube Title Generator",
    description: "Optimized, SEO-friendly titles to increase your click-through rate.",
    icon: Youtube,
    category: "AI",
    isNew: true,
  },
  {
    id: "qr-generator",
    name: "QR Code Generator",
    description: "Instantly create high-quality QR codes for any URL or text.",
    icon: QrCode,
    category: "Utility",
  },
  {
    id: "resume-generator",
    name: "Resume Builder",
    description: "Structure a professional resume in minutes.",
    icon: FileText,
    category: "Utility",
  },
  {
    id: "love-calculator",
    name: "Love Calculator",
    description: "A fun way to calculate compatibility between two names.",
    icon: Heart,
    category: "Utility",
  },
  {
    id: "image-converter",
    name: "Image Converter",
    description: "Convert images between PNG, JPG, and WebP formats instantly.",
    icon: ImageIcon,
    category: "Utility",
  },
  {
    id: "pdf-tools",
    name: "PDF Merge & Split",
    description: "Combine multiple PDFs or extract pages into new documents.",
    icon: FileStack,
    category: "Utility",
  },
  {
    id: "font-generator",
    name: "Stylish Font Generator",
    description: "Transform your text into hundreds of stylish and cool fonts.",
    icon: Type,
    category: "Utility",
  },
];
