// ** React Imports
import { Link, redirect, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import {
  User,
  Mail,
  CheckSquare,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  Power,
  Trash,
  Globe,
} from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

// ** Default Avatar Image
import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import ChangePasswordModal from "../../../../views/ChangePasswordModal";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL, authGet, deleteReq } from "../../../../urls/api";
import DeleteAccountModal from "../../../../utility/utils/DeleteAccountModal";
import { getBadgeImage } from "../../../../utility/badges";
import SuccessModal from "../../../../views/coachee/component/SuccessModal";
import { toast } from "react-toastify";
import i18next, { t } from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../../../redux/languageSlice";

const UserDropdown = () => {
  const { t } = useTranslation();
  const { lng } = useSelector((state) => state.languageSlice);
  const dispatch = useDispatch();

  const [openChangeModal, setOpenChangeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleChangeModal = () => {
    setOpenChangeModal(!openChangeModal);
  };
  const [user, setUser] = useState();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("loginUserData")) || [];
  const userD = userData?.user || userData;
  const role = userData?.user ? userData?.user?.role : userData?.role;
  console.log("role", role);
  const profileImage =
    role === "coach"
      ? userData?.user?.coach?.profile_pic
      : role === "coachee"
      ? userData?.user?.coachee?.profile_pic
      : defaultAvatar;
  const profileRoute = role === "coach" ? "coach/profile" : "coachee/profile";

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("loginUserData");

    window.location = "/login";
  };

  const changeLanguage = (lng) => {
    i18next.changeLanguage(lng);
    dispatch(setLanguage(lng));
  };

  const fetchUsers = () => {
    const result = authGet(`users/getOneByRole/${userD?.id}?role=${role}`)
      .then((response) => setUser(response?.user))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    if (userData?.user?.id || userData?.id) {
      fetchUsers();
    }
  }, [userData?.user?.id, userData?.id]);

  const toggleDeleteModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const deleteUser = await deleteReq(`users/delete-temp/${userD.id}`);
      console.log("User deleted Successfully!");
      localStorage.removeItem("userData");
      localStorage.removeItem("loginUserData");
      navigate("/login");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error while attempting to delete the user!");
    }
  };

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
  };

  const getCoins = useCallback(async () => {
    if (role === "coachee") {
      try {
        const response = await authGet("rating/getCoacheeWellCoins");
        const newCoins = response?.overallTotalCoins;
        if (["30", "60", "100", "300"].includes(newCoins)) {
          setIsSuccessOpen(true);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [role]);

  useEffect(() => {
    if (role === "coachee") {
      getCoins();
    }
  }, [role]);

  const badgeImage =
    user?.badges && user?.badges?.name !== "NULL"
      ? getBadgeImage(user.badges.name)
      : user?.name
      ? getBadgeImage(user?.name)
      : null;

  // const userData = JSON.parse(localStorage.getItem("loginUserData")) || [];
  // const userD = userData?.user || userData;
  // const role = userData?.user ? userData?.user?.role : userData?.role;

  // async function checkForNotificationsAccepted() {
  //   const response = await fetch(`${BASE_URL}notification-request-accepted`);
  //   const notificationRequest = await response.json();
  //   if (notificationRequest?.result) {
  //     console.log("New Notification:", notificationRequest?.result, role);
  //     if (role !== "coach") {
  //       toast.success(
  //         `Your session request has been accepted by ${notificationRequest?.result?.first_name} ${notificationRequest?.result?.last_name}`,
  //         {
  //           position: "top-center",
  //           autoClose: 3000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //         }
  //       );
  //     }
  //     await fetch(
  //       `${BASE_URL}notification-request-accepted/${notificationRequest?.result.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //   }
  // }
  // setInterval(checkForNotificationsAccepted, 20000);

  return (
    <>
      <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
        <DropdownToggle
          href="/"
          tag="a"
          className="nav-link dropdown-user-link"
          onClick={(e) => e.preventDefault()}
        >
          <div className="user-nav d-sm-flex d-none">
            <span className="user-name fw-bold">
              {user ? user?.first_name + " " + user?.last_name : "N/A"}
            </span>
            {/* <span className="user-status">Admin</span> */}
          </div>

          <div style={{ position: "relative", display: "inline-block" }}>
            <Avatar
              img={user?.profile_pic || defaultAvatar}
              imgHeight="40"
              imgWidth="40"
            />
            {badgeImage && (
              <img
                src={badgeImage}
                alt="Badge"
                style={{
                  position: "absolute",
                  right: "-10px",
                  bottom: "0",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "transparent",
                  boxShadow: "unset",
                }}
              />
            )}
          </div>
        </DropdownToggle>
        <DropdownMenu end>
          <DropdownItem
            tag={Link}
            to={profileRoute}
            // onClick={(e) => e.preventDefault()}
          >
            <User size={14} className="me-75" />
            <Link to={profileRoute} className="align-middle">
              {t("Profile")}
            </Link>
          </DropdownItem>
          <DropdownItem
            // tag={Link} to="/change-password"
            onClick={toggleChangeModal}
          >
            <Mail size={14} className="me-75" />
            <span className="align-middle"> {t("Change Password")} </span>
          </DropdownItem>
          <DropdownItem onClick={() => setLangModal(true)} className="d-flex">
            <Globe size={14} className="me-75" />
            <div className="align-middle">{t("Change Language")}</div>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem tag={Link} onClick={handleLogout}>
            <Power size={14} className="me-75" />
            <span className="align-middle"> {t("Logout")} </span>
          </DropdownItem>
          <DropdownItem
            tag={Link}
            to={profileRoute}
            onClick={toggleDeleteModal}
            // onClick={(e) => e.preventDefault()}
          >
            <Trash size={14} className="me-75" style={{ color: "red" }} />
            <span className="align-middle" style={{ color: "red" }}>
              {t("Delete Account")}
            </span>
          </DropdownItem>
        </DropdownMenu>
        <ChangePasswordModal
          open={openChangeModal}
          toggle={toggleChangeModal}
        />
        <DeleteAccountModal
          isOpen={openDeleteModal}
          toggle={toggleDeleteModal}
          action={handleDelete}
          loading={loading}
        />

        <SuccessModal
          isOpen={isSuccessOpen}
          toggle={handleCloseSuccess}
          title={t("Badge Received")}
          text={t(`You have received a new Badge`)}
        />
      </UncontrolledDropdown>

      <Modal
        isOpen={langModal}
        toggle={() => setLangModal((prev) => !prev)}
        className="modal-dialog-centered"
        //   size="lg"
      >
        <ModalHeader toggle={() => setLangModal((prev) => !prev)}>
          <h3 style={{ color: "#0F6D6A" }}> {t("Change Language")} </h3>
        </ModalHeader>
        <ModalBody>
          <div className="d-flex mb-3 mt-1 gap-3 w-100 justify-content-center align-items-center">
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="language"
                  value="en"
                  checked={lng === "en"}
                  onChange={() => changeLanguage("en")}
                  className="fw-bold"
                />
                English
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="radio"
                  name="language"
                  value="ge"
                  checked={lng === "ge"}
                  onChange={() => changeLanguage("ge")}
                  className="fw-bold"
                />
                German
              </Label>
            </FormGroup>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default UserDropdown;
