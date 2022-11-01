import React from "react";
import { Menu } from "antd";
import { store } from "../lib";
import { MdDashboard } from "react-icons/md";
import { FcTodoList } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    key: "dashboard",
    icon: <MdDashboard className="nav-icon" />,
  },
  {
    label: "TODO",
    key: "todo",
    icon: <FcTodoList className="nav-icon" />,
  },
  // {
  //   label: "Manage User",
  //   key: "manage-user",
  //   icon: <MdSupervisedUserCircle className="nav-icon" />,
  // },
];

const Navigation = () => {
  const current = store.ui.useState((s) => s.current);
  const navigate = useNavigate();

  const handleSelectMenu = ({ key }) => {
    store.ui.update((s) => {
      s.current = key;
    });
    navigate(`/${key}`);
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
