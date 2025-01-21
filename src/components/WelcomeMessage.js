import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const GeneralContainer = styled.div`
  border: 2px solid lightgray;
  background: rgb(242, 242, 242);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

const CircleImage = styled.div`
  height: 140px;
  width: 140px;
  border: 4px solid #136ea0;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px;
`;

const StyledButton = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
`;

function WelcomeMessage({ logo }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/dev/users")
      .then((response) => setUsers(response.data))
      .catch((error) => {
        console.error("Error al cargar los usuarios", error);
      });
  }, []);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/provider-list");
  };

  return (
    <GeneralContainer>
      <div className="col-lg-12 py-5 mx-auto">
        <CircleImage>
          <img src={logo} alt="Company logo" style={{ width: "130px" }} />
        </CircleImage>
        {users.length > 0 ? (
          <h3 key={users[0].id} style={{ color: "gray" }}>
            Bienvenido {users[0].name} {users[0].lastname}
          </h3>
        ) : (
          <h3 style={{ color: "gray" }}>Cargando...</h3>
        )}
        <StyledButton onClick={handleClick}>Continuar</StyledButton>
      </div>
    </GeneralContainer>
  );
}

export default WelcomeMessage;
