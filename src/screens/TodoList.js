import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity, FlatList, Image
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { deleteTodo, getAllTodos, promiseHandler } from "../api/ApiService";
import { FloatingAction } from "react-native-floating-action";

const TodoList = () => {

    const [todoData, setTodoData] = useState([]);
    const [visible, setVisible] = React.useState(true);


    useEffect(() => {
        getTodos()
    }, []);


    async function getTodos() {
        const [data, error] = await promiseHandler(getAllTodos());
        if (data) {
            // console.log("response getTodos" + JSON.stringify(data));
            setTodoData(data)
        } else {
            console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
        }
    }

    async function deleteTodoClick(todoId) {
        const [data, error] = await promiseHandler(deleteTodo(todoId));
        if (data) {
            console.log("response getTodos" + JSON.stringify(data));
            // setTodoData(data)

        } else {
            console.log(data?.errorMsg ?? error?.errorMsg ?? Strings.defaultError);
        }
    }


    const TodoItem = ({ item, index }) => {

        return (
            <View style={styles.container2}>
                <View style={styles.columnContainer}>
                    <Text style={styles.labelBlack}>{item.title}</Text>
                    <TouchableOpacity onPress={() => { deleteTodoClick(item.id) }}>
                        <Image source={require("../assets/deleteicon.png")} style={{ height: 20, width: 20 }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderItem = ({ item }) => (
        <TodoItem item={item} />
    );


    return (
        <View style={styles.container}>
            {todoData && (
                <FlatList
                    data={todoData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            )}

            <View style={styles.container}>
                <FloatingAction
                    position="right"
                    onPressMain = {() => {
                        
                    }}
                />
            </View>

        </View>

    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    container2: {
        flex: 1,
        margin: 16
    },
    columnContainer: {
        flexDirection: "row",
    },
    labelBlack: {
        flex: 1,
        color: "#000000",
        fontSize: 13,
        fontStyle: "normal",
    },
});

export default TodoList