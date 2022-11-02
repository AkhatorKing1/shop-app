import { useEffect } from "react";
import { AiTwotoneBell } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./PopUpNotification.css";

export default function PopUpNotification({
    productsUpdated,
    notificationPopup,
    setNotificationPopup,
    animName,
    setAnimName,
    setNewNotification
}) {
    useEffect(() => {
        if (productsUpdated) {
            setAnimName("popup-enter");
        }
        if (
            productsUpdated === undefined &&
            notificationPopup.visibility === "visible"
        ) {
            setAnimName("");
        }
    }, [productsUpdated, setAnimName, notificationPopup.visibility]);

    const handleClick = () => {
        setAnimName("popup-leave");
        setTimeout(() => {
            setNotificationPopup((current) => {
                return {
                    visibility: "hidden",
                    count: current.count
                };
            });
            setAnimName("");
        }, 900);
    };

    function clickHere() {
        setAnimName("popup-leave");
        setNotificationPopup(() => {
            return {
                visibility: "hidden",
                count: 0
            };
        });
        setNewNotification(0);
    }

    return (
        <>
            {notificationPopup.visibility === "visible" && (
                <div
                    className="popup-notification-wrapper col-12"
                    style={{ animationName: animName }}
                >
                    <div className="wrapper">
                        <div id="close-popup">
                            <FaTimes id="icon" onClick={handleClick} />
                        </div>
                        <div className="icon-and-h3">
                            <AiTwotoneBell id="icon" />
                            <h3>New Notification</h3>
                        </div>
                        <div className="popup-message">
                            <p id="main-message">
                                Your order was placed successfully!
                            </p>
                            <div>
                                {notificationPopup.count === 2 && (
                                    <p>
                                        You have {notificationPopup.count - 1}{" "}
                                        other notification
                                    </p>
                                )}
                                {notificationPopup.count > 2 && (
                                    <p>
                                        You have {notificationPopup.count - 1}{" "}
                                        other notifications
                                    </p>
                                )}
                                <p>
                                    Click{" "}
                                    <Link
                                        to="/user-notifications"
                                        onClick={clickHere}
                                    >
                                        here
                                    </Link>{" "}
                                    to view all notifications
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
