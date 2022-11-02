import { db } from "../firebase";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc
} from "firebase/firestore";

const CheckStockStatus = (
    products,
    setProducts,
    selectedItems,
    setSelectedItems,
    amountArr,
    setOutOfStockItems,
    productsUpdated,
    setProductsUpdated,
    notificationPopup,
    setNotificationPopup
) => {
    let itemsNameAndQty = [];

    const q = query(collection(db, "products"), orderBy("name", "asc"));
    onSnapshot(q, (querySnapshot) => {
        setProducts(
            querySnapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }))
        );
    });

    if (selectedItems.length) {
        for (let i = 1; i < selectedItems.length; i++) {
            let itemsArray = [
                selectedItems[i].split(",")[0],
                amountArr[i - 1].split(", ")[0]
            ];

            itemsNameAndQty.push(itemsArray);
        }
    }

    let itemsNotInStock = 0;

    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < itemsNameAndQty.length; j++) {
            if (
                products[i].data.name === itemsNameAndQty[j][0] &&
                products[i].data.quantity < itemsNameAndQty[j][1]
            ) {
                itemsNotInStock += 1;
                setOutOfStockItems((current) => [
                    ...current,
                    `${products[i].data.name},${products[i].data.quantity}`
                ]);
            }
        }
        continue;
    }

    function updateSelectedItems() {
        setSelectedItems([""]);

        onSnapshot(q, (querySnapshot) => {
            setProducts(
                querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
            );
        });

        // Uses previous state of selectedItems
        for (let i = 1; i < selectedItems.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (selectedItems[i].includes(products[j].data.name)) {
                    // Uses current state of selectedItems ([""])
                    setSelectedItems((current) => [
                        ...current,
                        `${products[j].data.name},${products[j].data.price},${products[j].data.quantity}`
                    ]);
                }
            }
        }
    }

    if (itemsNotInStock === 0) {
        for (let i = 0; i < itemsNameAndQty.length; i++) {
            for (let j = 0; j < products.length; j++) {
                if (itemsNameAndQty[i][0] === products[j].data.name) {
                    updateDoc(doc(db, "products", `${products[j].id}`), {
                        quantity:
                            products[j].data.quantity - itemsNameAndQty[i][1]
                    }).then(() => {
                        if (!productsUpdated) {
                            setProductsUpdated(true);
                            setTimeout(() => {
                                setNotificationPopup((current) => {
                                    return {
                                        visibility: "visible",
                                        count: notificationPopup.count + 1
                                    };
                                });
                            }, 3000);
                        }
                    });
                }
            }
        }
    }

    updateSelectedItems();
};

export { CheckStockStatus };
