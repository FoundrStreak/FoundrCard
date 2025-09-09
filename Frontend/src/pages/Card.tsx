import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import fetchCardData from "@/services/pages/card";

const isDarkColor = (hexColor) => {
  if (!hexColor) return false;
  const c = hexColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 128;
};

const getContrastingTextColor = (bgColor) => {
  return isDarkColor(bgColor) ? "#ffffff" : "#2d3748";
};

const getTextColor = (bgColor) => {
  return isDarkColor(bgColor) ? "#ffffff" : "#2d3748";
};

type Link = {
  id: number;
  title: string;
  url: string;
  description?: string;
  custom_icon?: string;
  custom_color?: string;
  is_featured: boolean;
  order: number;
};

type Profile = {
  id: string;
  profile: {
    profile_picture: string | null;
    profile_picture_url: string | null;
  };
  slug: string;
  title: string;
  subtitle?: string;
  bio?: string;
  startup_link?: string;
  instagram_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  email?: string;
  avatar_type: "initials" | "image";
  avatar_value: string;
  primary_color: string;
  secondary_color: string;
  background_style: "solid" | "gradient";
  links: Link[];
};

export default function LinkCard() {
  const [card, setCard] = useState<Profile | null>(null);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const data: Profile[] = await fetchCardData();
        setCard(data[0]);
      } catch (err) {
        console.error("Error fetching card:", err);
      }
    };
    loadCard();
  }, []);

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const socialLinks = [
    { icon: Instagram, url: card.instagram_url },
    { icon: Twitter, url: card.twitter_url },
    { icon: Linkedin, url: card.linkedin_url },
    { icon: Mail, url: card.email ? `mailto:${card.email}` : null },
  ];

  const featuredLinks = [
    ...(card.startup_link
      ? [
          {
            id: -1,
            title: "My Latest Startup",
            url: card.startup_link,
            description: "AI-powered productivity platform",
            is_featured: true,
            custom_color: "#e0e7ff",
            custom_icon: "⚡",
            order: -1,
          },
        ]
      : []),
    ...card.links.filter((link) => link.is_featured),
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="shadow-lg rounded-[36px] overflow-hidden border border-gray-200">
          <CardContent className="flex flex-col items-center p-8 space-y-6">
            <motion.div
              className="flex items-center justify-center w-28 h-28 rounded-[32px] shadow-md"
              style={{
                background:
                  card.avatar_type === "initials"
                    ? card.background_style === "gradient"
                      ? `linear-gradient(to bottom right, ${card.primary_color}, ${card.secondary_color})`
                      : card.primary_color
                    : "transparent",
                color: "#fff",
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {card.profile.profile_picture_url ? (
                <Avatar className="w-full h-full rounded-[32px]">
                  <img
                    src={card.profile.profile_picture_url}
                    alt={card.title}
                    className="object-cover w-full h-full rounded-[32px]"
                  />
                  <AvatarFallback>{card.title.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="w-full h-full rounded-[32px] text-4xl font-bold">
                  <AvatarFallback
                    style={{
                      background:
                        card.background_style === "gradient"
                          ? `linear-gradient(to bottom right, ${card.primary_color}, ${card.secondary_color})`
                          : card.primary_color,
                      color: "#fff",
                    }}
                  >
                    {card.avatar_value}
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>

            <div className="text-center space-y-1">
              <motion.h2
                className="text-2xl font-semibold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {card.title}
              </motion.h2>
              {card.subtitle && (
                <motion.p
                  className="text-gray-500 text-sm font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {card.subtitle}
                </motion.p>
              )}
              {card.bio && (
                <motion.p
                  className="text-gray-500 text-sm max-w-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {card.bio}
                </motion.p>
              )}
            </div>

            <motion.div
              className="flex space-x-3 mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {socialLinks.map(
                (social, i) =>
                  social.url && (
                    <motion.a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon size={20} />
                    </motion.a>
                  )
              )}
            </motion.div>

            <motion.div
              className="w-full flex flex-col gap-3 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {featuredLinks.map((link, index) => (
                <motion.a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200"
                  style={{
                    backgroundColor: link.custom_color || "#f3f4f6",
                    color: getContrastingTextColor(
                      link.custom_color || "#f3f4f6"
                    ),
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-white text-2xl"
                    style={{
                      background:
                        card.background_style === "gradient"
                          ? `linear-gradient(to bottom right, ${card.primary_color}, ${card.secondary_color})`
                          : card.primary_color,
                    }}
                  >
                    {link.custom_icon === "⚡" ? (
                      <span role="img" aria-label="lightning">
                        ⚡
                      </span>
                    ) : link.custom_icon ? (
                      <img
                        src={link.custom_icon}
                        alt="icon"
                        className="w-8 h-8"
                      />
                    ) : (
                      "🔗"
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span
                      className="font-semibold text-gray-800"
                      style={{
                        color: getContrastingTextColor(
                          link.custom_color || "#f3f4f6"
                        ),
                      }}
                    >
                      {link.title}
                    </span>
                    {link.description && (
                      <span
                        className="text-sm font-light"
                        style={{
                          color: getContrastingTextColor(
                            link.custom_color || "#f3f4f6"
                          ),
                          opacity: 0.7,
                        }}
                      >
                        {link.description}
                      </span>
                    )}
                  </div>
                  <ExternalLink
                    size={18}
                    className="text-gray-500"
                    style={{
                      color: getContrastingTextColor(
                        link.custom_color || "#f3f4f6"
                      ),
                      opacity: 0.6,
                    }}
                  />
                </motion.a>
              ))}

              {card.links
                .filter((link) => !link.is_featured)
                .map((link, index) => (
                  <motion.a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 bg-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.9 + (featuredLinks.length + index) * 0.1,
                      duration: 0.3,
                    }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className="w-12 h-12 flex items-center justify-center rounded-xl text-white text-xl"
                      style={{
                        background:
                          link.custom_color ||
                          `linear-gradient(to bottom right, ${card.primary_color}, ${card.secondary_color})`,
                        color: "#fff",
                      }}
                    >
                      {link.custom_icon === "⚡" ? (
                        <span role="img" aria-label="lightning">
                          ⚡
                        </span>
                      ) : link.custom_icon ? (
                        <img
                          src={link.custom_icon}
                          alt="icon"
                          className="w-8 h-8"
                        />
                      ) : (
                        "🔗"
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="font-semibold text-gray-800">
                        {link.title}
                      </span>
                      {link.description && (
                        <span className="text-gray-500 text-sm font-light">
                          {link.description}
                        </span>
                      )}
                    </div>
                    <ExternalLink size={18} className="text-gray-500" />
                  </motion.a>
                ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}