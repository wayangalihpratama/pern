import React from "react";
import { Menu } from "antd";
import { GlobalStore } from "../lib";

const menuItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Manage User", key: "manage-user" },
];

const Navigation = () => {
  const current = GlobalStore.ui.useState((s) => s.current);

  const handleSelectMenu = ({ key }) => {
    GlobalStore.ui.update((s) => {
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
