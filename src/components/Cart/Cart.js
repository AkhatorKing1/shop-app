import React, { useEffect, useState } from "react";
import "./Cart.css";
import CartInput from "../CartInput/CartInput";
import PlaceOrder from "../PlaceOrder";
import { GiSittingDog } from "react-icons/gi";
import ConfirmDisplay from "../ConfirmDisiplay/ConfirmDisplay";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import PopUpNotification from "../PopUpNotification/PopUpNotification";

const Cart = (Data) => {
    const [amountArr, setAmountArr] = useState([]);
    const [total, setTotal] = useState(0);
    const [clickedRemoveBtn, setClickedRemoveBtn] = useState(false);
    const [displayConfirmationName, setDisplayConfirmationName] = useState("");
    const [clrCartConfirmation, setClrCartConfirmation] = useState(false);
    const [trOpacity, setTrOpacity] = useState(false); // tr - table row
    const [clickedBtnValue, setClickedBtnValue] = useState("opaque");
    const [inputAndButtonDisable, setInputAndButtonDisable] = useState(false);
    const [productsUpdated, setProductsUpdated] = useState(false);

    const {
        products,
        setProducts,
        selectedItems,
        setSelectedItems,
        amountArrCopy,
        setAmountArrCopy,
        displaySignInFirst,
        setDisplaySignInFirst,
        newNotification,
        setNewNotification,
        notificationPopup,
        setNotificationPopup,
        animName,
        setAnimName,
        amountArrStorage,
        customUID
    } = Data;

    const ref = React.createRef();

    useEffect(() => {
        const q = query(collection(db, "products"), orderBy("name", "asc"));
        onSnapshot(q, (querySnapshot) => {
            setProducts(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
            );
        });
    }, [setProducts]);

    useEffect(() => {
        function sumAmount() {
            return amountArr.length < 1
                ? 0
                : amountArr
                      .map((e) => Number(e.split(", ")[2]))
                      .reduce(
                          (previousValue, currentValue) =>
                              previousValue + currentValue,
                          0
                      );
        }

        setTotal(sumAmount());
        setAmountArrCopy(amountArr);
    }, [setTotal, amountArr, setAmountArrCopy]);

    const cartIputData = {
        products: products,
        setProducts: setProducts,
        selectedItems: selectedItems,
        setSelectedItems: setSelectedItems,
        amountArr: amountArr,
        setAmountArr: setAmountArr,
        setTotal: setTotal,
        clickedRemoveBtn: clickedRemoveBtn,
        setClickedRemoveBtn: setClickedRemoveBtn,
        displayConfirmationName: displayConfirmationName,
        setDisplayConfirmationName: setDisplayConfirmationName,
        amountArrCopy: amountArrCopy,
        setAmountArrCopy: setAmountArrCopy,
        trOpacity: trOpacity,
        setTrOpacity: setTrOpacity,
        clickedBtnValue: clickedBtnValue,
        setClickedBtnValue: setClickedBtnValue,
        inputAndButtonDisable: inputAndButtonDisable,
        setInputAndButtonDisable: setInputAndButtonDisable,
        displaySignInFirst: displaySignInFirst,
        setDisplaySignInFirst: setDisplaySignInFirst,
        inputId: "",
        e: "",
        qtyOfItems: 0,
        amountArrStorage: amountArrStorage
    };

    function headAndFotOpacity() {
        if (trOpacity === "transparent") {
            return { opacity: 0.5 };
        } else {
            return {};
        }
    }

    function handleClearCartBtnClick() {
        setClrCartConfirmation(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    useEffect(() => {
        sessionStorage.setItem("amountArr", JSON.stringify(amountArrCopy));
    }, [amountArrCopy]);

    return (
        <div className="cart-wrapper container-fluid">
            <div className="container col-12">
                <h2 id="cart-heading">Cart</h2>
            </div>
            {selectedItems.length < 2 ? (
                <p id="empty-cart-p">
                    *Your cart is empty{" "}
                    <GiSittingDog size="25px" color="#2f352f" />
                </p>
            ) : (
                <div className="cart-table col-12">
                    <table className="col-12 col-md-9">
                        <thead style={headAndFotOpacity()} disabled={true}>
                            <tr>
                                <th id="cart-td">Item</th>
                                <th id="cart-td">Unit Price</th>
                                <th id="cart-td">Qty</th>
                                <th id="cart-td">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedItems.map((e, index) => {
                                cartIputData.inputId = index;
                                cartIputData.e = e;
                                cartIputData.qtyOfItems = e.split(",")[2];
                                return (
                                    e !== "" && (
                                        <CartInput
                                            key={index}
                                            {...cartIputData}
                                            disabled={true}
                                        />
                                    )
                                );
                            })}
                        </tbody>
                        <tfoot style={headAndFotOpacity()}>
                            <tr>
                                <td colSpan="1">
                                    <button
                                        className="btn clear-btn"
                                        id="clear-btn"
                                        onClick={handleClearCartBtnClick}
                                        disabled={inputAndButtonDisable}
                                    >
                                        Clear Cart
                                    </button>
                                </td>
                                <th colSpan="2" abbr="Total amount">
                                    Total
                                </th>
                                <th>${total}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {clrCartConfirmation && (
                <ConfirmDisplay
                    ref={ref}
                    setSelectedItems={setSelectedItems}
                    setAmountArrCopy={setAmountArrCopy}
                    clrCartConfirmation={clrCartConfirmation}
                    setClrCartConfirmation={setClrCartConfirmation}
                    yesBtnText="remove"
                    setNotificationPopup={setNotificationPopup}
                    noBtnText="cancel"
                />
            )}

            <PlaceOrder
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                amountArr={amountArr}
                setAmountArrCopy={setAmountArrCopy}
                inputAndButtonDisable={inputAndButtonDisable}
                total={total}
                products={products}
                setProducts={setProducts}
                setDisplaySignInFirst={setDisplaySignInFirst}
                productsUpdated={productsUpdated}
                setProductsUpdated={setProductsUpdated}
                notificationPopup={notificationPopup}
                setNotificationPopup={setNotificationPopup}
                customUID={customUID}
            />

            <PopUpNotification
                productsUpdated={productsUpdated}
                notificationPopup={notificationPopup}
                setNotificationPopup={setNotificationPopup}
                animName={animName}
                setAnimName={setAnimName}
                setNewNotification={setNewNotification}
            />
        </div>
    );
};

export default Cart;
