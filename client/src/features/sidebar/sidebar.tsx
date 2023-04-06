/*
 * @Author: xiaohan kong
 * @Date: 2023-02-10
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-10
 * @Description: sidebar component
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import styled from "styled-components/macro";
import { useState } from "react";
import { message, Tooltip } from "antd";
import { SidebarItem } from "./types";
import usePopupStore from "../../stores/popup_store";
import useProjectStatusStore from "../../stores/project_status_store";

// aside style
const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  width: 60px;
  background: ${(props) => (props.theme === "black" ? "#434343" : "#fff")};
`;
// aside item style
const AsideItem = styled.div`
  padding: 14px 0;
  height: auto;
  border-radius: 0;
  border-color: rgba(0, 0, 0, 0);
  color: #8c8c8c;
  background: rgba(0, 0, 0, 0);
  text-align: center;
  &&:hover {
    background: ${(props) => (props.theme === "black" ? "#262626" : "#f0f0f0")};
    border-color: rgba(0, 0, 0, 0);
  }
`;
// panel style
const PanelContainer = styled.div`
  position: relative;
  display: flex;
  flex-flow: column;
  width: 360px;
  background: #fff;
  max-height: 91vh;
`;

/**
 * @description the panel of item
 * @Author xiaohan kong
 * @param selectID panel id
 * @param items items
 */
type ItemProps = { selectID: string; items: SidebarItem[] };
const Item = ({ selectID, items }: ItemProps) => {
  const panel = items.filter((value) => {
    if (value.id !== selectID || value.type === "view") {
      return false;
    }
    return true;
  });

  return panel.length ? panel[0].panel : <></>;
};

const createRoutes = (items: SidebarItem[]) => {
  return items.map((item) => {
    return { path: `/${item.id}`, element: item.panel };
  });
};
/**
 * @description: sidebar component
 * @module Sidebar
 * @Author xiaohan kong
 * @param items sidebar items
 * @param position sidebar position
 * @param theme the theme of sidebar
 * @export module: Sidebar
 */
type Position = "left" | "right";
type Theme = "black" | "white";
type AppProps = {
  items: SidebarItem[];
  position?: Position;
  theme?: Theme;
};
const Sidebar = ({ items, position = "left", theme = "black" }: AppProps) => {
  const popupTag = usePopupStore((state) => state.popupTagStore);
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setShowItem] = useState(false);
  const projKey = useProjectStatusStore((state) => state.key);
  const setProjKey = useProjectStatusStore((state) => state.setKey);

  const sidebarItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          theme={theme}
          onClick={() => {
            if (popupTag.model) return;
            else;
            if (projKey === "") {
              setProjKey("init");
              message.success("创建空白项目完成");
            } else;
            if (showItem && value.id !== showPanelID) {
            } else {
              setShowItem(!showItem);
            }
            if (showPanelID === value.id) {
              setShowPanelID("");
            } else {
              setShowPanelID(value.id);
            }
          }}
        >
          {value.icon}
        </AsideItem>
      </Tooltip>
    );
  });

  return (
    <>
      {showItem && position === "right" ? (
        <PanelContainer style={{ borderLeft: "1px solid #d9d9d9" }}>
          <Item selectID={showPanelID} items={items} />
        </PanelContainer>
      ) : (
        <></>
      )}
      <Aside
        theme={theme}
        style={
          position === "left"
            ? { borderRight: "1px solid #d9d9d9" }
            : { borderLeft: "1px solid #d9d9d9" }
        }
      >
        {sidebarItems}
      </Aside>
      {showItem && position === "left" ? (
        <PanelContainer style={{ borderRight: "1px solid #d9d9d9" }}>
          <Item selectID={showPanelID} items={items} />
        </PanelContainer>
      ) : (
        <></>
      )}
    </>
  );
};

export default Sidebar;
