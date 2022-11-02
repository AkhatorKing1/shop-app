import { useEffect, useState } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import "./App.css";
import Cart from "./components/Cart/Cart";
import FilterableProductTable from "./components/FilterableProductTable";
import PRODUCTS from "./products";

import { db } from "./firebase";
import {
    collection,
    query,
    onSnapshot,
    orderBy,
    serverTimestamp,
    addDoc
} from "firebase/firestore";
import Header from "./components/Header";
import PopUpNotification from "./components/PopUpNotification/PopUpNotification";
import Notifications from "./components/Notifications";
import PurchaseOrder from "./components/PurchaseOrder/PurchaseOrder";

// Add products collection to firestore
const addProducts = () => {
    PRODUCTS.map((product) => {
        return (async () => {
            try {
                await addDoc(collection(db, "products"), {
                    ...product,
                    timestamp: serverTimestamp()
                });
            } catch (error) {
                console.error("Error adding document, ", error);
            }
        })();
    });
};

function App() {
    const [item, setItem] = useState("");
    const [quantity, setQuantity] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [amountArrCopy, setAmountArrCopy] = useState([]);
    const [products, setProducts] = useState([]);
    const [displaySignInFirst, setDisplaySignInFirst] = useState(false);
    const [newNotification, setNewNotification] = useState(0);
    const [notificationPopup, setNotificationPopup] = useState({
        visibility: "hidden",
        count: 0
    });
    // Notification popup animation
    const [animName, setAnimName] = useState("");
    const [minutesCount, setMinutesCount] = useState(0);
    const [customUID, setCustomUID] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        try {
            const q = query(collection(db, "products"), orderBy("name", "asc"));
            onSnapshot(q, (querySnapshot) => {
                setProducts(
                    querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        data: doc.data()
                    }))
                );
            });
        } catch (error) {}
    }, [notificationPopup]);

    useEffect(() => {
        sessionStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    }, [selectedItems]);

    let selectedItemsStorage = JSON.parse(
        sessionStorage.getItem("selectedItems")
    );

    let amountArrStorage = JSON.parse(sessionStorage.getItem("amountArr"));

    useEffect(() => {
        if (selectedItems.length < 2 && selectedItemsStorage !== null) {
            setSelectedItems(selectedItemsStorage);
        }

        if (amountArrCopy.length === 0 && amountArrStorage !== null) {
            setAmountArrCopy(
                amountArrStorage.map((e) => {
                    let eArray = e.split(", ");
                    if (Number(eArray[0]) < 1) {
                        eArray.shift();
                        eArray.unshift("1");
                    }

                    return eArray.join(", ");
                })
            );
        }
    }, []);

    useEffect(() => {
        if (newNotification < notificationPopup.count) {
            setAnimName("popup-enter");
        }
        setNewNotification(notificationPopup.count);
    }, [newNotification, notificationPopup.count]);

    const Data = {
        products: products,
        setProducts: setProducts,
        item: item,
        setItem: setItem,
        quantity: quantity,
        setQuantity: setQuantity,
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
        amountArrCopy: amountArrCopy,
        setAmountArrCopy: setAmountArrCopy,
        displaySignInFirst: displaySignInFirst,
        setDisplaySignInFirst: setDisplaySignInFirst,
        newNotification: newNotification,
        setNewNotification: setNewNotification,
        notificationPopup: notificationPopup,
        setNotificationPopup: setNotificationPopup,
        animName: animName,
        setAnimName: setAnimName,
        amountArrStorage: amountArrStorage,
        customUID: customUID
    };

    return (
        // Use <Router basename="/shop-app"> instead of <Router> to deploy on github
        // Also update "homepage": "https://akhatorking1.github.io/shop-app/" in package.json
        <Router>
            <Routes>
                <Route
                    path="/user-notifications"
                    element={
                        <>
                            <Header
                                setCustomUID={setCustomUID}
                                minutesCount={minutesCount}
                                setMinutesCount={setMinutesCount}
                                userName={userName}
                                setUserName={setUserName}
                                userEmail={userEmail}
                                setUserEmail={setUserEmail}
                            />
                            <Notifications />
                        </>
                    }
                />
                <Route
                    path="/user-purchase-order"
                    element={
                        <>
                            <Header
                                setCustomUID={setCustomUID}
                                minutesCount={minutesCount}
                                setMinutesCount={setMinutesCount}
                                userName={userName}
                                setUserName={setUserName}
                                userEmail={userEmail}
                                setUserEmail={setUserEmail}
                            />
                            <PurchaseOrder
                                customUID={customUID}
                                userName={userName}
                                userEmail={userEmail}
                            />
                        </>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <>
                            <Header
                                setCustomUID={setCustomUID}
                                displaySignInFirst={displaySignInFirst}
                                setDisplaySignInFirst={setDisplaySignInFirst}
                                minutesCount={minutesCount}
                                setMinutesCount={setMinutesCount}
                                userName={userName}
                                setUserName={setUserName}
                                userEmail={userEmail}
                                setUserEmail={setUserEmail}
                            />
                            <Cart {...Data} />
                        </>
                    }
                />
                <Route
                    path="/"
                    element={
                        <>
                            <Header
                                setCustomUID={setCustomUID}
                                minutesCount={minutesCount}
                                setMinutesCount={setMinutesCount}
                                userName={userName}
                                setUserName={setUserName}
                                userEmail={userEmail}
                                setUserEmail={setUserEmail}
                            />
                            <div className="container App">
                                <FilterableProductTable {...Data} />
                            </div>
                            <PopUpNotification
                                notificationPopup={notificationPopup}
                                setNotificationPopup={setNotificationPopup}
                                animName={animName}
                                setAnimName={setAnimName}
                                setNewNotification={setNewNotification}
                                userEmail={userEmail}
                            />
                            {!products.length && (
                                <div
                                    className="loading"
                                    style={{ marginTop: "20vh" }}
                                >
                                    <div className="lds-dual-ring"></div>
                                    <div id="loading">Loading items...</div>
                                </div>
                            )}
                        </>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
