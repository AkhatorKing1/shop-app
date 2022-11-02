import AddToCartBtn from "./AddToCartBtn";

export default function ProductRow({
    product,
    secondChildItem,
    setSecondChildItem,
    quantity,
    setQuantity,
    selectedItems,
    setSelectedItems
}) {
    return (
        <>
            {product.data.quantity >= 1 && (
                <tr>
                    <td className="col-6">{product.data.name}</td>
                    <td className="col-3">{product.data.price}</td>
                    <td className="col-3">
                        <AddToCartBtn
                            product={product}
                            lastChildItem={secondChildItem}
                            setLastChildItem={setSecondChildItem}
                            quantity={quantity}
                            setQuantity={setQuantity}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                        />
                    </td>
                </tr>
            )}

            {product.data.quantity < 1 && (
                <tr style={{ background: "rgb(255, 230, 230)" }}>
                    <td className="col-6" style={{ color: "red" }}>
                        {product.data.name}
                    </td>
                    <td className="col-3" style={{ color: "red" }}>
                        {product.data.price}
                    </td>
                    <td className="col-3">
                        {product.data.quantity >= 1 && (
                            <AddToCartBtn
                                product={product}
                                lastChildItem={secondChildItem}
                                setLastChildItem={setSecondChildItem}
                                quantity={quantity}
                                setQuantity={setQuantity}
                                selectedItems={selectedItems}
                                setSelectedItems={setSelectedItems}
                            />
                        )}
                        {product.data.quantity < 1 && (
                            <div id="out-of-stock">
                                {/* <p id="out-of-stock">out of stock</p> */}
                                <p>out of stock</p>
                            </div>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
}
