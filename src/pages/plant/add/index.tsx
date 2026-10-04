import React from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "react-vant";
import { PlantForm } from "../../../components/plant/PlantForm";
import { useStore } from "../../../store";
import { useTitle } from "../../../hooks";

const AddPlant: React.FC = () => {
  useTitle();
  const navigate = useNavigate();
  const addPlant = useStore((s) => s.addPlant);

  return (
    <PlantForm
      title="添加植物"
      submitText="添加植物"
      onSubmit={async (values) => {
        await addPlant(values);
        Toast.success("植物添加成功！");
        navigate("/plant/list");
      }}
    />
  );
};

export default AddPlant;
