import { useEffect } from "react"
import { ImageBackground, Image, StyleSheet } from "react-native"

export default function TelaSplash({ navigation }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Presentation")
        }, 2000)

        return () => clearTimeout(timer)
    }, [navigation])

    return (
        <ImageBackground
            source={require("../assets/fundo.png")}
            style={styles.fundo}
            resizeMode="cover"
        >
            <Image
                source={require("../assets/Logo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    fundo: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%'
    },
    logo: {
        width: 180,
        height: 180
    },
})