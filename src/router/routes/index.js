// ** React Imports
import { Fragment, lazy } from "react";
import { Navigate } from "react-router-dom";
// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper";

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute";

// ** Utils

import { isObjEmpty } from "@utils";
import InvoicePreview from "../../views/invoice/preview";
import AddDocument from "../../views/addDocument";
import Login from "../../views/Login";
import Register from "../../views/Register";
import { withRoleProtection } from "./ProtectedRoles";
import CoachProfile from "../../views/coach/CoachProfile";
import ZoomVideoComponent from "../../views/ZoomVideoComponent";
import VideoApp from "../../views/callingSmaple/VideoApp";
import Policy from "../../views/Policy";
import Terms from "../../views/Terms";
import Badge from "../../views/coach/Badge";
import CoacheeBadge from "../../views/coachee/CoacheeBadge";
import CoacheeProfileSetting from "../../views/coachee/CoacheeProfileSetting";
import ChangePassword from "../../views/ChangePassword";
import Notifications from "../../views/coachee/Notifications";
import VidePage from "../../views/VidePage";
import ChatComponent from "../../views/updateChat/ChatComponent";
// import UIKit from "../../views/UIKit";

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
};
// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template";

// ** Default Route

const ResetPassword = lazy(() => import("../../views/profile/ResetPassword"));
const Home = lazy(() => import("../../views/Home"));
const Request = lazy(() => import("../../views/coachee/Request"));
const Chat = lazy(() => import("../../views/coachee/Chat"));

const Profile = lazy(() => import("../../views/profile/Profile"));
const CoacheeProfile = lazy(() => import("../../views/coachee/Profile"));
const CoacheeGender = lazy(() => import("../../views/coachee/Gender"));
const CoacheeProfileComplete = lazy(() =>
  import("../../views/coachee/FinalScreen")
);
const CoachProfileComplete = lazy(() =>
  import("../../views/coach/FinalScreen")
);

const Interested = lazy(() => import("../../views/coachee/Interested"));
const CoachDetail = lazy(() => import("../../views/coachee/CoachDetail"));
const MyCoaching = lazy(() => import("../../views/coach/utils/MyCoaching"));
const CoacheeVerification = lazy(() =>
  import("../../views/coachee/CoacheeVerification")
);
const CoachHome = lazy(() => import("../../views/coach/CoachHome"));
const CoachChat = lazy(() => import("../../views/coach/CoachChat"));
const Language = lazy(() => import("../../views/profile/Language"));
const CoachingArea = lazy(() => import("../../views/profile/CoachingArea"));
const Duration = lazy(() => import("../../views/profile/Duration"));
const SecondPage = lazy(() => import("../../views/SecondPage"));
const FirstScreen = lazy(() => import("../../views/profile/FirstScreen"));

const VerificationCode = lazy(() =>
  import("../../views/profile/VerificationCode")
);

// const Login = lazy(() => import("../../views/Login"));
// const Register = lazy(() => import("../../views/Register"));
const ForgotPassword = lazy(() => import("../../views/ForgotPassword"));
const NotAuthorized = lazy(() => import("../../views/NotAuthorized"));
const Availability = lazy(() => import("../../views/profile/Avilability"));

const Error = lazy(() => import("../../views/Error"));
const AnalyticsDashboard = lazy(() =>
  import("../../views/dashboard/analytics")
);
const UserList = lazy(() => import("../../views/user/list"));
const FileUpload = lazy(() => import("../../views/FileUpload"));
// var user = JSON.parse(localStorage.getItem('userData'));

// ** Merge Routes
const userData = JSON.parse(localStorage.getItem("loginUserData")) || undefined;
const role = userData?.user ? userData?.user?.role : userData?.role;
const DefaultRoute =
  role && role === "coachee"
    ? "/coachee/home"
    : role === "coach"
    ? "/coach/home"
    : "/login";

console.log(userData);

const profileCompleted = userData?.user
  ? userData?.user?.coach?.is_completed
  : userData?.is_completed;

export const isLoggedIn = () => {
  return localStorage.getItem("loginUserData") !== null;
};

console.log(userData);
const ConditionalRedirect = () => {
  // const userData =
  //   JSON.parse(localStorage.getItem("loginUserData")) || undefined;
  const role = userData?.user?.role || userData?.role;
  console.log("hello", userData);
  const profileCompleted =
    userData?.user?.coach?.stripe_account_id ||
    userData?.coach?.stripe_account_id;

  console.log("ROLE", role);

  if (!userData) {
    console.log("hello", userData);
    // If no user data is found, redirect to login
    return <Navigate replace to="/login" />;
  } else {
    console.log("hello", userData);
    const defaultRoute = role === "coachee" ? "/coachee/home" : "/coach/home";
    return <Navigate replace to={defaultRoute} />;
  }

  // if (role === "coach" && !profileCompleted) {
  //   // Redirect coaches with incomplete profiles to the profile completion page
  //   return <Navigate replace to="/profile" />;
  // }

  // Default redirects based on the role
};
console.log(userData === undefined);
const Routes = [
  {
    path: "/",
    index: true,
    element:
      userData === undefined ? (
        <Navigate replace to="/login" />
      ) : userData?.user?.role === "coach" &&
        userData?.user?.is_stripe_completed &&
        userData?.user?.is_completed ? (
        <Navigate replace to="/coach/home" />
      ) : userData?.user?.role === "coachee" ? (
        <Navigate replace to="/coachee/home" />
      ) : (
        <Navigate replace to="/login" />
      ),
  },

  {
    path: "/coachee-gender",
    element: <CoacheeGender />,
    meta: {
      layout: "blank",
    },
  },

  {
    path: "/coachee-profile",
    element: <CoacheeProfile />,
    meta: {
      // restricted: true,
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/coachee-profile-complete",
    element: <CoacheeProfileComplete />,
    meta: {
      // restricted: true,
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/coach-profile-complete",
    element: <CoachProfileComplete />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  // {
  //   path: "/uikit",
  //   element: <UIKit />,
  //   meta: {
  //     layout: "blank",
  //     publicOnly: true,
  //   },
  // },
  {
    path: "/chat-component",
    element:
      userData === undefined ? (
        <Navigate replace to="/login" />
      ) : (
        <ChatComponent />
      ),
    meta: {
      // layout: "blank",
      publicOnly: false,
    },
  },
  {
    path: "/video-room",
    element: <VidePage />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/coachee-Interested",
    element: <Interested />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/profile",
    element: <Profile />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/availability",
    element: <Availability />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/notauthorized",
    element: <NotAuthorized />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/zoom",
    element: <ZoomVideoComponent />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/video-app",
    element: <VideoApp />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/coaching-area",
    element: <CoachingArea />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: role === "coach" ? "coach/home" : "coachee/home",
    element:
      role === "coach" ? (
        <CoachHome />
      ) : role === "coachee" ? (
        <Home />
      ) : (
        <Navigate replace to="/login" />
      ),
    meta: {
      publicOnly: false,
    },
  },
  {
    path: role === "coach" ? "coach/chat" : "coachee/chat",
    element: role === "coach" ? <CoachChat /> : <Chat />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: role === "coach" ? "coach/profile" : "coachee/profile",
    element: role === "coach" ? <CoachProfile /> : <CoacheeProfileSetting />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: role === "coach" ? "coach/coaching" : "coachee/home",
    element: role === "coach" ? <MyCoaching /> : <Home />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: role === "coach" ? "coach/my-badge" : "coachee/badge",
    element: role === "coach" ? <Badge /> : <CoacheeBadge />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: "/select-user",
    element: <FirstScreen />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/dashbaord/default",
    element: <AnalyticsDashboard />,
  },
  {
    path: "/second-page",
    element: <SecondPage />,
  },
  {
    path: "/file-upload",
    element: <FileUpload />,
    meta: {
      publicOnly: true,
    },
  },
  {
    path: "/apps/user/list",
    element: <UserList />,
    meta: {
      publicOnly: true,
    },
  },
  {
    path: "/add_document/:id",
    element: <AddDocument />,
    meta: {
      publicOnly: true,
    },
  },
  {
    path: "/apps/invoice/preview/:id",
    element: <InvoicePreview />,
    meta: {
      publicOnly: true,
    },
  },

  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/duration",
    element: <Duration />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/code-Verification",
    element: <VerificationCode />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/coachee-Verification",
    element: <CoacheeVerification />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/reset-password",
    element: <ResetPassword />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/Language",
    element: <Language />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/privacy-policy",
    element: <Policy />,
    meta: {
      // layout: "blank",
      publicOnly: true,
    },
  },
  {
    path: "/coachee/notifications",
    element: <Notifications />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: "/terms-and-conditions",
    element: <Terms />,
    meta: {
      // layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "/error",
    element: <Error />,
    meta: {
      layout: "blank",
      publicOnly: true,
    },
  },

  {
    path: "coachee/home",
    element: role === "coachee" ? <Home /> : <CoachHome />,
    meta: { publicOnly: false, isBlank: false },
  },
  {
    path: "change-password",
    element: <ChangePassword />,
    meta: { publicOnly: false, isBlank: false },
  },
  {
    path: "coachee/coach-detail/:id",
    element: role === "coachee" ? <CoachDetail /> : <CoachHome />,
    meta: {
      publicOnly: false,
    },
  },
  {
    path: "coachee/request",
    element:
      role === "coachee" ? (
        <Request />
      ) : role === "coach" ? (
        <CoachHome />
      ) : (
        <Navigate replace to="/login" />
      ),
    meta: { publicOnly: false },
  },
];

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta };
    } else {
      return {};
    }
  }
};

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = [];

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false;
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute;

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false);
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment;

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          );
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route);
      }
      return LayoutRoutes;
    });
  }
  return LayoutRoutes;
};

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical";
  const layouts = ["vertical", "horizontal", "blank"];

  const AllRoutes = [];

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout);

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes,
    });
  });
  return AllRoutes;
};
export { DefaultRoute, TemplateTitle, Routes, getRoutes };
