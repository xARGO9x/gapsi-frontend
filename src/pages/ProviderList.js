import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styled from "styled-components";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import editIcon from "../assets/circle-plus-solid.svg";
const Container = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const SearchInput = styled.input`
  width: 30vh;
  height: 30px;
  padding: 5px;
  margin-bottom: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

function ProviderList() {
  const [filterText, setFilterText] = useState("");
  const [providerList, setProviderList] = useState([]);
  const [modalState, setModalState] = useState({
    show: false,
    type: "",
    provider: null,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3000/dev/providers")
      .then((response) => setProviderList(response.data))
      .catch((error) => console.error("Error al cargar los usuarios", error));
  }, []);

  const filteredData = providerList.filter((item) =>
    [item.name, item.company_name, item.address].some((field) =>
      field.toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3000/dev/providers/${id}`)
          .then(() => {
            Swal.fire(
              "Eliminado!",
              "El proveedor ha sido eliminado.",
              "success"
            );
            setProviderList((prevList) =>
              prevList.filter((provider) => provider.id !== id)
            );
          })
          .catch((error) => {
            console.error("Error al eliminar el proveedor", error);
            Swal.fire(
              "Error!",
              "Hubo un problema al eliminar el proveedor.",
              "error"
            );
          });
      }
    });
  };

  const handleModalSave = () => {
    const method = modalState.type === "add" ? "post" : "put";
    const url =
      modalState.type === "add"
        ? "http://localhost:3000/dev/providers"
        : `http://localhost:3000/dev/providers/${modalState.provider.id}`;
    console.log(
      "Enviando los siguientes datos:",
      url,
      modalState.provider,
      method
    );

    axios[method](url, modalState.provider)
      .then((response) => {
        if (modalState.type === "add") {
          setProviderList([...providerList, response.data]);
          Swal.fire("Éxito!", "El proveedor ha sido agregado.", "success");
        } else {
          setProviderList(
            providerList.map((provider) =>
              provider.id === modalState.provider.id
                ? modalState.provider
                : provider
            )
          );
          Swal.fire("Éxito!", "El proveedor ha sido actualizado.", "success");
        }
        setModalState({ show: false, type: "", provider: null });
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          Swal.fire(
            "Error!",
            "El proveedor ya se encuentra registrado.",
            "error"
          );
        } else {
          console.error("Error al guardar el proveedor", error);
          Swal.fire(
            "Error!",
            "Hubo un problema al guardar el proveedor.",
            "error"
          );
        }
      });
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Razón Social",
      selector: (row) => row.company_name,
      sortable: true,
    },
    {
      name: "Domicilio",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "Operaciones",
      cell: (row) => (
        <ButtonContainer>
          <button
            className="btn btn-info btn-sm"
            onClick={() =>
              setModalState({ show: true, type: "edit", provider: { ...row } })
            }
          >
            Editar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </button>
        </ButtonContainer>
      ),
    },
  ];

  return (
    <Container>
      <h2>Lista de Proveedores</h2>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        subHeader
        subHeaderComponent={
          <>
            <img
              src={editIcon}
              placeholder="Agegar nuevo"
              alt="Agregar proveedor"
              style={{
                marginTop: "-10px",
                padding: "5px",
                marginRight: "10px",
                width: "30px",
                cursor: "pointer",
              }}
              onClick={() =>
                setModalState({
                  show: true,
                  type: "add",
                  provider: {
                    id: null,
                    name: "",
                    company_name: "",
                    address: "",
                  },
                })
              }
            />

            <SearchInput
              type="text"
              placeholder="Buscar..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </>
        }
      />

      {modalState.show && (
        <Modal
          show={modalState.show}
          onHide={() =>
            setModalState({ show: false, type: "", provider: null })
          }
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {modalState.type === "add"
                ? "Agregar Proveedor"
                : "Editar Proveedor"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>Nombre:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Nombre"
              value={modalState.provider.name}
              onChange={(e) =>
                setModalState((prevState) => ({
                  ...prevState,
                  provider: { ...prevState.provider, name: e.target.value },
                }))
              }
            />
            <br />
            <label>Razón Social:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Razón Social"
              value={modalState.provider.company_name}
              onChange={(e) =>
                setModalState((prevState) => ({
                  ...prevState,
                  provider: {
                    ...prevState.provider,
                    company_name: e.target.value,
                  },
                }))
              }
            />
            <br />
            <label>Domicilio:</label>
            <input
              className="form-control"
              type="text"
              placeholder="Domicilio"
              value={modalState.provider.address}
              onChange={(e) =>
                setModalState((prevState) => ({
                  ...prevState,
                  provider: { ...prevState.provider, address: e.target.value },
                }))
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() =>
                setModalState({ show: false, type: "", provider: null })
              }
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleModalSave}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default ProviderList;
