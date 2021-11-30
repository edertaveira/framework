import React from "react";
import { Link } from "react-router-dom";
import { Menu, Layout, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.scss";
import { collapsedMenu } from "../../reducers/actions/commonActions";
import { FaNewspaper } from "react-icons/fa";
import { IoMdAlbums } from "react-icons/io";
import { GoTasklist } from "react-icons/go";
import { useHistory } from "react-router";
import { isMobile } from "react-device-detect";

const { Sider } = Layout;

const Sidebar = () => {
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state) => state.common);
  const history = useHistory();

  const menuItems = [
    {
      name: "Postagens",
      link: "/postagens",
      icon: <FaNewspaper />,
    },
    {
      name: "Albuns",
      link: "/albuns",
      icon: <IoMdAlbums />,
    },
    {
      name: "Todo",
      link: "/todo",
      icon: <GoTasklist />,
    },
  ];

  let indexSelected = menuItems.findIndex((item) => history.location.pathname === item.link);
  let selected = indexSelected !== -1 ? `menu_${menuItems[indexSelected].name}` : "";
  return (
    <Sider
      breakpoint={isMobile ? "lg" : ""}
      collapsedWidth={isMobile ? "0" : "80"}
      className="noprint"
      collapsible
      collapsed={collapsed}
      onCollapse={(collapsed) => dispatch(collapsedMenu(collapsed))}
      style={
        isMobile
          ? {}
          : {
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }
      }
    >
      {!isMobile && (
        <Button onClick={() => history.push("/")} type="link">
          <img alt="logo" src="https://www.frameworkdigital.com.br/img/logo-frwk.svg" className="logo" />
        </Button>
      )}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[selected]}>
        {menuItems.map((menu) => {
          const { name, link, icon } = menu;

          return (
            <Menu.Item key={`menu_${name}`}>
              <Link to={link}>
                {icon}
                <span>{name}</span>
              </Link>
            </Menu.Item>
          );
        })}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
