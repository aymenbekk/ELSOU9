import React, { Component, useState, useEffect } from "react";
import CommandesClient from "./client commandes/commandesClient";
import MonCompte from "./mon compte/monCompte";
import PasswordEdit from "./password edit/passwordEdit";
import "./account.css";
import user from "../../../assets/aymen.jpg";
import { RiEditCircleFill } from "react-icons/ri";
import { RiLockPasswordLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { BsBoxSeam } from "react-icons/bs";
import axios from "../../../helpers/axios";
import Commande from "./client commandes/commande";
import { useTranslation } from 'react-i18next'

function Account(props) {
  props.funcNav(true);

  const {t} = useTranslation()

  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [user, setUser] = useState(null);

  const [orderId, setOrderId] = useState(null)

  const [userPicture, setUserPicture] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const ress = await axios.post("/auth/check_get_user", { token });
    setUser(ress.data.user);
    setUserPicture(ress.data.user.picture);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const onSelectImage = async (e) => {
    console.log(e.target.files);
    if (e.target.files) {
      const image = e.target.files[0];
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append(
          "upload_preset",
          `${process.env.REACT_APP_PRESET_NAME}`
        );
        formData.append("cloud_name", `${process.env.REACT_APP_CLOUD_NAME}`);
        formData.append("folder", "profiles");
        const dataRes = await axios.post(
          `${process.env.REACT_APP_CLOUDINARY_BASE_URL}`,
          formData
        );
        const imageUrl = dataRes.data.url;
        console.log(imageUrl);
        if (imageUrl) {
          await axios.post("account/edit_profile_picture", {
            userId: user._id,
            picture: imageUrl,
          });

          setUserPicture(imageUrl);
        }
      }
    }
  };
  if (user)
    return (
      <div className="account-container">
        <div>
          <div className="account-nav">
            <div className="top-section">
              <div className="logo">
                <img src={userPicture} />
                <div className="edit-icon">
                  <label for="user-profile">
                    <RiEditCircleFill />
                  </label>
                  <input
                    id="user-profile"
                    type="file"
                    //value={image}
                    accept="image/*"
                    // onChange={(e) => setImage(e.target.files[0])}
                    onChange={onSelectImage}
                    //onChange={onSelectFile}
                    hidden
                  />
                </div>
              </div>
              <div className="username">
                {user.firstName} {user.lastName}
              </div>
            </div>
            <ul>
              <li
                className={activeTab == "tab1" ? "active" : null}
                onClick={() => setActiveTab("tab1")}
              >
                <div>
                  <span>
                    <CgProfile />
                  </span>
                  {t('my_account')}
                </div>
              </li>
              <li
                className={activeTab == "tab2" ? "active" : null}
                onClick={() => setActiveTab("tab2")}
              >
                <div>
                  <span>
                    <RiLockPasswordLine />
                  </span>
                  {t('password')}
                </div>
              </li>
              <li
                className={activeTab == "tab3" ? "active" : null}
                onClick={() => setActiveTab("tab3")}
              >
                <div>
                  <span>
                    <BsBoxSeam />
                  </span>
                  {t('orders')}
                </div>
              </li>
            </ul>
          </div>

          <div className="outlet">
            {activeTab == "tab1" && <MonCompte user={user} />}
            {activeTab == "tab2" && <PasswordEdit user={user} />}
            {activeTab == "tab3" && (
              <CommandesClient setTab={setActiveTab} setOrderId={setOrderId} user={user} />
            )}
            {activeTab == "tab4" && <Commande orderId={orderId} />}
          </div>
        </div>
      </div>
    );
}
export default Account;
