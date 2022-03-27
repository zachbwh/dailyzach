import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  ImageBackground,
} from "react-native";
import { Camera, CameraCapturedPicture } from "expo-camera";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FlipType, manipulateAsync, SaveFormat } from "expo-image-manipulator";

export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [selfie, setSelfie] = useState<CameraCapturedPicture | null>(null);
  const appState = useRef(AppState.currentState);
  const [isActive, setIsActive] = useState(appState.current === "active");
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      } catch (err) {
        setHasPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    const eventListener = (nextAppState: AppStateStatus) => {
      setIsActive(nextAppState === "active");
    };

    AppState.addEventListener("change", eventListener);

    return () => {
      AppState.removeEventListener("change", eventListener);
    };
  }, []);

  if (hasPermission === null || !isActive) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log(selfie);
  return (
    <View style={styles.container}>
      {selfie && (
        <ImageBackground style={styles.image} source={selfie}>
          <View style={styles.imageButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                setSelfie(null);
              }}
            >
              <FontAwesomeIcon
                icon={faXmark}
                style={styles.buttonIcon}
                size={80}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                setSelfie(null);
              }}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={styles.buttonIcon}
                size={80}
              />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      )}
      {!selfie && (
        <Camera
          style={styles.camera}
          type={Camera.Constants.Type.front}
          ref={cameraRef}
        >
          <View style={styles.viewfinderButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let selfie = await cameraRef.current?.takePictureAsync();
                var flippedSelfie

                if (selfie) {
                  flippedSelfie = await manipulateAsync(
                    selfie.uri,
                    [
                      { flip: FlipType.Horizontal },
                    ],
                    { compress: 1, format: SaveFormat.PNG }
                  );
                }
                
                setSelfie(flippedSelfie || null);
              }}
            >
              <FontAwesomeIcon
                icon={faCircle}
                style={styles.buttonIcon}
                size={80}
              />
            </TouchableOpacity>
          </View>
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%",
  },
  image: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%",
  },
  button: {
    flex: 0,
    color: "#fff",
    // backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  buttonIcon: {
    color: "#fff",
  },
  viewfinderButtonContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  imageButtonContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  text: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
