import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { DataTable } from "../DataTable";
import { saveAs } from 'file-saver';

export default function AdminOrders() {
  const [paymentStatus, setPaymentStatus] = useState<any[]>([]);
  const [orderStatus, setOrderStatus] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch("/api/paymentStatus");
      const data = await response.json();
      setPaymentStatus(data.paymentStatus);
    } catch (error) {
      console.error("Error fetching payment statuses:", error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch("/api/orderStatus");
      const data = await response.json();
      setOrderStatus(data.orderStatus);
    } catch (error) {
      console.error("Error fetching order statuses:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      setOrders(data.orders);
      setLoadingOrders(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderProducts = async () => {
    try {
      const updatedOrders = await Promise.all(
        orders?.map(async (ord) => {
          const response = await fetch('/api/orderProducts/' + ord.id, {
            method: "GET",
          });
          const data = await response.json();
          return { ...ord, orderProducts: data.orderProducts };
        })
      );
      setOrders(updatedOrders);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!loadingOrders) {
      fetchOrderProducts();
    }
  }, [loadingOrders]);

  useEffect(() => {
    fetchOrders();
    setLoadingOrders(true);
    fetchOrderStatus();
    fetchPaymentStatus();
  }, []);

  const handlePaymentStatusChange = async (row: any, e: any) => {
    if (!window) return;
    const { orderWithoutProducts } = row;
    const response = await fetch("/api/orders/" + row.id, {
      method: "PUT",
      body: JSON.stringify({
        ...orderWithoutProducts,
        paymentStatus: e.target.value,
      }),
    });
    if (response.ok) {
      toast.success("Orden Actualizada");
    } else {
      toast.error("Ha ocurrido un error, intente otra vez.");
    }
  };

  const handleOrderStatusChange = async (row: any, e: any) => {
    if (!window) return;
    const { orderWithoutProducts } = row;
    const response = await fetch("/api/orders/" + row.id, {
      method: "PUT",
      body: JSON.stringify({
        ...orderWithoutProducts,
        orderStatus: e.target.value,
      }),
    });
    if (response.ok) {
      toast.success("Orden Actualizada");
    } else {
      toast.error("Ha ocurrido un error, intente otra vez.");
    }
  };



  // Helper function to format the CSV data with Spanish headers
  const formatCSVData = (ordersData: any[]) => {
    const headers = [
      "Número de Orden",
      "Nombre de Contacto",
      "Teléfono de Contacto",
      "Monto Total",
      "Estado del Pago",
      "Estado de la Orden",
      "Método de Pago",
      "Fecha de Creación",
    ];

    const csvRows = [
      headers.join(","), // Add header row
      ...ordersData.map((order) => {
        const {
          id,
          contactName,
          contactPhone,
          total,
          paymentStatus,
          orderStatus,
          paymentMethod,
          created_at,
        } = order;

        return [
          id,
          contactName,
          contactPhone,
          total,
          paymentStatus,
          orderStatus,
          paymentMethod,
          new Date(created_at).toLocaleString(),
        ].join(",");
      }),
    ];

    return csvRows;
  };

  // Generate CSV for all orders with product and payment analysis
  const generateGeneralReport = () => {
    const csvRows = formatCSVData(orders.filter((x:any)=>x.orderStatus !== "Cancelada"));

    // Add product analysis
    const productAnalysis = calculateProductAnalysis(orders.filter((x:any)=>x.orderStatus !== "Cancelada"));
    csvRows.push("\nAnálisis de productos vendidos:", ...productAnalysis);

    // Add payment method analysis
    const paymentAnalysis = calculatePaymentMethodAnalysis(orders.filter((x:any)=>x.orderStatus !== "Cancelada"));
    csvRows.push("\nAnálisis por método de pago:", ...paymentAnalysis);

    // Add user order and spending analysis
    const userAnalysis = calculateUserAnalysis(orders.filter((x:any)=>x.orderStatus !== "Cancelada"));
    csvRows.push("\nAnálisis de usuarios y dinero gastado:", ...userAnalysis);

    // Create Blob and download the file
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    saveAs(blob, `informe_general_${new Date().toISOString()}.csv`);
  };

  // Generate CSV for daily orders with product, payment, user analysis and daily profit
  const generateDailyReport = () => {
    const today = new Date(); // Get today's full date
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const startOfTomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
    
    const dailyOrders = orders.filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= startOfToday && orderDate < startOfTomorrow; // Orders from today's full 24 hours
    });
  
    const csvRows = formatCSVData(dailyOrders);
  
    // Add product analysis
    const productAnalysis = calculateProductAnalysis(dailyOrders);
    csvRows.push("\nAnálisis de productos vendidos en el día:", ...productAnalysis);
  
    // Add payment method analysis
    const paymentAnalysis = calculatePaymentMethodAnalysis(dailyOrders);
    csvRows.push("\nAnálisis por método:", ...paymentAnalysis);
  
    // Add user order and spending analysis
    const userAnalysis = calculateUserAnalysis(dailyOrders);
    csvRows.push("\nAnálisis de usuarios y dinero gastado en el día:", ...userAnalysis);
  
    // Add daily profit
    const dailyProfit = dailyOrders.reduce((acc, order) => acc + (Number(order.total.split(" ")[0]) || 0), 0); // Ensure total is a number
    csvRows.push(`\nGanancia total del día: $${dailyProfit.toFixed(2)}`);
  
    // Create Blob and download the file
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    saveAs(blob, `informe_diario_${new Date().toISOString()}.csv`);
  };

  // Function to calculate product analysis
  const calculateProductAnalysis = (ordersData: any[]) => {
    const productMap: { [key: string]: number } = {};

    ordersData.forEach((order) => {
      order.orderProducts.forEach((product: any) => {
        if (productMap[product.productName]) {
          productMap[product.productName] += product.quantity;
        } else {
          productMap[product.productName] = product.quantity;
        }
      });
    });

    return Object.entries(productMap).map(
      ([productName, quantity]) => `${productName}: ${quantity} unidades vendidas`
    );
  };

  // Function to calculate payment method analysis
  const calculatePaymentMethodAnalysis = (ordersData: any[]) => {
    const totalOrders = ordersData.length;
    const paymentMethodMap: { [key: string]: number } = {};

    ordersData.forEach((order) => {
      if (paymentMethodMap[order.paymentMethod]) {
        paymentMethodMap[order.paymentMethod] += 1;
      } else {
        paymentMethodMap[order.paymentMethod] = 1;
      }
    });

    return Object.entries(paymentMethodMap).map(
      ([method, count]) => {
        const percentage = ((count / totalOrders) * 100).toFixed(2);
        return `${method}: ${count} órdenes (${percentage}% del total)`;
      }
    );
  };

  // Function to calculate user order and spending analysis
const calculateUserAnalysis = (ordersData: any[]) => {
  const userMap: { [key: string]: { totalOrders: number; totalSpent: number } } = {};

  ordersData.forEach((order) => {
    const userKey = `${order.contactName.trim()}-${order.contactPhone.split(" ").join("")}`;
    if (userMap[userKey]) {
      userMap[userKey].totalOrders += 1;
      userMap[userKey].totalSpent += Number(order.total.split(" ")[0]) || 0;
    } else {
      userMap[userKey] = { totalOrders: 1, totalSpent: Number(order.total.split(" ")[0]) || 0 };
    }
  });

  return Object.entries(userMap).map(
    ([user, data]) =>
      `${user}: ${data.totalOrders} órdenes, $${Number(data.totalSpent).toFixed(2)} gastado en total`
  );
};


  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Número de orden",
      width: 300,
      sortable: true,
      renderCell: (params: any) => <p>{params.row.id}</p>,
    },
    {
      field: "orderProducts",
      headerName: "Productos",
      width: 180,
      sortable: false,
      renderCell: (params: any) => {
        const productList = params.row.orderProducts
          ?.map((prod: any) => `${prod.productName} x ${prod.quantity}`)
          .join("<br/>");

        return (
          <div className="row-cell">
            <span dangerouslySetInnerHTML={{ __html: productList }} />
          </div>
        );
      },
    },
    {
      field: "totalAmount",
      headerName: "Monto Total",
      width: 150,
      sortable: false,
      renderCell: (params: any) => <p>{params.row.total}</p>,
    },
    {
      field: "paymentMethod",
      headerName: "Método de pago",
      width: 150,
      sortable: false,
      renderCell: (params: any) => <p>{params.row.paymentMethod}</p>,
    },
    {
      field: "paymentStatus",
      headerName: "Estado del pago",
      width: 150,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <select
            onChange={(e: any) => handlePaymentStatusChange(params.row, e)}
          >
            {paymentStatus?.map((paymSt: any, index: number) => (
              <option
                selected={paymSt.status === params.row.paymentStatus}
                key={index}
                value={paymSt.status}
              >
                {paymSt.status}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      field: "contactName",
      headerName: "Nombre de contacto",
      sortable: true,
      width: 160,
      renderCell: (params: any) => <p>{params.row.contactName}</p>,
    },
    {
      field: "contactPhone",
      headerName: "Teléfono de contacto",
      width: 180,
      sortable: false,
      renderCell: (params: any) => (
        <a
          className="border-b-2 border-blue-600 text-blue-600"
          href={`tel:${params.row.contactPhone}`}
        >
          {params.row.contactPhone}
        </a>
      ),
    },
    {
      field: "deliveryAddress",
      headerName: "Dirección de entrega",
      width: 400,
      sortable: false,
      renderCell: (params: any) => <p>{params.row.deliveryAddress}</p>,
    },
    {
      field: "orderStatus",
      headerName: "Estado de la orden",
      width: 150,
      sortable: false,
      renderCell: (params: any) => {
        return (
          <select
            onChange={(e: any) => handleOrderStatusChange(params.row, e)}
          >
            {orderStatus?.map((ordSt: any, index: number) => (
              <option
                selected={ordSt.status === params.row.orderStatus}
                key={index}
                value={ordSt.status}
              >
                {ordSt.status}
              </option>
            ))}
          </select>
        );
      },
    },
  ];

  return (
    <div className="">
      <div className="w-[75%] mt-5 mx-auto rounded-xl p-10">
        <div className="w-full flex justify-end space-x-4">
          <button onClick={generateGeneralReport} className="border-2 p-2 rounded-lg bg-gray-500 text-white">
            Descargar informe general (CSV)
          </button>
          <button onClick={generateDailyReport} className="border-2 p-2 rounded-lg bg-blue-500 text-white">
            Descargar informe diario (CSV)
          </button>
        </div>
      </div>

      {/* Sections for different order statuses */}
      <div className="w-[75%] my-10 mx-auto p-10">
        <h1 className="my-4 font-bold text-lg">Órdenes pendientes:</h1>
        <DataTable columns={columns} rows={orders?.filter((x: any) => x.orderStatus === "Procesando")} />
      </div>

      <div className="w-[75%] my-10 mx-auto p-10">
        <h1 className="my-4 font-bold text-lg">Órdenes enviándose:</h1>
        <DataTable columns={columns} rows={orders?.filter((x: any) => x.orderStatus === "Enviando")} />
      </div>

      <div className="w-[75%] my-10 mx-auto p-10">
        <h1 className="my-4 font-bold text-lg">Órdenes entregadas:</h1>
        <DataTable columns={columns} rows={orders?.filter((x: any) => x.orderStatus === "Entregada")} />
      </div>

      <div className="w-[75%] my-10 mx-auto p-10">
        <h1 className="my-4 font-bold text-lg">Órdenes canceladas:</h1>
        <DataTable columns={columns} rows={orders?.filter((x: any) => x.orderStatus === "Cancelada")} />
      </div>
    </div>
  );
}