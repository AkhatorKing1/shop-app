import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import POTable from "./POTable";
import "./PurchaseOrder.css";

const PurchaseOrder = ({ customUID, userName, userEmail }) => {
    const [allPO, setAllPO] = useState([]);
    const [dateCreated, setDateCreated] = useState([]);
    const [dateDiv, setDateDiv] = useState([]);
    const [POIndex, setPOIndex] = useState();

    const handleDateDivClick = useCallback(
        (index) => {
            !POIndex && setPOIndex(index);
            POIndex === index && setPOIndex();

            if (!!POIndex && POIndex !== index) {
                setPOIndex(index);
            }
        },
        [POIndex]
    );

    useEffect(() => {
        try {
            const q = query(
                collection(db, "users", customUID, "PO"),
                orderBy("created", "desc")
            );
            onSnapshot(q, (querySnapshot) => {
                setAllPO(querySnapshot.docs.map((doc) => doc.data()));

                setDateCreated(
                    querySnapshot.docs.map((doc) => {
                        return doc
                            .data()
                            .created.toDate()
                            .toString()
                            .split(" ");
                    })
                );
            });
        } catch (error) {
            setDateCreated([]);
            setAllPO([]);
            setDateDiv([]);
        }
    }, [customUID]);

    useEffect(() => {
        setDateDiv(
            dateCreated.map((e, index) => {
                return (
                    <div className="date-div container-fluid" key={index}>
                        <div
                            id="date-div"
                            onClick={() => handleDateDivClick(index)}
                        >
                            <p>{`${e[1]} ${e[2]}, ${e[3]}`}</p>
                            <p>{e[4]}</p>
                        </div>
                        {allPO.length > 0 && POIndex === index && (
                            <div id="smallscreen-table">
                                <POTable
                                    allPO={allPO}
                                    POIndex={POIndex}
                                    customUID={customUID}
                                    dateCreated={dateCreated}
                                    userName={userName}
                                    userEmail={userEmail}
                                />
                            </div>
                        )}
                    </div>
                );
            })
        );
    }, [
        allPO,
        dateCreated,
        POIndex,
        customUID,
        userName,
        userEmail,
        handleDateDivClick
    ]);

    return (
        <div className="PO-wrapper container-fluid">
            <div className="container col-12">
                <h2 id="PO-heading">Purchase Order</h2>
            </div>
            <div className="date-and-table">
                <div className="container-fluid" id="all-dates">
                    {dateDiv}
                </div>

                {allPO.length > 0 && POIndex >= 0 && (
                    <div className="col-8" id="bigscreen-table">
                        <POTable
                            allPO={allPO}
                            POIndex={POIndex}
                            customUID={customUID}
                            dateCreated={dateCreated}
                            userName={userName}
                            userEmail={userEmail}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseOrder;
