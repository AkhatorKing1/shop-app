import { useState } from "react";
import { ProductTable } from "./ProductTable";
import SearchBar from "./SearchBar/SearchBar";

const FilterableProductTable = (Data) => {
    const [filterText, setFilterText] = useState("");
    const [inStockOnly, setInStockOnly] = useState(false);

    const {
        products,
        item,
        setItem,
        quantity,
        setQuantity,
        selectedItems,
        setSelectedItems
    } = Data;

    return (
        <>
            <SearchBar
                filterText={filterText}
                selectedItems={selectedItems}
                setFilterText={setFilterText}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
            />

            <ProductTable
                products={products}
                filterText={filterText}
                inStockOnly={inStockOnly}
                firstChildItem={item}
                setFirstChildItem={setItem}
                quantity={quantity}
                setQuantity={setQuantity}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
            />
        </>
    );
};

export default FilterableProductTable;
