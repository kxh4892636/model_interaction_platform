/*
 * @File: CasePanel component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-02-23
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */
import styled from "styled-components/macro";
import axios from "axios";
import { Input } from "antd";
import { useEffect, useState } from "react";
import {
  PanelContainer,
  PanelContentContainer,
  PanelTitleContainer,
  PanelToolsContainer,
  PanelToolContainer,
} from "../../components/layout";
import CaseList from "./components/case_list";
import CasePage from "./components/case_detail_page";
import { CaseListData } from "./types";
import { useData } from "../../hooks";
import { ServerCase } from "../../types";
import useProjectStatusStore from "../../stores/project_status_store";

// modify style of antd search component
const { Search } = Input;
const CaseSearch = styled(Search)`
  padding: 0 8px;
`;

/**
 * @description CasePanel components
 * @module CasePanel
 * @author xiaohan kong
 * @param the url that get case list
 * @export module: CasePanel
 */
const CasePanel = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [data, setData] = useState<CaseListData[]>([]);
  const dataAction = useData();
  const [refresh, setRefresh] = useState(0);
  const projectKey = useProjectStatusStore((state) => state.key);

  const getImageUrl = async (key: string | undefined) => {
    if (!key) {
      return "http://localhost:3333/no_data.png";
    } else {
      const image = await dataAction.getData(key, "image", {}, "blob");
      const blob = new Blob([image]);
      const url = window.URL.createObjectURL(blob);
      return url;
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:3456/case/list", {
        params: {
          id: projectKey,
        },
      })
      .then(async (res) => {
        const result: ServerCase[] = res.data;
        let caseListData: CaseListData[] = [];
        for (let index = 0; index < result.length; index++) {
          const item = result[index];
          const imageUrl = await getImageUrl(item.image);
          caseListData.push({
            key: item.id,
            title: item.title,
            image: imageUrl,
            author: item.author,
            data: item.data,
          });
        }
        setData(caseListData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  return (
    <PanelContainer>
      {showDetail ? (
        <CasePage
          id={selectedItem}
          onClose={() => {
            setShowDetail(false);
            setRefresh(refresh + 1);
          }}
        />
      ) : (
        <></>
      )}
      <PanelTitleContainer>数据面板</PanelTitleContainer>
      <PanelToolsContainer>
        <PanelToolContainer>
          <CaseSearch
            placeholder="input search text"
            // TODO 方法要加
            onSearch={() => {}}
          />
        </PanelToolContainer>
      </PanelToolsContainer>
      <PanelContentContainer>
        {!showDetail && (
          <CaseList
            data={data}
            onShow={(id) => {
              setSelectedItem(id);
              setShowDetail(true);
            }}
          ></CaseList>
        )}
      </PanelContentContainer>
    </PanelContainer>
  );
};

export default CasePanel;
