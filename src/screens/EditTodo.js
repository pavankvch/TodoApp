import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity, FlatList, Image
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { editTodo, promiseHandler } from "../api/ApiService";
import { TextInput, Button, Snackbar } from 'react-native-paper';
import Toast from 'react-native-simple-toast';


const EditTodo = ({ route, navigation }) => {
    const [text, setText] = React.useState("");
    const [visible, setVisible] = React.useState(false);
    const { title, id } = route.params;


    const onDismissSnackBar = () => setVisible(false);

    useEffect(() => {
        setText(title)
    }, []);

    async function editTodoClick(todoTitle) {
        const json = {
            title: todoTitle,
            userId: 1,
            completed: false
        };
        console.log("json ==>" + JSON.stringify(json));
        const [data, error] = await promiseHandler(editTodo(id, json));

        Toast.show("Task Saved Successfully");
        if (data) {
            navigation.goBack()
        } else {
            console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
        }
    }

    return (
        <View style={styles.container}>

            <TextInput style={styles.textStyle}
                label="Title"
                mode="outlined"
                value={text}
                onChangeText={text => setText(text)}
            />

            <TextInput style={styles.descStyle}
                label="Description"
                mode="outlined"
                onChangeText={text => console.log(text)}
            />

            <Button style={styles.buttonStyle}
                mode="contained"
                onPress={() =>
                    editTodoClick(text)}>
                Save
            </Button>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    textStyle: {
        height: 60,
        margin: 10
    },
    descStyle: {
        height: 100,
        margin: 10
    },
    buttonStyle: {
        margin: 50
    },
});
export default EditTodo