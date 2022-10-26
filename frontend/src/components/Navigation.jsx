import React from "react";
import { Menu } from "antd";
import { store } from "../lib";
import { MdDashboard, MdSupervisedUserCircle } from "react-icons/md";

const menuItems = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <MdDashboard className="nav-icon" />,
  },
  {
    label: "Manage User",
    key: "manage-user",
    icon: <MdSupervisedUserCircle className="nav-icon" />,
  },
];

const Navigation = () => {
  const current = store.ui.useState((s) => s.current);

  const handleSelectMenu = ({ key }) => {
    store.ui.update((s) => {
      s.current = key;
    });
  };

  return (
    <Menu
      items={menuItems}
      mode="inline"
      onSelect={handleSelectMenu}
      selectedKeys={[current]}
    />
  );
};

export default Navigation;
