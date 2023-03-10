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
import { Tooltip } from "antd";
import { SidebarItem } from "./types";

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
  width: 340px;
  background: #fff;
`;

type Position = "left" | "right";
type Theme = "black" | "white";

type AppProps = {
  items: SidebarItem[];
  position?: Position;
  theme?: Theme;
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
const Sidebar = ({ items, position = "left", theme = "black" }: AppProps) => {
  const [showPanelID, setShowPanelID] = useState("");
  const [showItem, setshowItem] = useState(false);
  const sidebarItems = items.map((value): JSX.Element => {
    return (
      <Tooltip placement="right" title={value.title} key={crypto.randomUUID()}>
        <AsideItem
          id={value.id}
          theme={theme}
          onClick={(e) => {
            if (showItem && e.currentTarget.id !== showPanelID) {
            } else {
              setshowItem(!showItem);
            }
            if (showPanelID === e.currentTarget.id) {
              setShowPanelID("");
            } else {
              setShowPanelID(e.currentTarget.id);
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
        // TODO react html props
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

type AppProps2 = { selectID: string; items: SidebarItem[] };

/**
 * @description the panel of item
 * @Author xiaohan kong
 * @param selectID panel id
 * @param items items
 */
const Item = ({ selectID, items }: AppProps2) => {
  const panel = items.filter((value) => {
    if (value.id !== selectID) {
      return false;
    }
    return true;
  });

  return panel.length ? panel[0].panel : <></>;
};

export default Sidebar;
