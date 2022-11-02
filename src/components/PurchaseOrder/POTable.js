export default function POTable({
    allPO,
    POIndex,
    customUID,
    dateCreated,
    userName,
    userEmail
}) {
    return (
        <>
            {/* {allPO.length > 0 && POIndex >= 0 && ( */}
            <div className="PO">
                <div className="app-title-wrapper">
                    <div id="app-title">
                        <h1>SHOP APP</h1>
                    </div>
                    <p>...shopping can be fun too</p>
                </div>
                {/* <div className="details-header container-fluid">
                    <div className="col">
                        <h3>Customer</h3>
                    </div>
                    <div className="col">
                        <h3>Purchase Order</h3>
                    </div>
                </div> */}
                <div className="po-details">
                    <div className="col customer">
                        <div id="header">
                            <h3>Customer</h3>
                        </div>
                        <p>
                            <b>User Id:</b> {customUID}
                        </p>
                        <p>
                            <b>Name:</b> {userName}
                        </p>
                        <p>
                            <b>Email:</b> {userEmail}
                        </p>
                    </div>
                    <div className="col purchase">
                        <div id="header">
                            <h3>Purchase Order</h3>
                        </div>
                        <p>
                            <b>Order date:</b>{" "}
                            {`${dateCreated[POIndex][1]} ${dateCreated[POIndex][2]}, ${dateCreated[POIndex][3]}`}
                        </p>
                        <p>
                            <b>PO status:</b>
                        </p>
                        <p>
                            <b>PO No:</b>
                        </p>
                    </div>
                </div>
                <table className="col-12">
                    <thead>
                        <tr>
                            <th className="col-4">item</th>
                            <th className="col-2">unit price</th>
                            <th className="col-3">qty</th>
                            <th className="col-3">amt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(allPO[POIndex]).map((e, index) => {
                            return (
                                e.name && (
                                    <tr key={index}>
                                        <td>{e.name}</td>
                                        <td>{e.price}</td>
                                        <td>{e.quantity}</td>
                                        <td>{e.amount}</td>
                                    </tr>
                                )
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th className="col-" colSpan="2">
                                total :
                            </th>
                            <th className="col-" colSpan="2" id="total-value">
                                {allPO[POIndex].total}
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {/* )} */}
        </>
    );
}
