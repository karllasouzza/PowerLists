import React, { useRef, useState } from "react";
import { Text, Button } from "react-native";
import { BarcodeContainer } from "./styles";
import { useCameraPermissions, CameraView } from "expo-camera";
import { showToast } from "../../../services/toast";
import { View } from "react-native";
import axios from "axios";

export default function BarcodeScan({ setProduct, handleClose, background }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View>
        <Text>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    console.log({ type, data });
    setScanned(true);
    handleClose();

    try {
      const response = await axios.get(
        `https://world.openfoodfacts.net/api/v2/product/${data}?fields=product_name,brands`
      );

      setProduct(
        `${response.data.product.brands} ${response.data.product.product_name}`
      );

      showToast({
        title: `Produto escaneado com sucesso!`,
        type: "success",
      });
    } catch (error) {
      console.error("Error fetching product name:", error);
      showToast({
        title: `Erro ao escanear o produto. Por favor tente novamente.`,
        type: "error",
      });
    }
  };

  if (permission === null) {
    return <View />;
  }
  if (permission === false) {
    showToast({
      title: "Sem acesso a câmera!",
      type: "error",
    });
    return <View />;
  }

  return (
    <BarcodeContainer background={background}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["upc_a"],
        }}
        enableTorch={true}
        style={{ display: "flex", width: "100%", height: "100%" }}
      ></CameraView>
    </BarcodeContainer>
  );
}
