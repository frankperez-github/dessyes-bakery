import { IconBox, IconShoppingCart, IconTruck, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function DashBoardMenu({ setOpenSection, openSection }: any) {
  useEffect(() => {
    setOpenSection("AdminOrders");
  }, [setOpenSection]);

  const [showSectionsNames, setShowSectionsNames] = useState(true);

  const getItemStyle = (section: string) => ({
    border: openSection === section ? "solid 1px" : "",
    backgroundColor: openSection === section ? "#555" : "",
  });

  const menuItems = [
    { id: "AdminOrders", label: "Órdenes", icon: <IconShoppingCart /> },
    { id: "AdminUsers", label: "Usuarios", icon: <IconUser /> },
    { id: "AdminProducts", label: "Productos", icon: <IconBox /> },
    ...(process.env.NEXT_PUBLIC_TRANSPORTATION_AVAILABLE === "true" 
      ? [{ id: "AdminTransportation", label: "Transportación", icon: <IconTruck /> }] 
      : [])
  ];
  

  return (
    <div
      style={{
        width: !showSectionsNames ? "5%" : "12%",
        transition: "width 0.3s ease-in-out",
      }}
      className="bg-black text-white fixed left-0 top-0 h-full"
      onMouseEnter={() => setShowSectionsNames(true)}
      onMouseLeave={() => setShowSectionsNames(false)}
    >
      <ul>
        {menuItems.map(({ id, label, icon }) => (
          <li
            key={id}
            style={getItemStyle(id!)}
            className="p-10 hover:bg-[#555] border-white cursor-pointer"
            onClick={() => setOpenSection(id)}
          >
            <div className="flex gap-5 items-center">
              <span
                style={{
                  transform: `scale(2)`,
                  transition: "transform 0.3s ease-in-out",
                }}
              >
                {icon}
              </span>
              {showSectionsNames && <span>{label}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
