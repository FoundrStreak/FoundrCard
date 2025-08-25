import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import fetchCardData from "@/services/pages/card";
// 1. Import the background image
import backgroundImage from '@/assets/image.png'; 

type Link = {
  id: number;
  title: string;
  url: string;
  description: string;
  is_featured: boolean;
  order: number;
  custom_icon?: string;
  custom_color?: string;
};

type Profile = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  bio: string;
  avatar_type: string;
  avatar_value: string;
  primary_color: string;
  secondary_color: string;
  background_style: string;
  links: Link[];
  social_links: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
};

function getContrastColor(hex: string): string {
  if (!hex) return "#fff";
  let c = hex.substring(1);
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff";
}

// Mock API data to match the image
const MOCK_API_DATA: Profile[] = [
  {
    "id": "mock-sarah-chen",
    "slug": "sarah-chen",
    "title": "Sarah Chen",
    "subtitle": "Serial Entrepreneur & Foundr",
    "bio": "Building the future of work. 3x foundr, 2 exits. Investing in early-stage startups.",
    "avatar_type": "initials",
    "avatar_value": "SC",
    "primary_color": "#8B5CF6", // A purple tone
    "secondary_color": "#D946EF", // A pink tone
    "background_style": "gradient",
    "template": null,
    "links": [
      {
        "id": 1,
        "title": "My Latest Startup",
        "url": "#",
        "description": "AI-powered productivity platform",
        "custom_icon": "⚡",
        "custom_color": "#8B5CF6",
        "is_featured": true,
        "order": 0,
        "link_type": null
      },
      {
        "id": 2,
        "title": "Foundr's Journey Blog",
        "url": "#",
        "description": "Lessons from building 3 companies",
        "custom_icon": "📈",
        "custom_color": "#3B82F6",
        "is_featured": false,
        "order": 1,
        "link_type": null
      }
    ],
    "social_links": {
      "instagram": "https://instagram.com/sarahchen",
      "twitter": "https://twitter.com/sarahchen",
      "linkedin": "https://linkedin.com/in/sarahchen",
      "email": "mailto:sarahchen@example.com"
    }
  }
];

export default function FounderProfileCard() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setProfile(MOCK_API_DATA[0]);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    }
    fetchProfile();
  }, []);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const socialIcons = [
    { name: "Instagram", icon: Instagram, url: profile.social_links?.instagram },
    { name: "Twitter", icon: Twitter, url: profile.social_links?.twitter },
    { name: "LinkedIn", icon: Linkedin, url: profile.social_links?.linkedin },
    { name: "Email", icon: Mail, url: profile.social_links?.email },
  ];

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden font-sans text-white">
      {/* 2. Optimized Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      {/* 3. Dark overlay to ensure UI elements are readable */}
      <div className="absolute inset-0 z-0 bg-black opacity-60" />

      {/* Profile Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex w-full max-w-sm flex-col items-center space-y-8 z-10 px-4 py-12 rounded-2xl shadow-2xl bg-gray-950/70 backdrop-blur-md border border-gray-800"
      >
        {/* Avatar */}
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold shadow-lg ring-4 ring-gray-700"
          style={{
            background:
              profile.background_style === "solid"
                ? profile.primary_color
                : `linear-gradient(to bottom right, ${profile.primary_color}, ${profile.secondary_color})`,
            color: getContrastColor(profile.primary_color),
          }}
        >
          {profile.avatar_type === "initials" ? (
            profile.avatar_value
          ) : (
            <Avatar>
              <img src={profile.avatar_value} alt={profile.title} />
              <AvatarFallback>{profile.title.charAt(0)}</AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Name + Bio */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-white">
            {profile.title}
          </h1>
          {profile.subtitle && (
            <p className="text-gray-400 font-medium">{profile.subtitle}</p>
          )}
          {profile.bio && (
            <p className="text-sm text-gray-400 max-w-xs">{profile.bio}</p>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6">
          {socialIcons.map((social) =>
            social.url ? (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <social.icon size={20} />
              </a>
            ) : null
          )}
        </div>

        {/* Links */}
        <div className="w-full space-y-4">
          {profile.links.map((link) => {
            const bg = link.custom_color || profile.primary_color;
            const textColor = getContrastColor(bg);
            const iconBg = `linear-gradient(to bottom right, ${profile.primary_color}, ${profile.secondary_color})`;
            const iconColor = "white";

            return (
              <Card
                key={link.id}
                className="cursor-pointer transition transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                onClick={() => window.open(link.url, "_blank")}
                style={{
                  background: "#1F2937",
                  border: "1px solid #374151",
                }}
              >
                <CardContent className="flex items-center space-x-4 p-4 text-white">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background: iconBg,
                      color: iconColor,
                    }}
                  >
                    {link.custom_icon || "🔗"}
                  </div>
                  <div className="flex flex-col flex-grow">
                    <span className="font-semibold text-white">
                      {link.title || "Untitled Link"}
                    </span>
                    {link.description && (
                      <span className="text-sm text-gray-400">
                        {link.description}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="ml-auto h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}