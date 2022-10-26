import React from "react";
import { Menu } from "antd";
import { store } from "../lib";

const menuItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Manage User", key: "manage-user" },
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
