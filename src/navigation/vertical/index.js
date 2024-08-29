import {
  Mail,
  Home,
  FileText,
  MessageCircle,
  Lock,
  Award,
} from "react-feather";

const user = JSON.parse(localStorage.getItem("loginUserData")) || [];
const role = user?.role || user?.user?.role;

export default [
  {
    id: "discover",
    title: "Discover",
    icon: <Home size={20} style={{ color: "#FFFFFF" }} />,
    navLink: role === "coachee" ? "coachee/home" : "coach/home",
  },
  {
    id: "coaching",
    title: "My Coaching",
    icon: <Mail size={20} style={{ color: "#FFFFFF" }} />,
    navLink: role === "coachee" ? "/coachee/request" : "/coach/coaching",
  },
  {
    id: "myBadges",
    title: "My Badges",
    icon: <Award size={20} style={{ color: "#FFFFFF" }} />,
    navLink: role === "coach" ? "coach/my-badge" : "coachee/badge",
  },
  {
    id: "secondPage",
    title: "Chats",
    icon: <MessageCircle size={20} style={{ color: "#FFFFFF" }} />,
    navLink: "/chat-component",
  },
  {
    id: "PrivacyPolicy",
    title: "Privacy Policy",
    icon: <FileText size={20} style={{ color: "#FFFFFF" }} />,
    navLink: "/privacy-policy",
  },
  {
    id: "userList",
    title: "Terms & Conditions",
    icon: <Lock size={20} style={{ color: "#FFFFFF" }} />,
    navLink: "/terms-and-conditions",
  },
];
