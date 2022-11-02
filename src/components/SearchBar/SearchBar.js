import { useRef } from "react";
import { Link } from "react-router-dom";
import "./SearchBar.css";
import { BsCart3 } from "react-icons/bs";

const SearchBar = ({
    filterText,
    inStockOnly,
    setFilterText,
    setInStockOnly,
    selectedItems
}) => {
    const handleChange = (e) => {
        setFilterText(e.target.value);
    };

    // prevent page from reloading on submit(enter)
    const handleSubmit = (e) => e.preventDefault();

    const handleCheck = (e) => {
        setInStockOnly(e.target.checked);
    };

    const searchInput = useRef();

    const onKeyUp = (e) => {
        if (e.charCode === 13) {
            // if (e.key === "Enter") {                 // This can also work
            searchInput.current.blur();
        }
    };

    return (
        <div className="form-and-cart-icon container row">
            <form className="col-9 col-md-4" onSubmit={handleSubmit}>
                <div className="col-8 col-md-12">
                    <input
                        type="text"
                        ref={searchInput}
                        value={filterText}
                        placeholder="Search..."
                        onChange={handleChange}
                        onKeyPress={onKeyUp}
                        className="form-control form-control-sm"
                        id="text-input"
                    />
                </div>
                <div>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            id="checkbox"
                            checked={inStockOnly}
                            onChange={handleCheck}
                        />{" "}
                        <p>Only show products in stock</p>
                    </label>
                </div>
            </form>
            <div className="cart-icon col-3 col-md-1">
                {selectedItems.length > 1 && (
                    <Link to="/cart">
                        <div id="badge">
                            <p>{selectedItems.length - 1}</p>
                        </div>
                    </Link>
                )}
                <Link to="/cart">
                    <button className="btn" id="cart-icon-btn" value="cart">
                        <BsCart3
                            size="30px"
                            pointerEvents="none"
                            color="olivedrab"
                        />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SearchBar;
