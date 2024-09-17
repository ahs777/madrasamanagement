import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useTranslation } from 'react-i18next';

export default function IndexPage() {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [totalInventoryPrice, setTotalInventoryPrice] = useState<number>(0);
  const [totalSales, setTotalSales] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total number of books
        const booksCollection = collection(db, "books");
        const booksSnapshot = await getDocs(booksCollection);
        setTotalBooks(booksSnapshot.size);

        // Fetch total inventory price
        const inventoryCollection = collection(db, "inventory");
        const inventorySnapshot = await getDocs(inventoryCollection);
        const totalPrice = inventorySnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + (data.pricePerBook || 0) * (data.quantity || 0); // Assuming each document has pricePerBook and quantity
        }, 0);
        setTotalInventoryPrice(totalPrice);

        // Fetch total sales amount
        const salesCollection = collection(db, "sales");
        const salesSnapshot = await getDocs(salesCollection);
        const totalSalesAmount = salesSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          return acc + (data.totalPrice || 0); // Assuming each document has totalPrice
        }, 0);
        setTotalSales(totalSalesAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <section className="container px-8 py-2">
        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
          <Link to="/bookList" className="flex-1 max-w-full">
            <Card className="cursor-pointer">
              <CardHeader className="flex gap-3">
                
                <div className="flex flex-col">
                  <p className="text-md">{t('totalBooks')}</p>
                  <p className="text-xl font-bold">{totalBooks}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{t('totalBooksDescription')}</p>
              </CardBody>
            </Card>
          </Link>
          <Link to="/inventory" className="flex-1 max-w-full">
            <Card className="cursor-pointer">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">{t('totalInventoryPrice')}</p>
                  <p className="text-xl font-bold">Rs{totalInventoryPrice.toFixed(2)}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{t('totalInventoryPriceDescription')}</p>
              </CardBody>
            </Card>
          </Link>
          <Link to="/sales" className="flex-1 max-w-full">
            <Card className="cursor-pointer">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md">{t('totalSales')}</p>
                  <p className="text-xl font-bold">RS{totalSales.toFixed(2)}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p>{t('totalSalesDescription')}</p>
              </CardBody>
            </Card>
          </Link>

        </div>
        <div className="container">
              {/* <StatisticsComponent></StatisticsComponent> */}
        </div>
      </section>
    </DefaultLayout>
  );
}
