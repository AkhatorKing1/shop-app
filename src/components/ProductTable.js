import ProductCategoryRow from "./ProductCategoryRow";
import ProductRow from "./ProductRow";
import { BsFillCartPlusFill } from "react-icons/bs";

const ProductTable = ({
    products,
    filterText,
    inStockOnly,
    firstChildItem,
    setFirstChildItem,
    quantity,
    setQuantity,
    selectedItems,
    setSelectedItems
}) => {
    const rows = [];
    let lastCategory = null;

    products.forEach((product) => {
        if (
            product.data.name
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) === -1
        ) {
            return;
        }
        if (inStockOnly && product.data.quantity < 1) {
            return;
        }
        if (lastCategory !== product.data.category) {
            rows.push(
                <ProductCategoryRow
                    category={product.data.category}
                    key={product.data.category}
                />
            );
        }

        rows.push(
            <ProductRow
                product={product}
                key={product.id}
                secondChildItem={firstChildItem}
                setSecondChildItem={setFirstChildItem}
                quantity={quantity}
                setQuantity={setQuantity}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />
        );

        lastCategory = product.data.category;
    });

    return (
        <>
            {products.length > 0 && (
                <div className="table-container">
                    <div className="col-12 col-md-8">
                        <p id="instruction">
                            Click the "<BsFillCartPlusFill size="20px" />" icon
                            to add item to cart.
                        </p>
                    </div>
                    <table className="col-12 col-md-8">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="container-fluid">{rows}</tbody>
                    </table>
                </div>
            )}
        </>
    );
};

export { ProductTable };
