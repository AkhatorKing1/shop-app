import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp
} from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CheckStockStatus } from "../CheckStockStatus";
import "./ConfirmDisplay.css";
import "./loading.css";

const ConfirmDisplay = React.forwardRef(
    (
        {
            selectedItems,
            setSelectedItems,
            amountArr,
            setAmountArrCopy,
            clrCartConfirmation,
            setClrCartConfirmation,
            displayOrderConfirmation,
            setDisplayOrderConfirmation,
            loading,
            setLoading,
            displayOrderStatus,
            setDisplayOrderStatus,
            setDisplaySignInFirst,
            yesBtnText,
            noBtnText,
            tbody,
            total,
            products,
            setProducts,
            productsUpdated,
            setProductsUpdated,
            notificationPopup,
            setNotificationPopup,
            customUID
        },
        ref
    ) => {
        const [clrCartStyle, setClrCartStyle] = useState({
            animationName: "show-clr-cart",
            opacity: 1
        });
        const [confirmationMessage, setConfirmationMessage] = useState("");
        const [reviewPO, setReviewPO] = useState("NO");
        const [outOfStockItems, setOutOfStockItems] = useState([]);
        const [signInConfirmation, setSignInConfirmation] =
            useState("not signed in");
        const [purchaseOrder, setPurchaseOrder] = useState([]);

        useEffect(() => {
            clrCartConfirmation &&
                setConfirmationMessage("Remove all items from cart?");
            displayOrderConfirmation &&
                setConfirmationMessage(
                    "Are you sure you want to place order for these items?"
                );
        }, [clrCartConfirmation, displayOrderConfirmation, selectedItems]);

        useEffect(() => {
            onAuthStateChanged(getAuth(), (user) => {
                if (user) {
                    setSignInConfirmation("signed in");
                } else {
                    setSignInConfirmation("not signed in");
                }
            });
        }, [signInConfirmation]);

        const handleNoBtnClick = () => {
            if (!displayOrderStatus) {
                setClrCartStyle({
                    animationName: "remove-clr-cart",
                    opacity: 0
                });

                setTimeout(() => {
                    clrCartConfirmation && setClrCartConfirmation(false);
                    displayOrderConfirmation &&
                        setDisplayOrderConfirmation(false);
                    setClrCartStyle({
                        animationName: "show-clr-cart",
                        opacity: 1
                    });
                }, 600);
            } else {
                setSelectedItems([""]);
                setAmountArrCopy([]);
            }
        };

        const handleYesBtnClick = () => {
            if (productsUpdated) {
                setProductsUpdated(false);
            }

            if (clrCartConfirmation) {
                setClrCartStyle({
                    animationName: "remove-clr-cart",
                    opacity: 0
                });
                setSelectedItems([""]);
                setAmountArrCopy([]);

                setTimeout(() => {
                    setClrCartConfirmation(false);
                    setClrCartStyle({
                        animationName: "show-clr-cart",
                        opacity: 1
                    });
                }, 600);
            }

            if (displayOrderConfirmation) {
                if (signInConfirmation === "signed in") {
                    setDisplaySignInFirst(false);
                    const q = query(
                        collection(db, "products"),
                        orderBy("name", "asc")
                    );
                    onSnapshot(q, (querySnapshot) => {
                        setProducts(
                            querySnapshot.docs.map((doc) => ({
                                id: doc.id,
                                data: doc.data()
                            }))
                        );
                    });

                    setLoading(true);
                    setDisplayOrderConfirmation(false);

                    CheckStockStatus(
                        products,
                        setProducts,
                        selectedItems,
                        setSelectedItems,
                        amountArr,
                        setOutOfStockItems,
                        productsUpdated,
                        setProductsUpdated,
                        notificationPopup,
                        setNotificationPopup
                    );
                } else {
                    setDisplaySignInFirst(true);
                }
            }

            if (displayOrderStatus) {
                setClrCartStyle({
                    animationName: "remove-clr-cart",
                    opacity: 0
                });

                setTimeout(() => {
                    setDisplayOrderStatus(false);
                    setClrCartStyle({
                        animationName: "show-clr-cart",
                        opacity: 1
                    });
                }, 600);
            }
        };

        useEffect(() => {
            if (productsUpdated) {
                setPurchaseOrder([]);
                for (let i = 1; i < selectedItems.length; i++) {
                    setPurchaseOrder((current) => [
                        ...current,
                        {
                            name: selectedItems[i].split(",")[0],
                            price: selectedItems[i].split(",")[1],
                            quantity: amountArr[i - 1].split(", ")[0],
                            amount: `$${amountArr[i - 1].split(", ")[2]}`
                        }
                    ]);
                }
            }
        }, [productsUpdated, selectedItems, amountArr]);

        useEffect(() => {
            if (purchaseOrder.length > 0) {
                (async () => {
                    const docRef = await addDoc(
                        collection(db, "users", customUID, "PO"),
                        {
                            ...purchaseOrder,
                            total: `$${total}`,
                            created: Timestamp.now(),
                            timestamp: serverTimestamp()
                        }
                    );
                    // console.log("Document written with ID: ", docRef.id);
                })();
            }
        }, [purchaseOrder, total, customUID]);

        useEffect(() => {
            if (productsUpdated || outOfStockItems.length >= 1) {
                setLoading(false);
                setDisplayOrderStatus(true);
            }
        }, [
            productsUpdated,
            setLoading,
            setDisplayOrderStatus,
            outOfStockItems
        ]);

        let tbodyRows = [];

        if (confirmationMessage.includes("Are you sure")) {
            if (selectedItems.length) {
                for (let i = 1; i < selectedItems.length; i++) {
                    tbodyRows.push(
                        <tr key={i}>
                            <td>{selectedItems[i].split(",")[0]}</td>
                            <td>{selectedItems[i].split(",")[1]}</td>
                            <td>{amountArr[i - 1].split(", ")[0]}</td>
                            <td>${amountArr[i - 1].split(", ")[2]}</td>
                        </tr>
                    );
                }
            }
        }

        return (
            <>
                <div
                    className="clear-cart-first-div col-12"
                    style={clrCartStyle}
                ></div>
                <div
                    className="clear-cart col-12"
                    style={clrCartStyle}
                    ref={ref}
                >
                    {!loading && !displayOrderStatus && (
                        <div id="conf-msg">
                            <h3>{confirmationMessage}</h3>
                            <div id="conf-msg-btns">
                                <button
                                    className="btn"
                                    onClick={handleNoBtnClick}
                                    id="confirm-btns"
                                >
                                    {noBtnText}
                                </button>
                                <button
                                    className="btn"
                                    onClick={handleYesBtnClick}
                                    id="confirm-btns"
                                >
                                    {yesBtnText}
                                </button>
                            </div>

                            {confirmationMessage.includes("Are you sure") && (
                                <>
                                    {reviewPO === "NO" && (
                                        <button
                                            className="btn"
                                            onClick={() => setReviewPO("YES")}
                                            id="long-button"
                                        >
                                            Review purchase order (PO) first
                                        </button>
                                    )}

                                    {reviewPO === "YES" && (
                                        <div className="purchase-order container col-12 col-md-8">
                                            <table className="col-12">
                                                <thead>
                                                    <tr>
                                                        <th className="col-4">
                                                            item
                                                        </th>
                                                        <th className="col-2">
                                                            unit price
                                                        </th>
                                                        <th className="col-3">
                                                            qty
                                                        </th>
                                                        <th className="col-3">
                                                            amt
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>{tbodyRows}</tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th
                                                            className="col-"
                                                            colSpan="2"
                                                        >
                                                            total :
                                                        </th>
                                                        <th
                                                            className="col-"
                                                            colSpan="2"
                                                            id="total-value"
                                                        >
                                                            ${total}
                                                        </th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {loading && !productsUpdated && outOfStockItems.length < 1 && (
                        <div className="loading">
                            <div className="lds-dual-ring"></div>
                            <div id="loading">Loading</div>
                        </div>
                    )}

                    {displayOrderStatus && (
                        <div id="conf-msg">
                            {outOfStockItems.length < 1 && productsUpdated && (
                                <>
                                    <h3>Your order was placed successfully!</h3>
                                    <div className="continue-with-cart">
                                        <div>
                                            <p>
                                                Would you like to continue with
                                                cart?
                                            </p>
                                        </div>
                                        <div id="continue-btns">
                                            <Link to="/">
                                                <button
                                                    className="btn"
                                                    onClick={handleNoBtnClick}
                                                    id="confirm-btns"
                                                >
                                                    No
                                                </button>
                                            </Link>
                                            <button
                                                className="btn"
                                                onClick={handleYesBtnClick}
                                                id="confirm-btns"
                                            >
                                                Yes
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {outOfStockItems.length > 0 && (
                                <>
                                    <div className="failed-to-place-order">
                                        <div className="heading">
                                            <h3>FAILED TO PLACE ORDER!</h3>
                                            <p>
                                                The quantity of some of the
                                                items in your cart is more than
                                                the quantity in stock
                                            </p>
                                        </div>
                                        <div className="container-fluid col-sm-10 col-md-8  out-of-stock-items">
                                            {outOfStockItems.map(
                                                (item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            style={{
                                                                marginLeft: `${
                                                                    index * 2
                                                                }px`
                                                            }}
                                                        >
                                                            <p>
                                                                Only{" "}
                                                                <span
                                                                    style={{
                                                                        color: "darkred"
                                                                    }}
                                                                >
                                                                    {
                                                                        item.split(
                                                                            ","
                                                                        )[1]
                                                                    }
                                                                </span>{" "}
                                                                {
                                                                    item.split(
                                                                        ","
                                                                    )[0]
                                                                }{" "}
                                                                left in stock
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            className="btn"
                                            onClick={handleYesBtnClick}
                                            id="long-button"
                                        >
                                            Return to cart to make changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </>
        );
    }
);

export default ConfirmDisplay;
