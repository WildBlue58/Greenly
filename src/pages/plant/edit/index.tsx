import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Toast } from "react-vant";
import { PlantForm } from "../../../components/plant/PlantForm";
import { useStore } from "../../../store";
import { useTitle } from "../../../hooks";
import formStyles from "../../../components/plant/PlantForm.module.css";

const EditPlant: React.FC = () => {
  useTitle();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const plants = useStore((s) => s.plants);
  const updatePlant = useStore((s) => s.updatePlant);

  const plant = id ? plants.find((p) => p.id === id) : undefined;

  if (!plant) {
    return (
      <div className={formStyles.plantForm}>
        <div className={formStyles.content}>
          <div className={formStyles.formCard}>
            <p style={{ textAlign: "center", padding: "24px 0" }}>
              植物不存在或已被删除
            </p>
            <Button block type="primary" onClick={() => navigate("/plant/list")}>
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PlantForm
      key={plant.id}
      title="编辑植物"
      submitText="保存更改"
      initialValues={plant}
      onSubmit={async (values) => {
        await updatePlant(plant.id, values);
        Toast.success("植物信息更新成功！");
        navigate(`/plant/detail/${plant.id}`);
      }}
    />
  );
};

export default EditPlant;
