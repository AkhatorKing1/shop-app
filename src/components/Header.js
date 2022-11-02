import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    browserSessionPersistence,
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    signInWithPopup,
    signOut
} from "firebase/auth";
import { AiOutlineUser, AiTwotoneBell } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { ImUser } from "react-icons/im";
import { IoReceipt } from "react-icons/io5";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { GiOpenFolder } from "react-icons/gi";
import { usePageVisibility } from "react-page-visibility";

const Header = ({
    setCustomUID,
    displaySignInFirst,
    setDisplaySignInFirst,
    minutesCount,
    setMinutesCount,
    userName,
    setUserName,
    userEmail,
    setUserEmail
}) => {
    const [signInStatus, setSignInStatus] = useState("signed out");
    const [showUserNavbar, setShowUserNavbar] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [navStyle, setNavStyle] = useState({
        animationName: "show-nav-bar"
    });

    const [minutesCountDiv, setMinutesCountDiv] = useState(0);
    useEffect(() => {
        if (minutesCount > 0) setMinutesCountDiv(minutesCount);
    }, [minutesCount]);

    const userNameInitials = userName
        .split(" ")
        .map((e, index) => (index < 2 ? e[0] : ""))
        .join("");

    async function handleSignIn() {
        setShowUserNavbar(false);

        try {
            // const persistAuth = await setPersistence(
            //     getAuth(),
            //     browserSessionPersistence
            // );
            // const runIt = () => {
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({
                prompt: "select_account"
            });
            signInWithPopup(getAuth(), provider);
            // };

            // runIt(persistAuth);
        } catch (error) {
            console.error(error);
        }
    }

    const signOutUser = useCallback(() => {
        signOut(getAuth())
            .then(() => {
                setSignInStatus("signed out");
                setUserName("");
                setUserEmail("");
                setProfilePicUrl("");
                setCustomUID("");
            })
            .catch((error) => {
                console.error(error);
            });
    }, [setCustomUID, setUserEmail, setUserName]);

    const handleSignOut = () => {
        setShowUserNavbar(false);

        signOutUser();
    };

    useEffect(() => {
        onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                setSignInStatus("signed in");
                setUserName(user.displayName);
                setUserEmail(user.email);
                setProfilePicUrl(`url(${user.photoURL})`);
                setProfilePicUrl(`${user.photoURL}`);
                setCustomUID(
                    `${user.uid.slice(0, 4)}${user.uid.slice(
                        -3
                    )}${userNameInitials.toLowerCase()}`
                );
            } else {
                setSignInStatus("signed out");
            }
        });
    }, [
        userName,
        setUserName,
        setUserEmail,
        profilePicUrl,
        userNameInitials,
        setCustomUID
    ]);

    const handleUserClick = () => {
        !showUserNavbar ? setShowUserNavbar(true) : handleNavOnblur();
    };

    const handleNavOnblur = () => {
        setNavStyle({ animationName: "remove-nav-bar", top: "-250px" });
        setTimeout(() => {
            setShowUserNavbar(false);
            displaySignInFirst && setDisplaySignInFirst(false);
            setNavStyle({ animationName: "show-nav-bar", top: "60px" });
        }, 150);
    };
    // Use React Page Visibility to automatically sign out user
    // if page is not visible after 10 minutes approx.
    const isVisible = usePageVisibility();

    useEffect(() => {
        if (!isVisible) {
            setTimeout(() => {
                setMinutesCount((current) => current + 1);
            }, 500);
        } else {
            setMinutesCount(0);
        }
    }, [isVisible, minutesCount, setMinutesCount]);

    useEffect(() => {
        if (minutesCount === 600) {
            signOutUser();
        }
    }, [minutesCount, setUserName, signOutUser]);

    return (
        <header className="col-12">
            <div id="background-div"></div>
            <div className="app-name">
                <div onClick={() => setShowUserNavbar(false)}>
                    <Link to="/" id="shop-app">
                        <h1>SHOP APP</h1>
                    </Link>
                </div>
                <p>...shopping can be fun too</p>
            </div>

            {/* <div className="min-count-div">
                <h3>
                    <b>min: </b>
                    {minutesCountDiv}
                </h3>
            </div> */}

            {signInStatus === "signed in" && (
                <div className="user-info">
                    <p>{userName}</p>
                    <div id="user-profile-pic" onClick={handleUserClick}>
                        <img src={profilePicUrl} alt={userNameInitials}></img>
                    </div>
                    {showUserNavbar && (
                        <>
                            <div
                                id="nav-onblur"
                                onClick={handleNavOnblur}
                            ></div>
                            <nav
                                className="navbar col-12 col-md-4"
                                style={navStyle}
                            >
                                <ul>
                                    <li>
                                        <div>Profile</div>
                                        <div className="nav-icons">
                                            <ImUser id="nav-icon" />
                                        </div>
                                    </li>
                                    <li>
                                        <div>Notifications</div>
                                        <div className="nav-icons">
                                            <AiTwotoneBell id="nav-icon" />
                                        </div>
                                    </li>
                                    <li
                                        onClick={() => setShowUserNavbar(false)}
                                    >
                                        <Link
                                            to="/user-purchase-order"
                                            className="nav-link"
                                        >
                                            <div>Purchase order</div>
                                            <div className="nav-icons">
                                                <IoReceipt id="nav-icon" />
                                            </div>
                                        </Link>
                                    </li>
                                    <li>
                                        <div>Transaction history</div>
                                        <div className="nav-icons">
                                            <GiOpenFolder id="nav-icon" />
                                        </div>
                                    </li>
                                    <li onClick={handleSignOut}>
                                        <div>Sign out</div>
                                        <div className="nav-icons">
                                            <FaSignOutAlt id="nav-icon" />
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </div>
            )}
            {signInStatus === "signed out" && (
                <>
                    <div className="sign-in-btn">
                        <button
                            className="btn"
                            id="sign-in-btn"
                            onClick={handleUserClick}
                        >
                            <AiOutlineUser
                                id="user-icon"
                                pointerEvents="none"
                                color="#2f352f"
                            />
                        </button>
                    </div>
                    {(showUserNavbar || displaySignInFirst) && (
                        <>
                            <div
                                id="nav-onblur"
                                onClick={handleNavOnblur}
                            ></div>
                            <nav
                                className="navbar col-12 col-md-4"
                                style={navStyle}
                            >
                                <ul>
                                    <li onClick={handleSignIn}>
                                        <div>
                                            <FcGoogle
                                                size="25px"
                                                pointerEvents="none"
                                            />{" "}
                                            Sign in with Google
                                        </div>
                                        <div className="nav-icons">
                                            <FaSignInAlt id="nav-icon" />
                                        </div>
                                    </li>
                                </ul>
                            </nav>
                        </>
                    )}
                </>
            )}
        </header>
    );
};

export default Header;
