import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  ExternalLink,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Plus,
  Trash2,
} from "lucide-react";

// This is the core Link Card Preview component.
const LinkCardPreview = ({ cardData }) => {
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

  const socialLinks = [
    { icon: Instagram, url: cardData.instagram_url },
    { icon: Twitter, url: cardData.twitter_url },
    { icon: Linkedin, url: cardData.linkedin_url },
    { icon: Mail, url: cardData.email ? `mailto:${cardData.email}` : null },
  ];

  const allLinks = [
    ...(cardData.startup_link
      ? [
          {
            id: -1,
            title: "My Latest Startup",
            url: cardData.startup_link,
            description: "AI-powered productivity platform",
            is_featured: true,
            custom_color: "#e0e7ff",
            custom_icon: "⚡",
            order: -1,
          },
        ]
      : []),
    ...cardData.links,
  ].sort((a, b) => a.order - b.order);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="shadow-lg rounded-[36px] overflow-hidden border border-gray-200 w-full max-w-md">
        <CardContent className="flex flex-col items-center p-8 space-y-6">
          <motion.div
            className="flex items-center justify-center w-28 h-28 rounded-[32px] shadow-md"
            style={{
              background:
                cardData.avatar_type === "initials"
                  ? cardData.background_style === "gradient"
                    ? `linear-gradient(to bottom right, ${cardData.primary_color}, ${cardData.secondary_color})`
                    : cardData.primary_color
                  : "transparent",
              color: "#fff",
            }}
          >
            {cardData.profile_picture_url ? (
              <Avatar className="w-full h-full rounded-[32px]">
                <img
                  src={cardData.profile_picture_url}
                  alt={cardData.title}
                  className="object-cover w-full h-full rounded-[32px]"
                />
                <AvatarFallback>{cardData.title.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="w-full h-full rounded-[32px] text-4xl font-bold">
                <AvatarFallback
                  style={{
                    background:
                      cardData.background_style === "gradient"
                        ? `linear-gradient(to bottom right, ${cardData.primary_color}, ${cardData.secondary_color})`
                        : cardData.primary_color,
                    color: "#fff",
                  }}
                >
                  {cardData.avatar_value}
                </AvatarFallback>
              </Avatar>
            )}
          </motion.div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-gray-800">
              {cardData.title}
            </h2>
            {cardData.subtitle && (
              <p className="text-gray-500 text-sm font-medium">
                {cardData.subtitle}
              </p>
            )}
            {cardData.bio && (
              <p className="text-gray-500 text-sm max-w-xs">
                {cardData.bio}
              </p>
            )}
          </div>

          <motion.div className="flex space-x-3 mt-2">
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

          <div className="w-full flex flex-col gap-3 mt-4">
            {allLinks.map((link) => (
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
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-12 h-12 flex items-center justify-center rounded-xl text-white text-2xl"
                  style={{
                    background:
                      cardData.background_style === "gradient"
                        ? `linear-gradient(to bottom right, ${cardData.primary_color}, ${cardData.secondary_color})`
                        : cardData.primary_color,
                  }}
                >
                  {link.custom_icon === "⚡" ? (
                    <span role="img" aria-label="lightning">⚡</span>
                  ) : link.custom_icon ? (
                    <img src={link.custom_icon} alt="icon" className="w-8 h-8" />
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
                <ExternalLink size={18} className="text-gray-500" />
              </motion.a>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function LinkCardCreator() {
  const [cardData, setCardData] = useState({
    profile_picture_url: "",
    slug: "",
    title: "",
    subtitle: "",
    bio: "",
    startup_link: "",
    instagram_url: "",
    twitter_url: "",
    linkedin_url: "",
    email: "",
    avatar_type: "initials",
    avatar_value: "N/A",
    primary_color: "#6b21a8",
    secondary_color: "#0284c7",
    background_style: "gradient",
    links: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...cardData.links];
    newLinks[index][field] = value;
    setCardData((prevData) => ({ ...prevData, links: newLinks }));
  };

  const addLink = () => {
    setCardData((prevData) => ({
      ...prevData,
      links: [
        ...prevData.links,
        {
          id: uuidv4(),
          title: "",
          url: "",
          is_featured: false,
          order: prevData.links.length,
        },
      ],
    }));
  };

  const removeLink = (id) => {
    setCardData((prevData) => ({
      ...prevData,
      links: prevData.links.filter((link) => link.id !== id),
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 text-gray-900">
      <div className="lg:w-1/2 p-6 flex flex-col gap-6 overflow-y-auto">
        <Card className="shadow-md rounded-3xl">
          <CardHeader>
            <CardTitle>Create Your Link Card</CardTitle>
            <CardDescription>
              Fill out the details to customize your link card. The preview will
              update live.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={cardData.title}
                onChange={handleChange}
                placeholder="Your Name or Brand"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={cardData.subtitle}
                onChange={handleChange}
                placeholder="A short tagline"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={cardData.bio}
                onChange={handleChange}
                placeholder="A brief bio about yourself"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Avatar</Label>
                <RadioGroup
                  defaultValue="initials"
                  value={cardData.avatar_type}
                  onValueChange={(value) =>
                    setCardData({ ...cardData, avatar_type: value })
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="initials" id="initials" />
                    <Label htmlFor="initials">Initials</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="image" id="image" />
                    <Label htmlFor="image">Image URL</Label>
                  </div>
                </RadioGroup>
              </div>
              {cardData.avatar_type === "initials" ? (
                <div className="space-y-2">
                  <Label htmlFor="avatar_value">Initials</Label>
                  <Input
                    id="avatar_value"
                    name="avatar_value"
                    value={cardData.avatar_value}
                    onChange={handleChange}
                    maxLength={2}
                    placeholder="e.g., JS"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="profile_picture_url">Profile Picture URL</Label>
                  <Input
                    id="profile_picture_url"
                    name="profile_picture_url"
                    value={cardData.profile_picture_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-3xl">
          <CardHeader>
            <CardTitle>Colors & Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="primary_color">Primary Color</Label>
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                value={cardData.primary_color}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary_color">Secondary Color</Label>
              <Input
                id="secondary_color"
                name="secondary_color"
                type="color"
                value={cardData.secondary_color}
                onChange={handleChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Background Style</Label>
              <RadioGroup
                defaultValue="gradient"
                value={cardData.background_style}
                onValueChange={(value) =>
                  setCardData({ ...cardData, background_style: value })
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solid" id="solid" />
                  <Label htmlFor="solid">Solid</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gradient" id="gradient" />
                  <Label htmlFor="gradient">Gradient</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-3xl">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                value={cardData.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter_url">Twitter URL</Label>
              <Input
                id="twitter_url"
                name="twitter_url"
                value={cardData.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin_url">LinkedIn URL</Label>
              <Input
                id="linkedin_url"
                name="linkedin_url"
                value={cardData.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                value={cardData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-3xl">
          <CardHeader>
            <CardTitle>Additional Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cardData.links.map((link, index) => (
              <div
                key={link.id}
                className="flex flex-col p-4 border rounded-2xl bg-gray-50"
              >
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLink(link.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`link-title-${index}`}>Title</Label>
                  <Input
                    id={`link-title-${index}`}
                    value={link.title}
                    onChange={(e) =>
                      handleLinkChange(index, "title", e.target.value)
                    }
                    placeholder="Link Title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`link-url-${index}`}>URL</Label>
                  <Input
                    id={`link-url-${index}`}
                    value={link.url}
                    onChange={(e) =>
                      handleLinkChange(index, "url", e.target.value)
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`link-color-${index}`}>Custom Color</Label>
                  <Input
                    id={`link-color-${index}`}
                    type="color"
                    value={link.custom_color || "#ffffff"}
                    onChange={(e) =>
                      handleLinkChange(index, "custom_color", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <Button onClick={addLink} className="w-full flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Link
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:w-1/2 flex items-center justify-center p-6">
        <LinkCardPreview cardData={cardData} />
      </div>
    </div>
  );
}

