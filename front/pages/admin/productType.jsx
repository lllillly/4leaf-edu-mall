import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AdminLayout from "../../components/AdminLayout";
import AdminTitle from "../../components/adminTitle";
import {
  PRODUCT_TYPE_REQUEST,
  CREATE_MODAL_TOGGLE,
  UPDATE_MODAL_TOGGLE,
  PRODUCT_TYPE_CREATE_REQUEST,
  PRODUCT_TYPE_DELETE_REQUEST,
  PRODUCT_TYPE_UPDATE_REQUEST,
} from "../../reducers/productType";
import { Button, Modal, Table, Form, Input, message, Popconfirm } from "antd";

const BtnWrapper = styled.div`
  width: 100%;
  margin-bottom: 10px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ViewText = styled.div`
  font-size: 1rem;
`;

const ContentWrapper = styled.div`
  padding: 10px;
`;

const ProductType = () => {
  const [updateId, setUpdateId] = useState(null);

  const {
    types,
    createModal,
    st_typeCreateDone,
    st_typeDeleteDone,
    st_typeUpdateDone,
    updateModal,
  } = useSelector((state) => state.productType);
  const dispatch = useDispatch();

  const [cForm] = Form.useForm(); //Reset Field 모달 껐다 켰을 때 내용 사라지게
  const cFormRef = useRef();

  const [uForm] = Form.useForm(); //Reset Field 모달 껐다 켰을 때 내용 사라지게
  const uFormRef = useRef();

  useEffect(() => {
    dispatch({
      type: PRODUCT_TYPE_REQUEST,
    });
  }, []);

  useEffect(() => {
    if (st_typeCreateDone) {
      message.success("새로운 상품유형이 둥록되었습니다.");
    }

    dispatch({
      type: PRODUCT_TYPE_REQUEST,
    });
  }, [st_typeCreateDone]);

  useEffect(() => {
    if (st_typeDeleteDone) {
      message.success("상품유형이 삭제되었습니다.");
      dispatch({
        type: PRODUCT_TYPE_REQUEST,
      });
    }
  }, [st_typeDeleteDone]);

  const createModalHandler = useCallback(() => {
    cForm.resetFields();

    dispatch({ type: CREATE_MODAL_TOGGLE });
  }, [createModal]);

  useEffect(() => {
    if (st_typeUpdateDone) {
      message.success("상품유형이 삭제되었습니다.");
      dispatch({
        type: PRODUCT_TYPE_REQUEST,
      });
    }
  }, [st_typeUpdateDone]);

  const updateModalHandler = useCallback(
    (data) => {
      cForm.resetFields();
      if (data) {
        setUpdateId(data.id);
        uForm.setFieldsValue({
          typeName: data.value,
        });
      } else {
        setUpdateId(null);
        uForm.setFieldsValue({
          typeName: "",
        });
      }

      cForm.resetFields();

      dispatch({ type: UPDATE_MODAL_TOGGLE });
    },
    [updateModal]
  );

  const formFinishHandler = useCallback((data) => {
    dispatch({
      type: PRODUCT_TYPE_CREATE_REQUEST,
      data: data,
    });
  }, []);

  const deleteClickHandler = useCallback((data) => {
    console.log(data.id);

    dispatch({
      type: PRODUCT_TYPE_DELETE_REQUEST,
      data: { id: data.id },
    });
  });

  const updateClickHandler = useCallback((data) => {
    dispatch({
      type: PRODUCT_TYPE_UPDATE_REQUEST,
      data: {
        id: updateId,
        typeName: data.typeName,
      },
    });
  });

  const columns = [
    {
      title: "번호",
      dataIndex: "id",
      render: (data) => <ViewText>{data}</ViewText>,
      // width: "30%",
    },
    {
      title: "상품유형",
      dataIndex: "value",
      render: (data) => <ViewText>{data}</ViewText>,
    },
    {
      title: "생성일",
      dataIndex: "createdAt",
      render: (data) => <ViewText>{String(data).split("T")[0]}</ViewText>,
    },
    {
      title: "수정",
      render: (data) => (
        <Button
          type="primary"
          size="small"
          onClick={() => updateModalHandler(data)}
        >
          수정
        </Button>
      ),
    },
    {
      title: "삭제",
      render: (data) => (
        <Popconfirm
          title="정말 삭제하시겠습니까?"
          okText="DELETE"
          cancelText="CANCEL"
          onConfirm={() => deleteClickHandler(data)}
        >
          <Button type="danger" size="small">
            삭제
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <AdminLayout>
      <AdminTitle title="상품 유형 관리" />

      <ContentWrapper>
        <BtnWrapper>
          <Button type="primary" size="middle" onClick={createModalHandler}>
            유형생성
          </Button>
        </BtnWrapper>
        <Table
          rowKey="id"
          columns={columns}
          size="small"
          dataSource={types}
          pagination={{ position: ["bottomCenter"] }}
        />
      </ContentWrapper>

      <Modal
        visible={createModal}
        title="유형생성"
        footer={null}
        onCancel={createModalHandler}
      >
        <Form
          ref={cFormRef}
          form={cForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          onFinish={formFinishHandler}
        >
          <Form.Item label="유형명" name="typeName">
            <Input allowClear={true} />
          </Form.Item>

          <BtnWrapper>
            <Button size="small" type="primary" htmlType="submit">
              생성
            </Button>
            {/* button htmlType=submit : form 태그 실행 */}
          </BtnWrapper>
        </Form>
      </Modal>

      <Modal
        visible={updateModal}
        title="유형수정"
        footer={null}
        onCancel={() => updateModalHandler(null)}
      >
        <Form
          ref={uFormRef}
          form={uForm}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 20 }}
          onFinish={updateClickHandler}
        >
          <Form.Item label="유형명" name="typeName">
            <Input allowClear={true} />
          </Form.Item>

          <BtnWrapper>
            <Button size="small" type="primary" htmlType="submit">
              생성
            </Button>
            {/* button htmlType=submit : form 태그 실행 */}
          </BtnWrapper>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default ProductType;
