import { useEffect, useState } from "react";
import { BsFillCartPlusFill } from "react-icons/bs";

const AddToCartBtn = ({
    product,
    lastChildItem,
    setLastChildItem,
    quantity,
    setQuantity,
    selectedItems,
    setSelectedItems
}) => {
    const [backgroundColor, setBackgroundColor] = useState("");
    const [color, setColor] = useState("");
    const [disable, setDisable] = useState(false);
    const [btnValue, setBtnValue] = useState();

    function newObject(lastChildItem, current) {
        if (!current.length) {
            return [lastChildItem];
        }
        for (let i = 0; i < current.length; i++) {
            if (current[i].includes(lastChildItem.split(",")[0])) {
                current[i] = lastChildItem;
                return current;
            }
        }
        return [...current, lastChildItem];
    }

    const handleButtonClick = (e) => {
        setBackgroundColor("olive");
        setColor("#2f352f");

        setTimeout(() => {
            setBackgroundColor("");
            setColor("");
        }, 250);

        setLastChildItem(e.target.value);

        setQuantity(quantity + 1);

        setBtnValue(e.target.value);
    };

    useEffect(() => {
        setSelectedItems((current) => newObject(lastChildItem, current));

        return function cleanItem() {
            setLastChildItem("");
        };
    }, [lastChildItem, setLastChildItem, setSelectedItems]);

    useEffect(() => {
        if (
            selectedItems
                .map((item) => item.split(",")[0])
                .includes(`${product.data.name}`) ||
            product.data.quantity < 1
        ) {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [
        product.data.name,
        selectedItems,
        disable,
        product.data.price,
        product.data.quantity,
        product.data.stocked,
        btnValue
    ]);

    return (
        <button
            title="Add to cart"
            className="btn"
            disabled={disable}
            value={[
                product.data.name,
                product.data.price,
                product.data.quantity
            ]}
            id="add-button"
            style={{ backgroundColor, color }}
            onClick={handleButtonClick}
        >
            <BsFillCartPlusFill
                pointerEvents="none"
                color="#2f352f"
                size="30px"
            />
        </button>
    );
};

export default AddToCartBtn;
