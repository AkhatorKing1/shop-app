import { useCallback, useEffect, useState } from "react";
import "./CartInput.css";
import { BsXLg } from "react-icons/bs";

const CartInput = (cartInputData) => {
    const [inputValue, setInputValue] = useState(1);
    const [displayRemoveItemConfirmation, setDisplayRemoveItemConfirmation] =
        useState(false);

    const {
        selectedItems,
        setSelectedItems,
        amountArr,
        setAmountArr,
        setTotal,
        clickedRemoveBtn,
        setClickedRemoveBtn,
        inputId,
        e,
        qtyOfItems,
        displayConfirmationName,
        setDisplayConfirmationName,
        amountArrCopy,
        setAmountArrCopy,
        trOpacity,
        setTrOpacity,
        clickedBtnValue,
        setClickedBtnValue,
        inputAndButtonDisable,
        setInputAndButtonDisable,
        amountArrStorage
    } = cartInputData;

    let amount =
        Number(selectedItems[inputId].split(",")[1].split("$").join("")) *
        Number(inputValue);

    const handleCartInputChange = (e) => {
        e.target.value.length <= 5 && setInputValue(e.target.value);
        Number(e.target.value) > Number(qtyOfItems) &&
            setInputValue(qtyOfItems);

        setClickedRemoveBtn(false);
    };

    const handleOnBlur = (e) => {
        (Number(e.target.value) < 1 || e.target.value.includes(".")) &&
            setInputValue(1);
    };

    const removeItem = (e) => {
        setClickedRemoveBtn(true);
        setTrOpacity("opaque");
        setInputAndButtonDisable(false);
        setDisplayRemoveItemConfirmation(false);

        let filteredItemList = selectedItems.filter(
            (item) => !item.includes(e.target.value)
        );

        setSelectedItems(filteredItemList);

        let filteredAmountArr = amountArr
            .filter((x) => Number(x.split(",")[1]) !== inputId)
            .map((x, index) =>
                Number(x.split(",")[1]) !== index + 1
                    ? `${x.split(", ")[0]}, ${Number(x.split(", ")[1]) - 1}, ${
                          x.split(", ")[2]
                      }`
                    : `${x.split(", ")[0]}, ${Number(x.split(", ")[1])}, ${
                          x.split(", ")[2]
                      }`
            );

        setAmountArr(filteredAmountArr);
        setAmountArrCopy(filteredAmountArr);
    };

    const sumAmount = useCallback(() => {
        return amountArr.length < 1
            ? 0
            : amountArr
                  .map((e) => Number(e.split(", ")[2]))
                  .reduce(
                      (previousValue, currentValue) =>
                          previousValue + currentValue,
                      0
                  );
    }, [amountArr]);

    const fillAmountArr = useCallback(
        (current) => {
            if (clickedRemoveBtn === false) {
                if (!current.length) {
                    setTotal(sumAmount());
                    return [...current, `${inputValue}, ${inputId}, ${amount}`];
                }

                for (let i = 0; i < current.length; i++) {
                    if (Number(current[i].split(",")[1]) === inputId) {
                        current[i] = `${inputValue}, ${inputId}, ${amount}`;
                        setTotal(() => sumAmount());
                        return current;
                    }
                }

                setTotal(sumAmount());
                return [...current, `${inputValue}, ${inputId}, ${amount}`];
            } else {
                for (let i = 0; i < current.length; i++) {
                    if (Number(current[i].split(",")[1]) === inputId) {
                        current[i] = `${
                            current[i].split(",")[0]
                        }, ${inputId}, ${amount}`;
                        setTotal(sumAmount());
                        return current;
                    }
                }

                setTotal(sumAmount());
                return [...current, `${inputValue}, ${inputId}, ${amount}`];
            }
        },
        [amount, inputId, inputValue, setTotal, sumAmount, clickedRemoveBtn]
    );

    useEffect(() => {
        if (
            amountArrCopy.length &&
            amountArrCopy[inputId - 1] &&
            amountArrCopy !== amountArr
        ) {
            setInputValue(amountArrCopy[inputId - 1].split(", ")[0]);
        }

        if (clickedRemoveBtn === false) {
            setAmountArr((current) => fillAmountArr(current));
            sessionStorage.setItem("amountArr", JSON.stringify(amountArr));
            return;
        }

        if (clickedRemoveBtn === true) {
            setAmountArr((current) => fillAmountArr(current));
            sessionStorage.setItem("amountArr", JSON.stringify(amountArr));
        }

        if (amountArr[inputId - 1]) {
            setInputValue(amountArr[inputId - 1].split(", ")[0]);
        }
    }, [
        amountArrStorage,
        inputValue,
        setAmountArr,
        inputId,
        amountArr,
        amount,
        clickedRemoveBtn,
        setTotal,
        amountArrCopy,
        fillAmountArr
    ]);

    const handledisplayRemoveItemConfirmation = (e) => {
        setDisplayConfirmationName(e.target.value);

        if (e.target.value) {
            setDisplayRemoveItemConfirmation(true);
            setTrOpacity("transparent");
            setClickedBtnValue(e.target.value);
            setInputAndButtonDisable(true);
        } else {
            setDisplayRemoveItemConfirmation(false);
            setTrOpacity("opaque");
            setInputAndButtonDisable(false);
        }
    };

    function updateOpacity() {
        if (
            trOpacity === "transparent" &&
            clickedBtnValue !== e.split(",")[0]
        ) {
            return { opacity: 0.5 };
        } else {
            return {};
        }
    }

    const opacityStyle = updateOpacity();

    return (
        <tr style={opacityStyle}>
            {displayRemoveItemConfirmation &&
            displayConfirmationName === e.split(",")[0] ? (
                <td colSpan="4">
                    <div className="confirm-removal">
                        <h3 className="col-6">
                            Remove <b>{e.split(",")[0]}</b> from cart?
                        </h3>
                        <button
                            className="btn"
                            onClick={handledisplayRemoveItemConfirmation}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn"
                            value={e.split(",")[0]}
                            onClick={removeItem}
                        >
                            Remove
                        </button>
                    </div>
                </td>
            ) : (
                <>
                    <td className="col-5">
                        <div className="item-name container col-md-10">
                            <button
                                className="btn"
                                value={e.split(",")[0]}
                                onClick={handledisplayRemoveItemConfirmation}
                                disabled={inputAndButtonDisable}
                            >
                                <BsXLg
                                    pointerEvents="none"
                                    size="10px"
                                    id="xlg"
                                />
                            </button>
                            <p>{e.split(",")[0]}</p>
                        </div>
                    </td>
                    <td className="col-2">{e.split(",")[1]}</td>
                    <td className="col-2 col-md-3">
                        <div id="qty-div">
                            <input
                                className="form-control form-control-sm"
                                type="number"
                                value={inputValue}
                                onChange={handleCartInputChange}
                                onBlur={handleOnBlur}
                                id="qty-input"
                                disabled={inputAndButtonDisable}
                            ></input>
                        </div>
                    </td>
                    <td className="col-3 col-md-2">
                        $
                        {Number(e.split(",")[1].split("$").join("")) *
                            Number(inputValue)}
                    </td>
                </>
            )}
        </tr>
    );
};

export default CartInput;
