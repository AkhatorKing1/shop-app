import React, { useRef, useState } from "react";
import ConfirmDisplay from "./ConfirmDisiplay/ConfirmDisplay";

const PlaceOrder = ({
    selectedItems,
    setSelectedItems,
    amountArr,
    setAmountArrCopy,
    inputAndButtonDisable,
    total,
    products,
    setProducts,
    setDisplaySignInFirst,
    productsUpdated,
    setProductsUpdated,
    notificationPopup,
    setNotificationPopup,
    customUID
}) => {
    const [displayOrderConfirmation, setDisplayOrderConfirmation] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [displayOrderStatus, setDisplayOrderStatus] = useState(false);

    const ref = useRef(null);

    const handleOrderBtnClick = () => {
        setDisplayOrderConfirmation(true);
        ref.current?.scrollIntoView({ behavior: "smooth" });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
    };

    return (
        <>
            {selectedItems.length >= 2 && (
                <div>
                    <button
                        className="btn"
                        id="order-btn"
                        onClick={handleOrderBtnClick}
                        disabled={inputAndButtonDisable}
                    >
                        order
                    </button>
                </div>
            )}

            {(displayOrderConfirmation || loading || displayOrderStatus) && (
                <ConfirmDisplay
                    ref={ref}
                    displayOrderConfirmation={displayOrderConfirmation}
                    setDisplayOrderConfirmation={setDisplayOrderConfirmation}
                    loading={loading}
                    setLoading={setLoading}
                    displayOrderStatus={displayOrderStatus}
                    setDisplayOrderStatus={setDisplayOrderStatus}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    amountArr={amountArr}
                    setAmountArrCopy={setAmountArrCopy}
                    yesBtnText="confirm"
                    noBtnText="cancel"
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
            )}
        </>
    );
};

export default PlaceOrder;
