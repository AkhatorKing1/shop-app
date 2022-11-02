const ProductCategoryRow = ({ category }) => {
    return(
        <tr>
            <th colSpan="3" className="category">
                {category}
            </th>
        </tr>
    )
}

export default ProductCategoryRow