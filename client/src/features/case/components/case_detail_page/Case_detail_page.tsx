/*
 * @File: CasePage component
 * @Author: xiaohan kong
 * @Date: 2023-02-16
 * @LastEditors: xiaohan kong
 * @LastEditTime: 2023-03-09
 *
 * Copyright (c) 2023 by xiaohan kong, All Rights Reserved.
 */

import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components/macro";
import { ServerCase } from "../../../../types";
import useCase from "../../hooks/use_case";

// CasePage Container sytle
const CaseContainer = styled.div`
  display: flex;
  flex-flow: column;
  position: absolute;
  width: 340px;
  height: 100%;
  background-color: #fff;
  z-index: 9;
`;
// CasePage title container
const CaseTitleContainer = styled.div`
  height: 48px;
  line-height: 48px;
  font-size: 18px;
  font-weight: bold;
  padding: 0 12px;
`;
// CasePage close symbol style
const StyledCloseOutlined = styled(CloseOutlined)`
  position: absolute;
  top: 10px;
  right: 4px;
  font-size: 18px;
  padding: 6px;
  :hover {
    background: #f0f0f0;
  }
`;
// CasePage Image container
const CaseImageContainer = styled.div`
  height: 240px;
  border-bottom: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
  .view {
    height: 100%;
    width: 100%;
    padding: 8px;
    outline: 1px solid #d9d9d9;
    outline-offset: -8px;
  }
`;
// CasePage tags container
const CaseTagsContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
`;
// CasePage meta container
const CaseMetaContainer = styled.div`
  height: 40px;
  border-bottom: 1px solid #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
`;
// CasePage description container
const CaseDescriptionContainer = styled.div`
  flex: 1 1 0;
  border-bottom: 1px solid #d9d9d9;
`;

const CaseDataActionContainer = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type AppProps = {
  id: string;
  onClose: () => void;
};

/**
 * @description CasePage
 * @module CasePage
 * @Author xiaohan kong
 * @param id data id
 * @param onClose click event for the top left close symbol, close CasePage component
 * @export module: CasePage
 */
const CasePage = ({ id, onClose }: AppProps) => {
  const [data, setData] = useState<ServerCase>();
  const caseActions = useCase();

  useEffect(() => {
    axios.get("http://localhost:3456/case/case?id=" + id).then((res) => {
      if (typeof res.data === "object") setData(res.data);
    });
  }, [id]);

  // NOTE marginInlineEnd: "auto" ?????????
  return data ? (
    <CaseContainer>
      <CaseTitleContainer>{data.title}</CaseTitleContainer>
      <StyledCloseOutlined onClick={onClose} />
      <CaseImageContainer>
        <img alt="view" className="view" src={data.image} />
      </CaseImageContainer>
      <CaseTagsContainer>{data.tags}</CaseTagsContainer>
      <CaseMetaContainer>
        <div style={{ marginInlineEnd: "auto", paddingInlineStart: "10px" }}>
          ??????: {data.author}
        </div>
        <div style={{ paddingInlineEnd: "10px" }}>????????????: {data.time.split("T")[0]}</div>
      </CaseMetaContainer>
      <CaseDescriptionContainer>{data.description}</CaseDescriptionContainer>
      <CaseDataActionContainer>
        <Button
          type="primary"
          style={{ marginInlineStart: "auto", marginInlineEnd: "10px", fontSize: "14px" }}
          onClick={() => {
            caseActions.addCase(id);
          }}
        >
          ???????????????
        </Button>
      </CaseDataActionContainer>
    </CaseContainer>
  ) : (
    <></>
  );
};

export default CasePage;
